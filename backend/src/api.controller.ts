import { Body, CanActivate, ConflictException, Controller, ExecutionContext, ForbiddenException, Get, Injectable, Param, Post as HttpPost, Put, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Application, Job, Post, Profile, User } from './entities';

@Injectable() export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(c: ExecutionContext) {
    const r = c.switchToHttp().getRequest();
    try { r.user = this.jwt.verify((r.headers.authorization || '').slice(7)); return true; }
    catch { throw new UnauthorizedException('Please log in'); }
  }
}
const need = (u: any, role: string) => { if (u.role !== role) throw new ForbiddenException(`${role}s only`); };

@Controller()
export class ApiController {
  constructor(
    private jwt: JwtService,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Profile) private profiles: Repository<Profile>,
    @InjectRepository(Post) private posts: Repository<Post>,
    @InjectRepository(Job) private jobs: Repository<Job>,
    @InjectRepository(Application) private apps: Repository<Application>,
  ) {}

  private token(u: User) { return { token: this.jwt.sign({ sub: u.id, role: u.role }), role: u.role }; }

  // One profile, one CV: the CV is always assembled live from profile + posts.
  private async cv(profileId: string) {
    const p = await this.profiles.findOneByOrFail({ id: profileId });
    const posts = await this.posts.find({ where: { profileId }, order: { createdAt: 'DESC' } });
    return { ...p, skills: [...new Set([...p.skills, ...posts.flatMap((x) => x.skills)])],
      projects: posts.filter((x) => x.type === 'project'), posts };
  }
  private myProfile(u: any) { return this.profiles.findOneByOrFail({ userId: u.sub }); }

  @HttpPost('auth/register') async register(@Body() b: any) {
    if (await this.users.findOneBy({ email: b.email })) throw new ConflictException('Email already used');
    const role = b.role === 'recruiter' ? 'recruiter' : 'seeker';
    const u = await this.users.save({ email: b.email, password: await bcrypt.hash(b.password, 8), role });
    if (role === 'seeker') await this.profiles.save({ userId: u.id, fullName: b.fullName, city: b.city, education: b.education || '', headline: b.headline || '' });
    return this.token(u);
  }
  @HttpPost('auth/login') async login(@Body() b: any) {
    const u = await this.users.findOneBy({ email: b.email });
    if (!u || !(await bcrypt.compare(b.password, u.password))) throw new UnauthorizedException('Wrong email or password');
    return this.token(u);
  }

  // Public: government dashboard
  @Get('stats') async stats() {
    const rows = await this.profiles.createQueryBuilder('p').select('p.city', 'city').addSelect('COUNT(*)', 'count')
      .where("p.status = 'unemployed'").groupBy('p.city').orderBy('count', 'DESC').getRawMany();
    const byCity = rows.map((r) => ({ city: r.city, count: Number(r.count) }));
    return { total: byCity.reduce((s, r) => s + r.count, 0), byCity };
  }

  @UseGuards(AuthGuard) @Get('me') async me(@Req() r: any) { return this.cv((await this.myProfile(r.user)).id); }
  @UseGuards(AuthGuard) @Put('me') async update(@Req() r: any, @Body() b: any) {
    const p = await this.myProfile(r.user); const { fullName, city, education, headline, status } = b;
    await this.profiles.update(p.id, { fullName, city, education, headline, status }); return this.cv(p.id);
  }
  @UseGuards(AuthGuard) @HttpPost('posts') async post(@Req() r: any, @Body() b: any) {
    need(r.user, 'seeker'); const p = await this.myProfile(r.user);
    const skills = (b.skills || []).map((s: string) => s.trim()).filter(Boolean);
    await this.posts.save({ profileId: p.id, type: b.type, title: b.title, body: b.body || '', skills });
    // auto-update profile: new skills + work experience
    p.skills = [...new Set([...p.skills, ...skills])];
    if (b.type === 'work') p.experience = [{ title: b.title, description: b.body, date: new Date().toISOString().slice(0, 10) }, ...p.experience];
    await this.profiles.save(p); return this.cv(p.id);
  }

  @UseGuards(AuthGuard) @Get('profiles') async list(@Req() r: any, @Query() q: any) {
    need(r.user, 'recruiter');
    const qb = this.profiles.createQueryBuilder('p').orderBy('p.createdAt', 'DESC').limit(100);
    if (q.city) qb.andWhere('p.city = :c', { c: q.city });
    if (q.skill) qb.andWhere('LOWER(:s) = ANY(SELECT LOWER(x) FROM unnest(p.skills) x)', { s: q.skill });
    return qb.getMany();
  }
  @UseGuards(AuthGuard) @Get('profiles/:id') async one(@Req() r: any, @Param('id') id: string) { need(r.user, 'recruiter'); return this.cv(id); }

  @Get('jobs') listJobs() { return this.jobs.find({ order: { createdAt: 'DESC' } }); }
  @UseGuards(AuthGuard) @HttpPost('jobs') async newJob(@Req() r: any, @Body() b: any) {
    need(r.user, 'recruiter'); return this.jobs.save({ recruiterId: r.user.sub, title: b.title, company: b.company, city: b.city, description: b.description || '' });
  }
  @UseGuards(AuthGuard) @HttpPost('jobs/:id/apply') async apply(@Req() r: any, @Param('id') id: string) {
    need(r.user, 'seeker'); const p = await this.myProfile(r.user);
    if (!(await this.apps.findOneBy({ jobId: id, profileId: p.id }))) await this.apps.save({ jobId: id, profileId: p.id });
    return { ok: true };
  }
  // Recruiter sees each applicant's complete, always-current profile
  @UseGuards(AuthGuard) @Get('jobs/:id/applications') async applicants(@Req() r: any, @Param('id') id: string) {
    need(r.user, 'recruiter');
    const job = await this.jobs.findOneByOrFail({ id, recruiterId: r.user.sub });
    const apps = await this.apps.findBy({ jobId: id });
    return { job, applicants: await Promise.all(apps.map((a) => this.cv(a.profileId))) };
  }
}

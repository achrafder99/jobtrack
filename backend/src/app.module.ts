import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ApiController, AuthGuard } from './api.controller';
import { Application, Job, Post, Profile, User } from './entities';

const E = [User, Profile, Post, Job, Application];
const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan'];
const SKILLS = ['JavaScript', 'Excel', 'Accounting', 'Sales', 'Design', 'Python', 'Customer service', 'Welding', 'Nursing', 'French'];

@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'postgres', url: process.env.DATABASE_URL || 'postgres://jt:jt@localhost:5432/jobtrack', entities: E, synchronize: true }),
    TypeOrmModule.forFeature(E),
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET || 'dev-secret', signOptions: { expiresIn: '7d' } }),
  ],
  controllers: [ApiController],
  providers: [AuthGuard],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectRepository(Profile) private p: Repository<Profile>) {}
  async onModuleInit() { // demo data: run with SEED=1
    if (!process.env.SEED || (await this.p.count())) return;
    const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];
    const rows = Array.from({ length: 300 }, (_, i) => this.p.create({
      userId: 'seed', fullName: `Demo Seeker ${i + 1}`, city: pick(CITIES.concat(CITIES.slice(0, 4))), education: pick(['Bac', 'Licence', 'Master', 'Technical diploma']),
      headline: 'Looking for my first opportunity', skills: [pick(SKILLS), pick(SKILLS)], status: Math.random() < 0.85 ? 'unemployed' : 'employed' }));
    await this.p.save(rows);
  }
}

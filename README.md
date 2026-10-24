# JobTrack MVP (Next.js + Tailwind + NestJS + Postgres)
1. `docker compose up -d`
2. `cd backend && npm i && SEED=1 npm run start:dev`  (API on :4000, SEED=1 adds 300 demo job seekers)
3. `cd frontend && npm i && npm run dev`  (UI on :3000)
Register as `recruiter` to browse talents/post jobs, or `seeker` to build a profile.
Env (optional): DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_API.

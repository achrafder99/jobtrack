'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, role, CITIES } from '../../lib/api';
export default function Jobs() {
  const [jobs, setJobs] = useState([]); const [f, setF] = useState({ city: CITIES[0] }); const [msg, setMsg] = useState(''); const [r, setR] = useState(null);
  const load = () => api('/jobs').then(setJobs).catch(() => {}); useEffect(() => { setR(role()); load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const create = async (e) => { e.preventDefault(); await api('/jobs', 'POST', f); load(); };
  const apply = async (id) => { try { await api(`/jobs/${id}/apply`, 'POST'); setMsg('Application sent with your current profile.'); } catch (e) { setMsg(e.message); } };
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Jobs</h1>{msg && <p className="text-zel">{msg}</p>}
    {r === 'recruiter' && <form onSubmit={create} className="bg-white rounded p-4 space-y-2"><b>Post a job</b>
      <input className="in" placeholder="Title" onChange={set('title')} required /><input className="in" placeholder="Company" onChange={set('company')} required />
      <select className="in" onChange={set('city')}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <textarea className="in" placeholder="Description" onChange={set('description')} /><button className="btn">Publish job</button></form>}
    {jobs.map((j) => (<div key={j.id} className="bg-white rounded p-4"><b>{j.title}</b> · {j.company} · {j.city}<p className="text-sm">{j.description}</p>
      {r === 'seeker' && <button className="btn mt-2" onClick={() => apply(j.id)}>Apply with my profile</button>}
      {r === 'recruiter' && <Link className="underline text-zel text-sm" href={`/jobs/${j.id}`}>View applicants</Link>}</div>))}
    {!jobs.length && <p>No jobs posted yet.</p>}</div>);
}

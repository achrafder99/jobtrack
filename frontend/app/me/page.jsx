'use client';
import { useEffect, useState } from 'react';
import { api, CITIES } from '../../lib/api';
import Cv from '../../lib/Cv';
export default function Me() {
  const [p, setP] = useState(null); const [err, setErr] = useState(''); const [post, setPost] = useState({ type: 'project', title: '', body: '', skills: '' });
  useEffect(() => { api('/me').then(setP).catch((e) => setErr(e.message)); }, []);
  if (err) return <p className="text-clay">{err}. <a className="underline" href="/login">Log in as a job seeker</a>.</p>;
  if (!p) return <p>Loading…</p>;
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const save = async () => setP(await api('/me', 'PUT', p));
  const publish = async (e) => { e.preventDefault();
    setP(await api('/posts', 'POST', { ...post, skills: post.skills.split(',') })); setPost({ ...post, title: '', body: '', skills: '' }); };
  const up = (k) => (e) => setPost({ ...post, [k]: e.target.value });
  return (<div className="space-y-8">
    <section className="space-y-2"><h1 className="text-2xl font-bold">Your profile</h1>
      <input className="in" value={p.fullName} onChange={set('fullName')} />
      <select className="in" value={p.city} onChange={set('city')}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <input className="in" placeholder="Education" value={p.education} onChange={set('education')} />
      <input className="in" placeholder="Headline" value={p.headline} onChange={set('headline')} />
      <select className="in" value={p.status} onChange={set('status')}><option value="unemployed">Looking for work</option><option value="employed">Employed</option></select>
      <button className="btn" onClick={save}>Save profile</button></section>
    <form onSubmit={publish} className="space-y-2"><h2 className="font-semibold">Share an update. Your CV updates itself.</h2>
      <select className="in" value={post.type} onChange={up('type')}>
        <option value="project">Project</option><option value="skill">New skill</option><option value="work">Work experience</option><option value="progress">Progress</option></select>
      <input className="in" placeholder="Title" value={post.title} onChange={up('title')} required />
      <textarea className="in" placeholder="What did you do or learn?" value={post.body} onChange={up('body')} />
      <input className="in" placeholder="Skills used, comma separated" value={post.skills} onChange={up('skills')} />
      <button className="btn">Publish</button></form>
    <section><h2 className="font-semibold mb-2">Your CV (live)</h2><Cv p={p} /></section>
  </div>);
}

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, CITIES } from '../../lib/api';
export default function Talents() {
  const [list, setList] = useState([]); const [city, setCity] = useState(''); const [skill, setSkill] = useState(''); const [err, setErr] = useState('');
  useEffect(() => { api(`/profiles?city=${city}&skill=${encodeURIComponent(skill)}`).then(setList).catch((e) => setErr(e.message)); }, [city, skill]);
  if (err) return <p className="text-clay">{err}. <a className="underline" href="/login">Log in as a recruiter</a>.</p>;
  return (<div><h1 className="text-2xl font-bold mb-4">Job seekers</h1>
    <div className="flex gap-3 mb-4"><select className="in" onChange={(e) => setCity(e.target.value)}><option value="">All cities</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <input className="in" placeholder="Filter by skill" onChange={(e) => setSkill(e.target.value)} /></div>
    {list.map((p) => (<Link key={p.id} href={`/talents/${p.id}`} className="block bg-white rounded p-4 mb-2 hover:ring-2 ring-zel">
      <b>{p.fullName}</b> <span className="text-sm">· {p.city} · {p.education}</span><p className="text-sm">{p.headline}</p>
      <p className="text-sm text-zel">{p.skills.join(', ')}</p></Link>))}
    {!list.length && <p>No profiles match these filters.</p>}</div>);
}

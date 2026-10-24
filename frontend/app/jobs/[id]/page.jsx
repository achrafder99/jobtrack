'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import Cv from '../../../lib/Cv';
export default function Applicants() {
  const { id } = useParams(); const [d, setD] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { api(`/jobs/${id}/applications`).then(setD).catch((e) => setErr(e.message)); }, [id]);
  if (err) return <p className="text-clay">{err}</p>; if (!d) return <p>Loading…</p>;
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">{d.job.title}: {d.applicants.length} applicants</h1>
    {d.applicants.map((p) => <Cv key={p.id} p={p} />)}{!d.applicants.length && <p>No applications yet.</p>}</div>);
}

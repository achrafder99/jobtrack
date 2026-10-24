'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import Cv from '../../../lib/Cv';
export default function Talent() {
  const { id } = useParams(); const [p, setP] = useState(null); const [err, setErr] = useState('');
  useEffect(() => { api('/profiles/' + id).then(setP).catch((e) => setErr(e.message)); }, [id]);
  return err ? <p className="text-clay">{err}</p> : p ? <Cv p={p} /> : <p>Loading…</p>;
}

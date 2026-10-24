'use client';
import { useState } from 'react';
import { api, CITIES } from '../../lib/api';
export default function Login() {
  const [reg, setReg] = useState(false); const [f, setF] = useState({ role: 'seeker', city: CITIES[0] }); const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async (e) => { e.preventDefault(); try {
    const d = await api(reg ? '/auth/register' : '/auth/login', 'POST', f);
    localStorage.setItem('t', d.token); localStorage.setItem('r', d.role); location.href = d.role === 'seeker' ? '/me' : '/talents';
  } catch (x) { setErr(x.message); } };
  return (<form onSubmit={go} className="max-w-sm space-y-3">
    <h1 className="text-2xl font-bold">{reg ? 'Create your account' : 'Log in'}</h1>
    {reg && <select className="in" onChange={set('role')}><option value="seeker">I'm looking for work</option><option value="recruiter">I'm a recruiter</option></select>}
    {reg && f.role === 'seeker' && <>
      <input className="in" placeholder="Full name" onChange={set('fullName')} required />
      <select className="in" onChange={set('city')}>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <input className="in" placeholder="Education (e.g. Licence in Economics)" onChange={set('education')} />
      <input className="in" placeholder="Headline (e.g. Junior accountant)" onChange={set('headline')} /></>}
    <input className="in" type="email" placeholder="Email" onChange={set('email')} required />
    <input className="in" type="password" placeholder="Password" onChange={set('password')} required />
    {err && <p className="text-clay">{err}</p>}
    <button className="btn w-full">{reg ? 'Create account' : 'Log in'}</button>
    <button type="button" className="underline text-sm" onClick={() => setReg(!reg)}>{reg ? 'I already have an account' : 'Create an account'}</button>
  </form>);
}

export const API = process.env.NEXT_PUBLIC_API || 'http://localhost:4000/api';
export const CITIES = ['Casablanca','Rabat','Marrakech','Fes','Tangier','Agadir','Meknes','Oujda','Kenitra','Tetouan'];
export async function api(path, method = 'GET', body) {
  const t = typeof window !== 'undefined' && localStorage.getItem('t');
  const r = await fetch(API + path, { method, headers: { 'Content-Type': 'application/json', ...(t && { Authorization: 'Bearer ' + t }) }, body: body && JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || 'Something went wrong');
  return d;
}
export const role = () => (typeof window !== 'undefined' && localStorage.getItem('r')) || null;

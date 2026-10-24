'use client';
import { useEffect, useMemo, useState } from 'react';

const BLUE = '#2a3cd8', NAVY = '#14206b';

/* ---------- mock data ---------- */
const CITIES = [
  { n: 'Casablanca', c: 184200, m: 8 }, { n: 'Rabat', c: 96400, m: 5 }, { n: 'Marrakech', c: 88100, m: 10 },
  { n: 'Fes', c: 79300, m: 12 }, { n: 'Tangier', c: 74800, m: 7 }, { n: 'Agadir', c: 52600, m: 9 },
  { n: 'Meknes', c: 41200, m: 11 }, { n: 'Oujda', c: 39800, m: 14 }, { n: 'Kenitra', c: 36500, m: 8 }, { n: 'Tetouan', c: 31900, m: 9 },
];
const EDU = { Bac: 0.31, 'Technical diploma': 0.27, Licence: 0.29, Master: 0.13 };
const FIELDS = ['Tech', 'Design', 'Accounting', 'Trades', 'Health', 'Languages'];
const TREND = [751, 746, 738, 733, 728, 725];
const TALENTS = [
  { id: 1, name: 'Salma Benali', city: 'Rabat', edu: 'Master', field: 'Tech', type: 'project', m: 4, shared: true, title: 'Built a bus-arrival tracker for my neighborhood', body: 'Next.js and a small Node API. 1,200 people used it during Ramadan. I want to build products like this full time.', skills: ['React', 'Node', 'PostgreSQL'],
    cv: { edu: 'Master in Computer Science, Mohammed V University', exp: ['Freelance web developer, 2023 to present', 'Software intern, regional digital agency, 2022'], langs: 'Arabic, French, English' } },
  { id: 2, name: 'Youssef El Idrissi', city: 'Fes', edu: 'Technical diploma', field: 'Trades', type: 'skill', m: 9, shared: false, title: 'Certified in solar panel installation', body: 'Finished the 6-week course last month and wired two rooftops already. Ready to start on any site.', skills: ['Solar', 'Electrical', 'Safety'],
    cv: { edu: 'Technical diploma in Electricity', exp: ['Electrician assistant, 2021 to 2024'], langs: 'Arabic, French' } },
  { id: 3, name: 'Khadija Amrani', city: 'Casablanca', edu: 'Licence', field: 'Accounting', type: 'work', m: 3, shared: true, title: 'Cleaned up the books for 6 small shops', body: 'Freelance bookkeeping while I search. Cut one shop\'s monthly closing from 5 days to 1.', skills: ['Excel', 'Sage', 'VAT'],
    cv: { edu: 'Licence in Management, Hassan II University', exp: ['Freelance bookkeeper, 2024 to present', 'Accounting intern, trading company, 2023'], langs: 'Arabic, French, English' } },
  { id: 4, name: 'Omar Lahlou', city: 'Marrakech', edu: 'Bac', field: 'Design', type: 'project', m: 7, shared: false, title: 'Redesigned a riad\'s booking page', body: 'I redrew the booking flow in Figma and the owner shipped it. More work in my posts.', skills: ['Figma', 'UX', 'Branding'],
    cv: { edu: 'Baccalaureate, then self-taught design', exp: ['Freelance designer, 2022 to present'], langs: 'Arabic, French' } },
  { id: 5, name: 'Imane Rachidi', city: 'Tangier', edu: 'Licence', field: 'Languages', type: 'skill', m: 5, shared: true, title: 'Reached C1 in Spanish, on top of Arabic, French and English', body: 'Looking for customer support or translation work in logistics or the port sector.', skills: ['Spanish', 'Translation', 'Support'],
    cv: { edu: 'Licence in Spanish Studies, Abdelmalek Essaadi University', exp: ['Call-center agent, 2023 to 2025'], langs: 'Arabic, French, English, Spanish' } },
  { id: 6, name: 'Anas Mouline', city: 'Oujda', edu: 'Master', field: 'Health', type: 'work', m: 12, shared: true, title: 'Volunteered 400 hours as a lab technician', body: 'Clinical analysis, sample handling and data entry. I know the equipment and need a contract.', skills: ['Lab', 'Hygiene', 'Reporting'],
    cv: { edu: 'Master in Biomedical Analysis, Mohammed I University', exp: ['Volunteer lab technician, 2024 to present'], langs: 'Arabic, French, English' } },
];
const EMPLOYERS = [{ n: 'Riad Studio', r: 92, d: 2 }, { n: 'Souss Foods', r: 87, d: 4 }, { n: 'Medina Telecom', r: 18, d: 21 }, { n: 'Sahara Digital', r: 11, d: 29 }, { n: 'Atlas Freight Co.', r: 4, d: 41 }];
const TAGS = { project: 'Project', skill: 'New skill', work: 'Work done' };
const PAL = ['#2a3cd8', '#0f8a6d', '#7a3fd0', '#c2410c'];
const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('');
const STAR = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cpath d='M28 4l6 13 14-6-6 14 14 6-14 6 6 14-14-6-6 14-6-14-14 6 6-14-14-6 14-6-6-14 14 6z' fill='none' stroke='%23fff' stroke-opacity='.1'/%3E%3C/svg%3E\")";

const Lock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>;

export default function Dashboard() {
  const [sel, setSel] = useState([]);
  const [edu, setEdu] = useState('All');
  const [field, setField] = useState('All');
  const [q, setQ] = useState('');
  const [items, setItems] = useState(TALENTS);
  const [saved, setSaved] = useState({});
  const [asked, setAsked] = useState({});
  const [myShare, setMyShare] = useState(false);
  const [cvOf, setCvOf] = useState(null);
  const [toast, setToast] = useState('');
  const [draft, setDraft] = useState({ type: 'project', title: '', skills: '' });

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!cvOf) return; const k = (e) => e.key === 'Escape' && setCvOf(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [cvOf]);

  const share = edu === 'All' ? 1 : EDU[edu];
  const rows = useMemo(() => CITIES.map((c) => ({ ...c, v: Math.round(c.c * share) })), [share]);
  const active = rows.filter((r) => !sel.length || sel.includes(r.n));
  const total = active.reduce((s, r) => s + r.v, 0);
  const avg = (active.reduce((s, r) => s + r.m * r.v, 0) / Math.max(total, 1)).toFixed(1);
  const max = Math.max(...rows.map((r) => r.v));
  const list = items.filter((t) =>
    (!sel.length || sel.includes(t.city)) && (edu === 'All' || t.edu === edu) && (field === 'All' || t.field === field) &&
    (!q || (t.name + t.title + t.skills.join(' ')).toLowerCase().includes(q.toLowerCase())));
  const toggle = (n) => setSel((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  const pts = TREND.map((v, i) => `${i * 40 + 5},${50 - (v - 720) * 1.4}`).join(' ');
  const isShared = (t) => (t.mine ? myShare : t.shared);

  const publish = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const e_ = edu === 'All' ? 'Licence' : edu;
    setItems([{ id: Date.now(), mine: true, name: 'You', city: sel[0] || 'Casablanca', edu: e_, field: field === 'All' ? 'Tech' : field, type: draft.type, m: 0,
      title: draft.title, body: 'Recruiters can see this post. Your CV is updated from it automatically.', skills: draft.skills.split(',').map((s) => s.trim()).filter(Boolean),
      cv: { edu: e_, exp: ['Built automatically from your posts.'], langs: 'Arabic, French' } }, ...items]);
    setDraft({ ...draft, title: '', skills: '' }); setToast('Posted. Your CV has been updated.');
  };

  const chip = (on) => `shrink-0 rounded-full border px-3 py-1 text-[13px] transition ${on ? 'border-[#2a3cd8] bg-[#2a3cd8] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-[#2a3cd8]'}`;
  const ctl = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a3cd8]';
  const h2 = 'text-xl font-semibold tracking-tight';
  const kpis = [[total.toLocaleString(), 'registered job seekers without work'], [`${avg} months`, 'average time searching'], ['9%', 'applications that receive a reply'], ['3,420', 'found work this month']];

  return (
    <div className="text-sm text-slate-900" style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)', marginTop: -24, marginBottom: -24 }}>
      <style>{`html,body{overflow-x:clip}.zel{background-color:${NAVY};background-image:${STAR}}`}</style>

      {/* HERO */}
      <section className="zel on-dark text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr] md:py-16">
          <div>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">Unemployment in Morocco, city by city</h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-blue-100">Reliable data for policymakers, and verified profiles for recruiters. Job seekers describe what they can do once, and their CV stays up to date on its own.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#feed" className="rounded-md bg-white px-4 py-2.5 font-medium" style={{ color: NAVY }}>Share what you can do</a>
              <a href="#feed" className="rounded-md border border-white/40 px-4 py-2.5 font-medium hover:bg-white/10">Browse talents</a>
            </div>
          </div>
          <dl className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <dt className="text-blue-100">Without work{sel.length ? ` in ${sel.join(', ')}` : ' nationwide'}</dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums tracking-tight">{total.toLocaleString()}</dd>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div><dt className="text-xs text-blue-100">Average search</dt><dd className="text-lg font-medium">{avg} months</dd></div>
              <div><dt className="text-xs text-blue-100">Change since May</dt><dd className="text-lg font-medium">-3.5%</dd></div>
            </div>
          </dl>
        </div>
      </section>

      {/* KPI STRIP */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 md:grid-cols-4 md:divide-x md:divide-slate-200">
          {kpis.map(([a, b], i) => (
            <div key={i} className="py-4 md:px-6 md:first:pl-0">
              <p className="text-2xl font-semibold tabular-nums tracking-tight" style={{ color: NAVY }}>{a}</p>
              <p className="text-xs text-slate-600">{b}</p>
            </div>))}
        </div>
      </section>

      {/* FILTERS */}
      <div className="md:sticky md:top-16 z-20 border-b border-slate-200 bg-white/90 backdrop-blur" role="search" aria-label="Filters">
        <div className="mx-auto max-w-6xl space-y-2.5 px-5 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <button aria-pressed={!sel.length} className={chip(!sel.length)} onClick={() => setSel([])}>All Morocco</button>
            {CITIES.map((c) => <button key={c.n} aria-pressed={sel.includes(c.n)} className={chip(sel.includes(c.n))} onClick={() => toggle(c.n)}>{c.n}</button>)}
          </div>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Education level" className={ctl} value={edu} onChange={(e) => setEdu(e.target.value)}><option value="All">Any education</option>{Object.keys(EDU).map((e) => <option key={e}>{e}</option>)}</select>
            <select aria-label="Field" className={ctl} value={field} onChange={(e) => setField(e.target.value)}><option value="All">Any field</option>{FIELDS.map((f) => <option key={f}>{f}</option>)}</select>
            <input aria-label="Search" className={`${ctl} min-w-[180px] flex-1`} placeholder="Search by name, skill or project" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
      </div>

      {/* BODY */}
      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-12">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className={h2}>Job seekers by city</h2>
              <div className="text-right text-xs text-slate-600">
                <svg width="215" height="56" viewBox="0 0 215 56" role="img" aria-label="Unemployment trend since May"><polyline points={pts} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
                Down 3.5% since May
              </div>
            </div>
            <div className="space-y-0.5 rounded-xl border border-slate-200 bg-white p-4">
              {rows.map((r) => {
                const on = !sel.length || sel.includes(r.n);
                return (
                  <button key={r.n} onClick={() => toggle(r.n)} aria-pressed={sel.includes(r.n)} className={`grid w-full grid-cols-[84px_1fr_60px] items-center gap-3 rounded-md py-1.5 text-left transition hover:bg-slate-50 sm:grid-cols-[92px_1fr_64px_110px] ${on ? '' : 'opacity-40'}`}>
                    <span className="font-medium">{r.n}</span>
                    <span className="h-2.5 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full transition-all duration-500" style={{ width: `${(r.v / max) * 100}%`, background: BLUE }} /></span>
                    <span className="text-right tabular-nums">{r.v.toLocaleString()}</span>
                    <span className="hidden text-xs text-slate-600 sm:block">{r.m} months average</span>
                  </button>);
              })}
            </div>
          </section>

          <section id="feed" className="scroll-mt-48">
            <h2 className={h2}>What job seekers can do</h2>
            <p className="mb-4 mt-1 text-slate-600">Each post updates the author's profile. Their full CV is shown only if they allow it.</p>

            <form onSubmit={publish} className="mb-5 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
              <input aria-label="What can you do" className={`${ctl} w-full`} placeholder="Describe something you can do or have done" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              <div className="flex flex-wrap gap-2">
                <select aria-label="Post type" className={ctl} value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>{Object.entries(TAGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
                <input aria-label="Skills" className={`${ctl} min-w-[160px] flex-1`} placeholder="Skills, separated by commas" value={draft.skills} onChange={(e) => setDraft({ ...draft, skills: e.target.value })} />
                <button className="rounded-md px-4 py-1.5 font-medium text-white hover:opacity-90" style={{ background: BLUE }}>Post</button>
              </div>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
                <button type="button" role="switch" aria-checked={myShare} aria-label="Allow recruiters to view my CV" onClick={() => setMyShare(!myShare)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${myShare ? 'bg-[#2a3cd8]' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${myShare ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
                <p><span className="font-medium">Allow recruiters to view my CV.</span> <span className="text-slate-600">Currently {myShare ? 'visible' : 'private'}. You can change this at any time.</span></p>
              </div>
            </form>

            <div className="space-y-4">
              {list.map((t) => {
                const open = isShared(t);
                return (
                  <article key={t.id} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: PAL[t.id % 4] }}>{initials(t.name)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold leading-tight">{t.name}</p>
                        <p className="text-xs text-slate-600">{t.city} · {t.edu} · {t.field}</p>
                      </div>
                      <div className="text-right text-xs leading-snug text-slate-600">
                        <p>{t.m ? `Searching ${t.m} months` : 'Just joined'}</p>
                        <p className={`mt-0.5 inline-flex items-center gap-1 ${open ? 'text-emerald-700' : ''}`}>{open ? <><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />CV shared</> : <><Lock />CV private</>}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs font-medium" style={{ color: BLUE }}>{TAGS[t.type]}</p>
                    <h3 className="text-base font-semibold leading-snug">{t.title}</h3>
                    <p className="mt-1 max-w-prose text-slate-600">{t.body}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">{t.skills.map((s) => <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-xs">{s}</span>)}</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-md px-3.5 py-1.5 font-medium text-white hover:opacity-90" style={{ background: BLUE }} onClick={() => setToast(`Interview invitation sent to ${t.name}.`)}>Invite to interview</button>
                      {open
                        ? <button className="rounded-md border border-slate-300 px-3.5 py-1.5 font-medium hover:bg-slate-50" onClick={() => setCvOf(t)}>View CV</button>
                        : <button disabled={asked[t.id]} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3.5 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-60" onClick={() => { setAsked({ ...asked, [t.id]: true }); setToast(`Access request sent to ${t.name}. They decide whether to share.`); }}><Lock />{asked[t.id] ? 'Access requested' : 'Request CV access'}</button>}
                      <button aria-pressed={!!saved[t.id]} className={`rounded-md border px-3.5 py-1.5 font-medium ${saved[t.id] ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 hover:bg-slate-50'}`} onClick={() => setSaved({ ...saved, [t.id]: !saved[t.id] })}>{saved[t.id] ? 'Saved' : 'Save'}</button>
                    </div>
                  </article>);
              })}
              {!list.length && <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">No profiles match these filters. Clear a filter or post your own.</div>}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6 self-start lg:sticky lg:top-48">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Employer response rates</h2>
            <p className="mb-3 text-xs text-slate-600">Share of applicants who received any reply. Demo data.</p>
            {EMPLOYERS.map((c) => (
              <div key={c.n} className="border-t border-slate-100 py-2.5">
                <div className="flex justify-between gap-2"><p className="font-medium">{c.n}</p><p className="tabular-nums">{c.r}%</p></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${c.r}%`, background: c.r < 25 ? '#c2410c' : BLUE }} /></div>
                <p className="mt-1 text-xs text-slate-600">Median reply time: {c.d} days</p>
              </div>))}
          </section>
          <section className="rounded-xl border border-blue-100 bg-[#eef0fd] p-5">
            <h2 className="font-semibold" style={{ color: NAVY }}>Your CV, your decision</h2>
            <p className="mt-1.5 text-slate-700">Recruiters always see your posts, skills and city. Your complete CV stays private until you turn sharing on, and you can turn it off whenever you like.</p>
          </section>
        </aside>
      </main>

      {/* CV DIALOG */}
      {cvOf && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/50 p-4" onClick={() => setCvOf(null)}>
          <div role="dialog" aria-modal="true" aria-labelledby="cv-title" className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cv-title" className="text-xl font-semibold tracking-tight">{cvOf.name}</h2>
                <p className="text-slate-600">{cvOf.field} · {cvOf.city}</p>
              </div>
              <button autoFocus aria-label="Close CV" className="rounded-md border border-slate-300 px-2.5 py-1 hover:bg-slate-50" onClick={() => setCvOf(null)}>Close</button>
            </div>
            <dl className="mt-5 space-y-4">
              <div><dt className="text-xs font-medium text-slate-500">Education</dt><dd>{cvOf.cv.edu}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Experience</dt><dd><ul className="list-disc pl-5">{cvOf.cv.exp.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Skills</dt><dd className="mt-1 flex flex-wrap gap-1.5">{cvOf.skills.map((s) => <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-xs">{s}</span>)}</dd></div>
              <div><dt className="text-xs font-medium text-slate-500">Languages</dt><dd>{cvOf.cv.langs}</dd></div>
            </dl>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-600">Shared by {cvOf.name}. They can withdraw access at any time.</p>
          </div>
        </div>
      )}

      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2.5 text-white shadow-lg">{toast}</div>}
    </div>
  );
}
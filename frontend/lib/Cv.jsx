export default function Cv({ p }) {
  return (<article className="bg-white rounded p-6 space-y-4">
    <header><h2 className="text-2xl font-bold">{p.fullName}</h2><p>{p.headline}</p><p className="text-sm">{p.city} · {p.education} · {p.status === 'unemployed' ? 'Available' : 'Employed'}</p></header>
    <section><h3 className="font-semibold">Skills</h3><p>{p.skills.join(', ') || '—'}</p></section>
    <section><h3 className="font-semibold">Experience</h3>{p.experience.map((x, i) => <p key={i}><b>{x.title}</b> <span className="text-sm">({x.date})</span> {x.description}</p>)}{!p.experience.length && <p>—</p>}</section>
    <section><h3 className="font-semibold">Projects</h3>{p.projects.map((x) => <p key={x.id}><b>{x.title}</b> {x.body}</p>)}{!p.projects.length && <p>—</p>}</section>
    <section><h3 className="font-semibold">Recent posts</h3>{p.posts.slice(0, 5).map((x) => <p key={x.id} className="text-sm">[{x.type}] {x.title}</p>)}{!p.posts.length && <p>—</p>}</section>
  </article>);
}

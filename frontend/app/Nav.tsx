'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [['/', 'Overview'], ['/talents', 'Talents'], ['/me', 'My profile']];

// Plain CSS on purpose: the nav looks the same whether or not Tailwind scans this file,
// and the links stay visible at every width (they move to a second row on phones).
const CSS = `
.jt-nav{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid #e2e8f0}
.jt-in{max-width:1152px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;gap:28px}
.jt-logo{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;letter-spacing:-.01em;color:#14206b;text-decoration:none}
.jt-mark{width:34px;height:34px;border-radius:9px;background:#2a3cd8;color:#fff;display:grid;place-items:center;box-shadow:0 1px 2px rgba(20,32,107,.25)}
.jt-links{display:flex;gap:4px;margin-right:auto}
.jt-links a{padding:8px 14px;border-radius:8px;font-size:14px;color:#475569;text-decoration:none;transition:background .15s,color .15s;white-space:nowrap}
.jt-links a:hover{background:#f1f5f9;color:#0f172a}
.jt-links a[aria-current=page]{background:#eef0fd;color:#2a3cd8;font-weight:500}
.jt-actions{display:flex;align-items:center;gap:8px}
.jt-actions a{padding:9px 16px;border-radius:8px;font-size:14px;font-weight:500;text-decoration:none;white-space:nowrap}
.jt-ghost{color:#334155}.jt-ghost:hover{background:#f1f5f9}
.jt-cta{background:#2a3cd8;color:#fff;box-shadow:0 1px 2px rgba(20,32,107,.25)}.jt-cta:hover{background:#2433b8}
@media (max-width:720px){
  .jt-in{height:auto;flex-wrap:wrap;padding:10px 16px 0;gap:8px 10px}
  .jt-logo{margin-right:auto}
  .jt-actions a{padding:8px 12px;font-size:13px}
  .jt-links{order:3;width:100%;margin:0;padding-bottom:8px;border-top:1px solid #eef0f4;padding-top:8px}
  .jt-links a{flex:1;text-align:center;padding:8px 6px}
}`;

export default function Nav() {
  const path = usePathname();
  const on = (href) => (href === '/' ? path === '/' : path.startsWith(href));
  return (
    <header className="jt-nav">
      <style>{CSS}</style>
      <nav aria-label="Main" className="jt-in">
        <Link href="/" className="jt-logo">
          <span className="jt-mark">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 1l2.6 6.4L21 4l-3.4 6.4L24 12l-6.4 1.6L21 20l-6.4-3.4L12 23l-2.6-6.4L3 20l3.4-6.4L0 12l6.4-1.6L3 4l6.4 3.4z" /></svg>
          </span>
          JobTrack
        </Link>
        <div className="jt-links">
          {LINKS.map(([href, label]) => <Link key={href} href={href} aria-current={on(href) ? 'page' : undefined}>{label}</Link>)}
        </div>
        <div className="jt-actions">
          <Link href="/login" className="jt-ghost">Log in</Link>
          <Link href="/login" className="jt-cta">Create profile</Link>
        </div>
      </nav>
    </header>
  );
}
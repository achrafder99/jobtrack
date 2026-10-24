import './globals.css';
import { IBM_Plex_Sans } from 'next/font/google';
import Nav from './Nav';

const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex' });

export const metadata = { title: 'JobTrack', description: 'Unemployment data by city and verified job seeker profiles' };

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={plex.variable} style={{ fontFamily: 'var(--font-plex), system-ui, sans-serif', background: '#f3f5fb' }}>
        <style>{`
          a:focus-visible,button:focus-visible{outline:2px solid #2a3cd8;outline-offset:2px}
          .on-dark a:focus-visible,.on-dark button:focus-visible{outline-color:#fff}
        `}</style>
        <Nav />
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
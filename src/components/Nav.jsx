import { Link, useLocation } from 'react-router-dom';
import AnimatedLogo from './AnimatedLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/guide', label: 'Guide' },
  { to: '/developer', label: 'Developer' },
  { to: '/encryption', label: 'Encryption' },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', marginBottom: '12px' }}>
      <AnimatedLogo size={64} />
      <Link to="/" style={{ color: '#ebdbb2', textDecoration: 'none', fontWeight: 700, fontSize: '16px', letterSpacing: '1px' }}>
        FoldDB
      </Link>
      <span style={{ flex: 1 }} />
      {NAV_LINKS.filter(link => link.to !== pathname).map(link => (
        <Link key={link.to} to={link.to} className="link-btn">[{link.label}]</Link>
      ))}
      <a href="https://github.com/shiba4life/fold_db" target="_blank" rel="noreferrer" className="link-btn">[GitHub]</a>
    </nav>
  );
}

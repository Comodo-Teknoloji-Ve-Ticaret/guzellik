import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SALON } from '../data/catalog';

const LINKS = [
  { href: '#kampanyalar', label: 'Kampanyalar' },
  { href: '#cihazlar', label: 'Cihazlarımız' },
  { href: '#paket-olustur', label: 'Paket Oluştur' },
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#sss', label: 'SSS' },
];

interface Props {
  onBook: () => void;
  onMyAppointments: () => void;
}

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label={SALON.fullName}>
      NÜANS
      <small>Lazer & Cilt Bakım</small>
    </a>
  );
}

export default function Navbar({ onBook, onMyAppointments }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Logo />
        <ul className="nav-links">
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="btn-text" onClick={onMyAppointments}>Randevularım</button>
          <button className="btn btn-sm btn-cta" onClick={onBook}>Randevu Al</button>
          <button className="nav-burger" aria-label="Menüyü aç" onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo />
            <button className="modal-close" aria-label="Menüyü kapat" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>
          <nav>
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
          </nav>
          <div style={{ display: 'grid', gap: 10, marginTop: 'auto' }}>
            <button className="btn btn-line" onClick={() => { setOpen(false); onMyAppointments(); }}>Randevularım</button>
            <button className="btn btn-dark" onClick={() => { setOpen(false); onBook(); }}>Online Randevu Al</button>
          </div>
        </div>
      )}
    </header>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero, { Intro } from './components/Hero';
import Packages from './components/Packages';
import PackageBuilder from './components/PackageBuilder';
import Devices from './components/Devices';
import { Faq, Footer, Services, Testimonials } from './components/Sections';
import BookingModal, { type BookingPreset } from './components/BookingModal';
import MyAppointments from './components/MyAppointments';
import { SALON } from './data/catalog';
import { useReveal } from './hooks';

export default function App() {
  const [booking, setBooking] = useState<BookingPreset | null>(null);
  const [mine, setMine] = useState(false);
  useReveal();

  const openBooking = useCallback((preset: BookingPreset = {}) => {
    setMine(false);
    setBooking(preset);
  }, []);
  const closeBooking = useCallback(() => setBooking(null), []);
  const closeMine = useCallback(() => setMine(false), []);
  const book = () => openBooking();

  // Deep link: /#randevu opens the booking flow (e.g. from an Instagram bio link)
  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#randevu') {
        openBooking();
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [openBooking]);

  return (
    <>
      <Navbar onBook={book} onMyAppointments={() => setMine(true)} />
      <main>
        <Hero onBook={openBooking} />
        <Intro />
        <Packages onBook={openBooking} />
        <Devices />
        <PackageBuilder onBook={openBooking} />
        <Services onBook={openBooking} />
        <Testimonials />
        <Faq />
      </main>
      <Footer onBook={book} />

      <div className="mobile-cta">
        <a className="btn btn-line" href={SALON.phoneHref}><Phone size={17} /> Ara</a>
        <button className="btn btn-dark" onClick={book}>Online Randevu Al</button>
      </div>

      {booking && <BookingModal preset={booking} onClose={closeBooking} />}
      {mine && <MyAppointments onClose={closeMine} onBook={book} />}
    </>
  );
}

import { useCallback, useState } from 'react';
import { CalendarHeart, Phone } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero, { Marquee } from './components/Hero';
import Packages from './components/Packages';
import PackageBuilder from './components/PackageBuilder';
import Devices from './components/Devices';
import { Faq, Footer, Process, Services, Testimonials } from './components/Sections';
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

  return (
    <>
      <Navbar onBook={book} onMyAppointments={() => setMine(true)} />
      <main>
        <Hero onBook={book} />
        <Marquee />
        <Packages onBook={openBooking} />
        <PackageBuilder onBook={openBooking} />
        <Devices />
        <Services onBook={openBooking} />
        <Process />
        <Testimonials />
        <Faq />
      </main>
      <Footer onBook={book} />

      <div className="mobile-cta">
        <a className="btn btn-ghost" href={SALON.phoneHref}><Phone size={17} /> Ara</a>
        <button className="btn btn-rose" onClick={book}><CalendarHeart size={17} /> Randevu Al</button>
      </div>

      {booking && <BookingModal preset={booking} onClose={closeBooking} />}
      {mine && <MyAppointments onClose={closeMine} onBook={book} />}
    </>
  );
}

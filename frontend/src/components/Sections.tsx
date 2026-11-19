import { useState } from 'react';
import { ArrowLeft, ArrowRight, AtSign, MapPin, MessageCircle, Phone, Plus, Star } from 'lucide-react';
import type { ServiceCategory } from '../types';
import { CATEGORY_LABEL, FAQS, SALON, TESTIMONIALS } from '../data/catalog';
import { salonApi } from '../services/api';
import { tl, useAsync } from '../hooks';
import type { BookingPreset } from './BookingModal';
import { Logo } from './Navbar';

export function Services({ onBook }: { onBook: (p: BookingPreset) => void }) {
  const { data, loading } = useAsync(() => salonApi.getServices());
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all');
  const list = (data ?? []).filter((s) => cat === 'all' || s.category === cat);

  return (
    <section className="section section-alt" id="hizmetler">
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="kicker">Hizmetlerimiz</span>
            <h2>Tek seanslık uygulamalar.</h2>
            <p>Paket almadan önce denemek isteyenler için tüm hizmetlerimiz tek seans olarak da sunulur.</p>
          </div>
          <div className="tabs">
            {(['all', 'lazer', 'cilt', 'vucut'] as const).map((c) => (
              <button key={c} className={`tab ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                {c === 'all' ? 'Tümü' : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="loader" /> : (
          <div className="svc-grid">
            {list.map((s) => (
              <button className="svc reveal" key={s.id} onClick={() => onBook({ serviceId: s.id })} aria-label={`${s.name} için randevu al`}>
                <div className="ph">
                  <img src={s.image} alt="" loading="lazy" />
                  <span className="go">Randevu al <ArrowRight size={16} /></span>
                </div>
                <small>{CATEGORY_LABEL[s.category]}</small>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="meta">{s.durationMinutes} dk · {tl(s.priceFrom)}’den başlayan</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const go = (d: number) => setI((x) => (x + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  return (
    <section className="section">
      <div className="container testi">
        <div className="ph reveal"><img src="img/yorum.jpg" alt="Cilt bakımı uygulaması" loading="lazy" /></div>
        <div className="reveal">
          <span className="kicker">Danışan Yorumları</span>
          <div className="stars" aria-label={`${t.rating} / 5`}>
            {Array.from({ length: 5 }, (_, k) => <Star key={k} size={16} fill={k < t.rating ? 'currentColor' : 'none'} />)}
          </div>
          <blockquote key={i}>“{t.text}”</blockquote>
          <cite><b>{t.name}</b><span>{t.service}</span></cite>
          <div className="testi-nav">
            <button aria-label="Önceki yorum" onClick={() => go(-1)}><ArrowLeft size={18} /></button>
            <button aria-label="Sonraki yorum" onClick={() => go(1)}><ArrowRight size={18} /></button>
            <span>{String(i + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section section-alt" id="sss">
      <div className="container faq-wrap">
        <div className="head reveal">
          <span className="kicker">Sıkça Sorulanlar</span>
          <h2>Aklınıza takılanlar.</h2>
          <p>Başka bir sorunuz varsa WhatsApp’tan yazın, uzmanlarımız aynı gün dönüş yapsın.</p>
          <a className="btn btn-line" style={{ marginTop: 28 }} href={SALON.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> WhatsApp’tan sorun
          </a>
        </div>
        <div className="reveal">
          {FAQS.map((f, k) => (
            <div className={`faq-item ${open === k ? 'open' : ''}`} key={f.q}>
              <button className="faq-q" aria-expanded={open === k} onClick={() => setOpen(open === k ? -1 : k)}>
                {f.q} <Plus size={20} />
              </button>
              <div className="faq-a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ onBook }: { onBook: () => void }) {
  return (
    <>
      <section className="cta">
        <img src="img/klasik-bakim.jpg" alt="" loading="lazy" />
        <div className="container reveal">
          <span className="kicker">İlk ziyaret</span>
          <h2>Cilt analizi ve deneme atışı bizden.</h2>
          <p>Uygun saatleri görün, randevunuzu bir dakikada oluşturun. Onay SMS’i 30 dakika içinde gelir.</p>
          <div className="cta-actions">
            <button className="btn btn-light" onClick={onBook}>Online Randevu Al <ArrowRight size={18} /></button>
            <a className="btn btn-line-light" href={SALON.phoneHref}><Phone size={17} /> {SALON.phone}</a>
          </div>
        </div>
      </section>
      <footer className="footer" id="iletisim">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p style={{ marginTop: 22, maxWidth: 300 }}>
                Medikal cihazlar ve uzman kadroyla lazer epilasyon, cilt bakımı ve vücut uygulamaları.
              </p>
            </div>
            <div>
              <h4>Keşfet</h4>
              <ul>
                <li><a href="#kampanyalar">Kampanyalar</a></li>
                <li><a href="#cihazlar">Cihazlarımız</a></li>
                <li><a href="#paket-olustur">Paket Oluştur</a></li>
                <li><a href="#hizmetler">Hizmetler</a></li>
              </ul>
            </div>
            <div>
              <h4>Çalışma saatleri</h4>
              <ul className="hours">
                {SALON.hours.map((h) => <li key={h.day}><span>{h.day}</span>{h.time}</li>)}
              </ul>
            </div>
            <div>
              <h4>İletişim</h4>
              <ul>
                <li style={{ display: 'flex', gap: 10 }}><MapPin size={16} style={{ flexShrink: 0, marginTop: 4 }} /> {SALON.address}</li>
                <li><a href={SALON.phoneHref} style={{ display: 'flex', gap: 10 }}><Phone size={16} /> {SALON.phone}</a></li>
                <li><a href={SALON.instagram} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 10 }}><AtSign size={16} /> Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {SALON.fullName}</span>
            <span>Uygulamalar uzman estetisyenler tarafından, hekim denetiminde yapılır.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

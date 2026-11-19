import { useState } from 'react';
import {
  ArrowRight, CalendarCheck, Clock, Droplets, MapPin, MessageCircle, Phone, Plus,
  ScanFace, Sparkles, Star, Wand2, Zap, AtSign,
} from 'lucide-react';
import type { ServiceCategory } from '../types';
import { CATEGORY_LABEL, FAQS, SALON, TESTIMONIALS } from '../data/catalog';
import { salonApi } from '../services/api';
import { tl, useAsync } from '../hooks';
import type { BookingPreset } from './BookingModal';
import { Logo } from './Navbar';

const ICONS: Record<ServiceCategory, typeof Zap> = { lazer: Zap, cilt: Droplets, vucut: Wand2 };

export function Services({ onBook }: { onBook: (p: BookingPreset) => void }) {
  const { data, loading } = useAsync(() => salonApi.getServices());
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all');
  const list = (data ?? []).filter((s) => cat === 'all' || s.category === cat);

  return (
    <section className="section section-alt" id="hizmetler">
      <div className="container">
        <div className="pkg-toolbar">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Hizmetlerimiz</span>
            <h2>Tek seanslık <em>bakımlar</em></h2>
            <p>Paket almadan önce denemek isteyenler için tüm hizmetlerimiz tek seans olarak da sunulur.</p>
          </div>
          <div className="chips">
            {(['all', 'lazer', 'cilt', 'vucut'] as const).map((c) => (
              <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                {c === 'all' ? 'Tümü' : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="loader" /> : (
          <div className="svc-grid">
            {list.map((s) => {
              const Icon = ICONS[s.category];
              return (
                <article className="card svc reveal" key={s.id}>
                  <div className="svc-ic"><Icon size={21} /></div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <div className="svc-foot">
                    <span><Clock size={13} style={{ verticalAlign: -2 }} /> {s.durationMinutes} dk · <strong>{tl(s.priceFrom)}</strong>’den</span>
                    <button onClick={() => onBook({ serviceId: s.id })} aria-label={`${s.name} için randevu al`}>
                      Randevu <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { icon: CalendarCheck, t: 'Online randevu', d: 'Hizmeti, uzmanı ve size uyan saati seçin. Onay SMS’i 30 dk içinde gelir.' },
    { icon: ScanFace, t: 'Ücretsiz analiz', d: 'İlk ziyarette cilt ve kıl analizi yapılır, deneme atışı ile cihaz belirlenir.' },
    { icon: Sparkles, t: 'Kişisel plan', d: 'Seans aralıkları ve bakım önerileri size özel planlanır, paketiniz tanımlanır.' },
    { icon: MessageCircle, t: 'Takip', d: 'Her seans sonrası hatırlatma ve kontrol mesajı; sonuçlarınızı birlikte izleriz.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Nasıl Çalışır</span>
          <h2>İlk randevudan <em>sonuca</em> kadar</h2>
        </div>
        <div className="steps">
          {steps.map((s) => (
            <div className="card step reveal" key={s.t}>
              <div className="svc-ic"><s.icon size={21} /></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Danışan Yorumları</span>
          <h2>Bize <em>güvenenler</em> anlatıyor</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <figure className="card testi reveal" key={t.name}>
              <div className="stars" aria-label={`${t.rating} / 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={15} fill={i < t.rating ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p>“{t.text}”</p>
              <footer><strong>{t.name}</strong><span>{t.service}</span></footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="sss">
      <div className="container faq-wrap">
        <div className="section-head reveal">
          <span className="eyebrow">Sıkça Sorulanlar</span>
          <h2>Aklınıza <em>takılanlar</em></h2>
          <p>Başka bir sorunuz varsa WhatsApp’tan yazın, uzmanlarımız aynı gün dönüş yapsın.</p>
          <a className="btn btn-ghost" style={{ marginTop: 24 }} href={SALON.whatsapp} target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> WhatsApp’tan Sor
          </a>
        </div>
        <div className="reveal">
          {FAQS.map((f, i) => (
            <div className={`faq-item ${open === i ? 'open' : ''}`} key={f.q}>
              <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
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
      <section className="container reveal" style={{ marginBottom: 20 }}>
        <div className="cta-band">
          <div>
            <h2>İlk seansınızda <em>deneme atışı</em> bizden.</h2>
            <p>Cilt analizi ve deneme atışı ücretsizdir. Uygun saatleri görün, randevunuzu hemen oluşturun.</p>
          </div>
          <div className="cta-actions">
            <button className="btn btn-rose" onClick={onBook}>Online Randevu Al <ArrowRight size={18} /></button>
            <a className="btn btn-ghost" href={SALON.phoneHref}><Phone size={17} /> {SALON.phone}</a>
          </div>
        </div>
      </section>
      <footer className="footer" id="iletisim">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p style={{ marginTop: 16, maxWidth: 300 }}>
                Medikal cihazlar ve uzman kadroyla lazer epilasyon, cilt bakımı ve vücut uygulamaları.
              </p>
            </div>
            <div>
              <h4>Keşfet</h4>
              <ul>
                <li><a href="#kampanyalar">Kampanyalar</a></li>
                <li><a href="#paket-olustur">Paket Oluştur</a></li>
                <li><a href="#cihazlar">Cihazlarımız</a></li>
                <li><a href="#hizmetler">Hizmetler</a></li>
              </ul>
            </div>
            <div>
              <h4>Çalışma Saatleri</h4>
              <ul className="hours">
                {SALON.hours.map((h) => <li key={h.day}><span>{h.day}</span>{h.time}</li>)}
              </ul>
            </div>
            <div>
              <h4>İletişim</h4>
              <ul>
                <li style={{ display: 'flex', gap: 8 }}><MapPin size={16} style={{ flexShrink: 0, marginTop: 4 }} /> {SALON.address}</li>
                <li><a href={SALON.phoneHref} style={{ display: 'flex', gap: 8 }}><Phone size={16} /> {SALON.phone}</a></li>
                <li><a href={SALON.instagram} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 8 }}><AtSign size={16} /> Instagram</a></li>
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

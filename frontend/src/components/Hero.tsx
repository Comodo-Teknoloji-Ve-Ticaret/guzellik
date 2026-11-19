import { ArrowRight } from 'lucide-react';
import { PACKAGES } from '../data/catalog';
import { tl } from '../hooks';
import type { BookingPreset } from './BookingModal';

export default function Hero({ onBook }: { onBook: (p?: BookingPreset) => void }) {
  const promo = PACKAGES.find((p) => p.featured) ?? PACKAGES[0];
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <img src="img/hero.jpg" alt="" fetchPriority="high" />
      </div>
      <div className="container hero-content">
        <span className="kicker" style={{ color: '#E6D9C8' }}>Antalya · Lazer Epilasyon & Cilt Bakımı</span>
        <h1 style={{ marginTop: 22 }}>
          Cildiniz için
          <span>sakin, özenli bakım.</span>
        </h1>
        <p className="lead">
          Buz başlıklı diode, Alexandrite ve Nd:YAG lazer ile her ten tipine uygun epilasyon; Hydrafacial ve
          RF mikroiğne ile kişiye özel cilt bakımı.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-light" onClick={() => onBook()}>
            Online Randevu Al <ArrowRight size={18} />
          </button>
          <a href="#kampanyalar" className="btn btn-line-light">Kampanyaları Gör</a>
        </div>

        <div className="hero-bar">
          <div><strong>12.000+</strong><span>tamamlanan seans</span></div>
          <div><strong>5</strong><span>medikal cihaz</span></div>
          <div><strong>4,9</strong><span>Google puanı</span></div>
          <button
            className="promo"
            onClick={() => onBook({ serviceId: promo.serviceId, packageId: promo.id, packageTitle: promo.title })}
          >
            <span>
              <span>Bu ayın kampanyası</span>
              <b>{promo.title} · {tl(promo.campaignPrice)}</b>
            </span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Intro() {
  const items = [
    { t: 'Ücretsiz analiz ve deneme atışı', d: 'İlk ziyarette cilt ve kıl yapınız incelenir, size uygun cihaz belirlenir.' },
    { t: 'Hekim denetiminde uygulama', d: 'Tüm seanslar sertifikalı uzmanlarca, protokollere uygun yapılır.' },
    { t: 'Seans sonrası takip', d: 'Hatırlatma ve kontrol mesajlarıyla sonuçlarınızı birlikte izleriz.' },
  ];
  return (
    <section className="section">
      <div className="container intro">
        <div className="intro-imgs reveal">
          <div className="ph intro-img"><img src="img/salon.jpg" alt="Nüans uygulama odası" loading="lazy" /></div>
          <div className="ph small"><img src="img/urunler.jpg" alt="" loading="lazy" /></div>
        </div>
        <div className="intro-text reveal">
          <span className="kicker">Stüdyomuz</span>
          <p className="big">
            Acele etmeden, sizi dinleyerek çalışıyoruz. Her danışana ayrı plan, her cilde doğru cihaz.
          </p>
          <p>
            Muratpaşa’daki stüdyomuzda lazer epilasyon, cilt bakımı ve vücut uygulamalarını tek çatı altında sunuyoruz.
            Sakin odalar, hijyenik ortam ve randevu saatinize sadık bir ekip.
          </p>
          <ul className="intro-list">
            {items.map((it, i) => (
              <li key={it.t}>
                <span>0{i + 1}</span>
                <div><b>{it.t}</b><small>{it.d}</small></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, CalendarCheck, ShieldCheck, Snowflake, Sparkles } from 'lucide-react';

interface Props {
  onBook: () => void;
}

export default function Hero({ onBook }: Props) {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="reveal">
          <span className="hero-badge">
            <b>Kasım Kampanyası</b> Tüm vücut 8 seans %38 indirimli
          </span>
          <h1>
            Pürüzsüz bir cilt,<br />
            <em>acısız</em> bir deneyim.
          </h1>
          <p className="lead">
            Buz başlıklı diode lazer, Alexandrite ve Nd:YAG cihazlarıyla her ten tipine uygun epilasyon;
            Hydrafacial ve RF mikroiğne ile kişiye özel cilt bakımı. Saatinizi seçin, 1 dakikada randevunuzu alın.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-rose" onClick={onBook}>
              Online Randevu Al <ArrowRight size={18} />
            </button>
            <a href="#kampanyalar" className="btn btn-ghost">Kampanyalı Paketler</a>
          </div>
          <div className="hero-stats">
            <div><strong>12.000+</strong><span>tamamlanan seans</span></div>
            <div><strong>5</strong><span>medikal cihaz</span></div>
            <div><strong>4,9</strong><span>Google puanı</span></div>
          </div>
        </div>

        <div className="hero-visual reveal" aria-hidden="true">
          <div className="hero-orb" />
          <div className="hero-beam" />
          <div className="float-card fc-1">
            <div className="ic"><Snowflake size={19} /></div>
            <div><strong>−4°C buz başlık</strong><span>Konforlu, acısız seans</span></div>
          </div>
          <div className="float-card fc-2">
            <div className="ic"><CalendarCheck size={19} /></div>
            <div>
              <strong>Yarın müsait</strong>
              <div className="slot-pills"><i>11:00</i><i>14:30</i><i>17:00</i></div>
            </div>
          </div>
          <div className="float-card fc-3">
            <div className="ic"><ShieldCheck size={19} /></div>
            <div><strong>Tip I – VI ten uyumu</strong><span>Her cilt tipine uygun cihaz</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = [
    'Ücretsiz deneme atışı',
    '12 aya kadar taksit',
    'Buz başlıklı diode lazer',
    'Hydrafacial 4 al 5 öde',
    'Uzman cilt analizi',
    'Erkeklere özel uzman',
    'Online randevu, sıfır bekleme',
  ];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span key={i}>{i % 3 === 0 && <Sparkles size={16} />}{t}</span>
        ))}
      </div>
    </div>
  );
}

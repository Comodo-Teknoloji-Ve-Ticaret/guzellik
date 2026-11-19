import { useMemo, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import type { CampaignPackage, ServiceCategory } from '../types';
import { CATEGORY_LABEL } from '../data/catalog';
import { salonApi } from '../services/api';
import { tl, useAsync, useCountdown } from '../hooks';
import type { BookingPreset } from './BookingModal';

function Timer({ endsAt }: { endsAt: string }) {
  const c = useCountdown(endsAt);
  if (c.expired) return <div className="timer">Kampanya sona erdi</div>;
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="timer">
      <Clock size={14} /> Kampanya bitimine <b>{c.days} gün {p(c.hours)}:{p(c.minutes)}:{p(c.seconds)}</b>
    </div>
  );
}

const preset = (p: CampaignPackage): BookingPreset => ({ serviceId: p.serviceId, packageId: p.id, packageTitle: p.title });

function Featured({ pkg, onBook }: { pkg: CampaignPackage; onBook: (p: BookingPreset) => void }) {
  const save = pkg.regularPrice - pkg.campaignPrice;
  return (
    <article className="pkg-feature reveal">
      <div className="ph zoom"><img src={pkg.image} alt={pkg.title} loading="lazy" /></div>
      <div className="pkg-feature-body">
        <div className="pkg-label">{pkg.badge && <em>{pkg.badge}</em>}{CATEGORY_LABEL[pkg.category]}</div>
        <h3>{pkg.title}</h3>
        <p>{pkg.subtitle}</p>
        <div className="price">
          <strong>{tl(pkg.campaignPrice)}</strong>
          <s>{tl(pkg.regularPrice)}</s>
        </div>
        <div className="price-meta">
          {pkg.sessions} seans · seans başı {tl(Math.round(pkg.campaignPrice / pkg.sessions))} · <b>{tl(save)} avantaj</b>
        </div>
        <ul className="checks">
          {pkg.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
        <Timer endsAt={pkg.endsAt} />
        <div className="actions">
          <button className="btn btn-dark" onClick={() => onBook(preset(pkg))}>
            Bu Paketle Randevu Al <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Card({ pkg, onBook }: { pkg: CampaignPackage; onBook: (p: BookingPreset) => void }) {
  const pct = Math.round(((pkg.regularPrice - pkg.campaignPrice) / pkg.regularPrice) * 100);
  return (
    <button className="pkg-card reveal" onClick={() => onBook(preset(pkg))} aria-label={`${pkg.title} paketiyle randevu al`}>
      <div className="ph">
        <img src={pkg.image} alt="" loading="lazy" />
        <span className="tagline">{pkg.badge ?? `%${pct} indirim`}</span>
      </div>
      <h3>{pkg.title}</h3>
      <p className="sub">{pkg.subtitle}</p>
      <Timer endsAt={pkg.endsAt} />
      <div className="row">
        <span><strong>{tl(pkg.campaignPrice)}</strong><s>{tl(pkg.regularPrice)}</s></span>
        <span className="link">Randevu al <ArrowRight size={15} /></span>
      </div>
    </button>
  );
}

export default function Packages({ onBook }: { onBook: (p: BookingPreset) => void }) {
  const { data, loading } = useAsync(() => salonApi.getPackages());
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');
  const featured = data?.find((p) => p.featured);
  const rest = useMemo(
    () => (data ?? []).filter((p) => p !== featured && (filter === 'all' || p.category === filter)),
    [data, filter, featured],
  );

  return (
    <section className="section section-alt" id="kampanyalar">
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="kicker">Kampanyalı Seans Paketleri</span>
            <h2>Paket alın, seans başına daha az ödeyin.</h2>
            <p>Tüm paketler 12 ay geçerli. Kaçırılan seans telafisi ve ücretsiz deneme atışı dahil.</p>
          </div>
        </div>

        {loading ? <div className="loader" /> : (
          <>
            {featured && <Featured pkg={featured} onBook={onBook} />}
            <div className="tabs" role="tablist" aria-label="Paket kategorisi" style={{ marginBottom: 36 }}>
              {(['all', 'lazer', 'cilt', 'vucut'] as const).map((c) => (
                <button key={c} role="tab" aria-selected={filter === c} className={`tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
                  {c === 'all' ? 'Tüm paketler' : CATEGORY_LABEL[c]}
                </button>
              ))}
            </div>
            <div className="pkg-grid">
              {rest.map((p) => <Card key={p.id} pkg={p} onBook={onBook} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

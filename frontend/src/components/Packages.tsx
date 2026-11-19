import { useMemo, useState } from 'react';
import { Check, Clock } from 'lucide-react';
import type { CampaignPackage, ServiceCategory } from '../types';
import { CATEGORY_LABEL } from '../data/catalog';
import { salonApi } from '../services/api';
import { tl, useAsync, useCountdown } from '../hooks';
import type { BookingPreset } from './BookingModal';

function Countdown({ endsAt }: { endsAt: string }) {
  const c = useCountdown(endsAt);
  if (c.expired) return <div className="countdown"><span>Kampanya sona erdi</span></div>;
  const p = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="countdown" aria-label={`Kampanyanın bitmesine ${c.days} gün ${c.hours} saat`}>
      <Clock size={14} />
      <span>Bitmesine</span>
      <div>{c.days}<small>g</small></div>
      <div>{p(c.hours)}<small>s</small></div>
      <div>{p(c.minutes)}<small>d</small></div>
      <div>{p(c.seconds)}<small>sn</small></div>
    </div>
  );
}

function PackageCard({ pkg, onBook }: { pkg: CampaignPackage; onBook: (p: BookingPreset) => void }) {
  const save = pkg.regularPrice - pkg.campaignPrice;
  const pct = Math.round((save / pkg.regularPrice) * 100);
  return (
    <article className={`card pkg reveal ${pkg.featured ? 'featured' : ''}`}>
      <div className="pkg-top">
        <span className="pkg-cat">{CATEGORY_LABEL[pkg.category]}</span>
        {pkg.badge && <span className="pkg-badge">{pkg.badge}</span>}
      </div>
      <h3>{pkg.title}</h3>
      <p className="pkg-sub">{pkg.subtitle}</p>
      <div className="pkg-price">
        <strong>{tl(pkg.campaignPrice)}</strong>
        <s>{tl(pkg.regularPrice)}</s>
      </div>
      <div className="pkg-meta">
        <span>{pkg.sessions} seans · seans başı {tl(Math.round(pkg.campaignPrice / pkg.sessions))}</span>
        <b>{tl(save)} kazanç (%{pct})</b>
      </div>
      <ul className="pkg-hl">
        {pkg.highlights.map((h) => (
          <li key={h}><Check size={16} /> {h}</li>
        ))}
      </ul>
      <Countdown endsAt={pkg.endsAt} />
      <button
        className={`btn btn-block ${pkg.featured ? 'btn-rose' : 'btn-primary'}`}
        onClick={() => onBook({ serviceId: pkg.serviceId, packageId: pkg.id, packageTitle: pkg.title })}
      >
        Bu Paketle Randevu Al
      </button>
    </article>
  );
}

export default function Packages({ onBook }: { onBook: (p: BookingPreset) => void }) {
  const { data, loading } = useAsync(() => salonApi.getPackages());
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');
  const list = useMemo(
    () => (data ?? []).filter((p) => filter === 'all' || p.category === filter),
    [data, filter],
  );

  return (
    <section className="section" id="kampanyalar">
      <div className="container">
        <div className="pkg-toolbar">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Kampanyalı Seans Paketleri</span>
            <h2>Paket alın, <em>seans başına</em> daha az ödeyin.</h2>
            <p>Tüm paketler 12 ay geçerli, kaçırılan seans telafisi ve ücretsiz deneme atışı dahil.</p>
          </div>
          <div className="chips" role="tablist" aria-label="Paket kategorisi">
            {(['all', 'lazer', 'cilt', 'vucut'] as const).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                className={`chip ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c === 'all' ? 'Tümü' : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>
        {loading ? <div className="loader" /> : (
          <div className="pkg-grid">
            {list.map((p) => <PackageCard key={p.id} pkg={p} onBook={onBook} />)}
          </div>
        )}
      </div>
    </section>
  );
}

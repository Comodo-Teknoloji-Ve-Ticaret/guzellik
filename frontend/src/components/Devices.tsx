import { useState, type CSSProperties } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FITZPATRICK } from '../data/catalog';
import { salonApi } from '../services/api';
import { useAsync } from '../hooks';

/** Maps a wavelength in nm onto the 380–1100 nm spectrum bar. */
function spectrumPos(wl?: string) {
  const nm = wl ? parseInt(wl, 10) : NaN;
  if (Number.isNaN(nm)) return null;
  return Math.min(100, Math.max(0, ((nm - 380) / (1100 - 380)) * 100));
}

export default function Devices() {
  const { data: devices, loading } = useAsync(() => salonApi.getDevices());
  const [activeId, setActiveId] = useState('diode');
  const [skin, setSkin] = useState<number | null>(null);

  const active = devices?.find((d) => d.id === activeId);
  const pos = spectrumPos(active?.wavelength);

  const pickSkin = (t: number) => {
    const next = skin === t ? null : t;
    setSkin(next);
    if (next && devices && active && !active.skinTypes.includes(next)) {
      const first = devices.find((d) => d.skinTypes.includes(next));
      if (first) setActiveId(first.id);
    }
  };

  return (
    <section className="section" id="cihazlar">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Cihaz Tanıtımı</span>
          <h2>Her cilde <em>doğru</em> teknoloji.</h2>
          <p>
            Merkezimizde 5 farklı medikal cihaz bulunur. Cilt ve kıl tipinize göre uzmanımız en uygun dalga boyunu seçer —
            aşağıdan ten tipinizi işaretleyin, size uygun cihazları görün.
          </p>
        </div>

        <div className="card skin-picker reveal">
          <p>Ten tipiniz:</p>
          <div className="skin-row">
            {FITZPATRICK.map((f) => (
              <button
                key={f.type}
                className={`skin ${skin === f.type ? 'sel' : ''}`}
                style={{ background: f.color, color: f.type > 3 ? '#fff' : '#5A2F44' }}
                title={`${f.label}: ${f.desc}`}
                aria-pressed={skin === f.type}
                onClick={() => pickSkin(f.type)}
              >
                {['I', 'II', 'III', 'IV', 'V', 'VI'][f.type - 1]}
              </button>
            ))}
          </div>
          <small>
            {skin
              ? `${FITZPATRICK[skin - 1].label} (${FITZPATRICK[skin - 1].desc}) için ${devices?.filter((d) => d.skinTypes.includes(skin)).length ?? 0} cihaz uygun.`
              : 'Fitzpatrick ölçeğine göre seçim yapın.'}
          </small>
        </div>

        {loading || !active ? <div className="loader" /> : (
          <div className="dev-layout">
            <div className="dev-tabs" role="tablist" aria-label="Cihazlar">
              {devices!.map((d) => (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={d.id === activeId}
                  className={`dev-tab ${d.id === activeId ? 'on' : ''} ${skin && !d.skinTypes.includes(skin) ? 'dim' : ''}`}
                  onClick={() => setActiveId(d.id)}
                >
                  <span className="dot" style={{ background: d.accent }} />
                  <span>
                    <strong>{d.name}</strong>
                    <span>{d.technology}{d.wavelength ? ` · ${d.wavelength}` : ''}</span>
                  </span>
                </button>
              ))}
            </div>

            <article className="card dev-detail" key={active.id} role="tabpanel">
              <div className="dev-head">
                <div className="dev-art" style={{ '--accent': active.accent } as CSSProperties} aria-hidden="true" />
                <div>
                  <span className="tech" style={{ color: active.accent }}>{active.technology}</span>
                  <h3>{active.name}</h3>
                  <p>{active.tagline}</p>
                </div>
              </div>
              <p className="dev-desc">{active.description}</p>

              {pos !== null && (
                <div className="spectrum">
                  <h4 style={{ fontSize: '.8rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Dalga boyu: {active.wavelength}
                  </h4>
                  <div className="spectrum-bar">
                    <span className="spectrum-marker" style={{ left: `${pos}%` }} />
                  </div>
                  <div className="spectrum-legend"><span>Görünür ışık</span><span>Yakın kızılötesi</span><span>1100 nm</span></div>
                </div>
              )}

              <div className="spec-grid">
                {active.specs.map((s) => (
                  <div className="spec" key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>
                ))}
              </div>

              <div className="dev-cols">
                <div>
                  <h4>Uygun ten tipleri</h4>
                  <div className="skin-row">
                    {FITZPATRICK.map((f) => {
                      const ok = active.skinTypes.includes(f.type);
                      return (
                        <span
                          key={f.type}
                          className={`skin ${ok ? 'yes' : 'no'}`}
                          style={{ background: f.color, color: f.type > 3 ? '#fff' : '#5A2F44' }}
                          title={`${f.label} — ${ok ? 'uygun' : 'uygun değil'}`}
                        >
                          {['I', 'II', 'III', 'IV', 'V', 'VI'][f.type - 1]}
                        </span>
                      );
                    })}
                  </div>
                  <ul className="benefit-list">
                    {active.benefits.map((b) => <li key={b}><CheckCircle2 size={16} /> {b}</li>)}
                  </ul>
                </div>
                <div>
                  <h4>Kullanım alanları</h4>
                  <div className="tag-list">
                    {active.usedFor.map((u) => <span className="tag" key={u}>{u}</span>)}
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  );
}

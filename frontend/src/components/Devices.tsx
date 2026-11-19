import { useState } from 'react';
import { Plus } from 'lucide-react';
import { FITZPATRICK } from '../data/catalog';
import { salonApi } from '../services/api';
import { useAsync } from '../hooks';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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

  const pickSkin = (t: number) => {
    const next = skin === t ? null : t;
    setSkin(next);
    if (next && devices && active && !active.skinTypes.includes(next)) {
      const first = devices.find((d) => d.skinTypes.includes(next));
      if (first) setActiveId(first.id);
    }
  };

  return (
    <section className="section section-dark" id="cihazlar">
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="kicker">Cihaz Tanıtımı</span>
            <h2 style={{ color: '#fff' }}>Her cilde doğru teknoloji.</h2>
            <p>Stüdyomuzda 5 farklı medikal cihaz bulunur. Uzmanımız cilt ve kıl tipinize göre en uygun dalga boyunu seçer.</p>
          </div>
        </div>

        {loading || !active || !devices ? <div className="loader" /> : (
          <div className="dev">
            <figure className="dev-media reveal">
              <div className="ph"><img key={active.image} src={active.image} alt={active.name} loading="lazy" /></div>
              <figcaption><span>{active.technology}</span><span>{active.wavelength ?? 'Işıksız teknoloji'}</span></figcaption>
            </figure>

            <div className="reveal">
              <div className="skinbar">
                <p>Ten tipiniz:</p>
                <div className="skins">
                  {FITZPATRICK.map((f) => (
                    <button
                      key={f.type}
                      className={`skin ${skin === f.type ? 'sel' : ''}`}
                      style={{ background: f.color, color: f.type > 3 ? '#fff' : '#3A332C' }}
                      title={`${f.label}: ${f.desc}`}
                      aria-pressed={skin === f.type}
                      onClick={() => pickSkin(f.type)}
                    >
                      {ROMAN[f.type - 1]}
                    </button>
                  ))}
                </div>
                <p>
                  {skin
                    ? `${FITZPATRICK[skin - 1].desc} — ${devices.filter((d) => d.skinTypes.includes(skin)).length} cihaz uygun`
                    : 'Seçin, size uygun cihazları görün'}
                </p>
              </div>

              <ul className="dev-list">
                {devices.map((d, i) => {
                  const on = d.id === activeId;
                  const pos = spectrumPos(d.wavelength);
                  return (
                    <li key={d.id} className={`dev-item ${on ? 'on' : ''} ${skin && !d.skinTypes.includes(skin) ? 'dim' : ''}`}>
                      <button aria-expanded={on} onClick={() => setActiveId(d.id)}>
                        <span className="num">0{i + 1}</span>
                        <span>
                          <h3>{d.name}</h3>
                          <small>{d.tagline}</small>
                        </span>
                        <Plus size={22} />
                      </button>
                      <div className="dev-body">
                        <div>
                          <div className="dev-body-inner">
                            <p>{d.description}</p>
                            {pos !== null && (
                              <div className="spectrum">
                                <div className="spectrum-legend"><span>Dalga boyu</span><span style={{ color: '#fff' }}>{d.wavelength}</span></div>
                                <div className="spectrum-bar"><span className="spectrum-marker" style={{ left: `${pos}%` }} /></div>
                                <div className="spectrum-legend"><span>380 nm</span><span>Yakın kızılötesi</span><span>1100 nm</span></div>
                              </div>
                            )}
                            <div className="spec-table">
                              {d.specs.map((s) => <div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}
                            </div>
                            <div className="dev-meta">
                              <div>
                                <h4>Uygun ten tipleri</h4>
                                <div className="skins">
                                  {FITZPATRICK.map((f) => (
                                    <span
                                      key={f.type}
                                      className={`skin ${d.skinTypes.includes(f.type) ? '' : 'no'}`}
                                      style={{ background: f.color, color: f.type > 3 ? '#fff' : '#3A332C', width: 26, height: 26 }}
                                      title={`${f.label} — ${d.skinTypes.includes(f.type) ? 'uygun' : 'uygun değil'}`}
                                    >
                                      {ROMAN[f.type - 1]}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4>Kullanım alanları</h4>
                                <p className="uses" style={{ margin: 0 }}>{d.usedFor.join(' · ')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

import { useMemo, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { BUILDER_RULES, LASER_AREAS } from '../data/catalog';
import { tl } from '../hooks';
import type { BookingPreset } from './BookingModal';

const GROUPS = [
  { id: 'yuz', label: 'Yüz' },
  { id: 'ust', label: 'Üst vücut' },
  { id: 'alt', label: 'Alt vücut' },
] as const;

export default function PackageBuilder({ onBook }: { onBook: (p: BookingPreset) => void }) {
  const [selected, setSelected] = useState<string[]>(['koltuk', 'bikini']);
  const [sessions, setSessions] = useState(8);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const calc = useMemo(() => {
    const areas = LASER_AREAS.filter((a) => selected.includes(a.id));
    const perSession = areas.reduce((t, a) => t + a.pricePerSession, 0);
    const minutes = areas.reduce((t, a) => t + a.minutes, 0);
    const gross = perSession * sessions;
    const sessionDisc = BUILDER_RULES.sessionDiscount[sessions] ?? 0;
    const areaDisc = BUILDER_RULES.areaDiscount(areas.length);
    const total = Math.round((gross * (1 - sessionDisc) * (1 - areaDisc)) / 10) * 10;
    return { areas, minutes, gross, sessionDisc, areaDisc, total, saved: gross - total };
  }, [selected, sessions]);

  const tip =
    calc.areas.length > 0 && calc.areas.length < 3
      ? `${3 - calc.areas.length} bölge daha ekleyin, ek %8 indirim kazanın.`
      : calc.areas.length >= 3 && calc.areas.length < 5
        ? `${5 - calc.areas.length} bölge daha ekleyin, indirim %15’e çıksın.`
        : null;

  return (
    <section className="section" id="paket-olustur">
      <div className="container">
        <div className="head reveal">
          <div>
            <span className="kicker">Kendi Paketinizi Oluşturun</span>
            <h2>Bölgeleri seçin, fiyatınızı anında görün.</h2>
            <p>Bölge ve seans sayısı arttıkça indirim büyür. Oluşturduğunuz paketle doğrudan randevu alabilirsiniz.</p>
          </div>
        </div>

        <div className="builder">
          <div className="reveal">
            {GROUPS.map((g) => (
              <div className="b-group" key={g.id}>
                <h4>{g.label}</h4>
                <div className="area-list">
                  {LASER_AREAS.filter((a) => a.group === g.id).map((a) => {
                    const on = selected.includes(a.id);
                    return (
                      <button key={a.id} className={`area ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(a.id)}>
                        <span className="box">{on && <Check size={12} />}</span>
                        <span className="nm">{a.name}</span>
                        <span className="pr">{tl(a.pricePerSession)} / seans</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="b-group">
              <h4>Seans sayısı</h4>
              <div className="sessions">
                {BUILDER_RULES.sessionOptions.map((n) => {
                  const d = BUILDER_RULES.sessionDiscount[n];
                  return (
                    <button key={n} className={sessions === n ? 'on' : ''} aria-pressed={sessions === n} onClick={() => setSessions(n)}>
                      <strong>{n} seans</strong>
                      <span>{d ? `%${Math.round(d * 100)} indirim` : 'Standart'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="summary reveal" aria-live="polite">
            <div className="ph"><img src="img/lazer-bacak.jpg" alt="" loading="lazy" /></div>
            <div className="summary-body">
              <h3>Paket özetiniz</h3>
              {calc.areas.length === 0 ? (
                <p className="empty-hint">Başlamak için en az bir bölge seçin.</p>
              ) : (
                <>
                  <div className="sum-row"><span>Bölgeler</span><b>{calc.areas.map((a) => a.name).join(', ')}</b></div>
                  <div className="sum-row"><span>Seans süresi</span><b>~{calc.minutes} dk</b></div>
                  <div className="sum-row"><span>Liste fiyatı ({sessions} seans)</span><b>{tl(calc.gross)}</b></div>
                  {calc.sessionDisc > 0 && (
                    <div className="sum-row discount"><span>Seans indirimi</span><b>−%{Math.round(calc.sessionDisc * 100)}</b></div>
                  )}
                  {calc.areaDisc > 0 && (
                    <div className="sum-row discount"><span>Çoklu bölge indirimi</span><b>−%{Math.round(calc.areaDisc * 100)}</b></div>
                  )}
                  <div className="sum-total">
                    <div><small>Toplam</small><strong>{tl(calc.total)}</strong></div>
                    <em>{tl(calc.saved)} tasarruf</em>
                  </div>
                  <p className="sum-note">
                    Seans başı {tl(Math.round(calc.total / sessions))} · 12 taksitle aylık {tl(Math.round(calc.total / 12))}
                  </p>
                  {tip && <p className="tip">{tip}</p>}
                </>
              )}
              <button
                className="btn btn-light btn-block"
                disabled={calc.areas.length === 0}
                onClick={() =>
                  onBook({
                    serviceId: 'lazer-bolgesel',
                    packageTitle: `Özel paket: ${calc.areas.map((a) => a.name).join(' + ')} · ${sessions} seans (${tl(calc.total)})`,
                  })
                }
              >
                Bu Paketle Randevu Al <ArrowRight size={17} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

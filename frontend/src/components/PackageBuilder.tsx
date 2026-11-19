import { useMemo, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { BUILDER_RULES, LASER_AREAS } from '../data/catalog';
import { tl } from '../hooks';
import type { BookingPreset } from './BookingModal';

const GROUPS = [
  { id: 'yuz', label: 'Yüz' },
  { id: 'ust', label: 'Üst Vücut' },
  { id: 'alt', label: 'Alt Vücut' },
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
    const afterSession = gross * (1 - sessionDisc);
    const total = Math.round((afterSession * (1 - areaDisc)) / 10) * 10;
    return { areas, perSession, minutes, gross, sessionDisc, areaDisc, total, saved: gross - total };
  }, [selected, sessions]);

  const nextAreaTip =
    calc.areas.length > 0 && calc.areas.length < 3
      ? `${3 - calc.areas.length} bölge daha ekleyin, ekstra %8 indirim kazanın.`
      : calc.areas.length >= 3 && calc.areas.length < 5
        ? `${5 - calc.areas.length} bölge daha ekleyin, indirim %15’e çıksın.`
        : null;

  return (
    <section className="section section-alt" id="paket-olustur">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Kendi Paketini Oluştur</span>
          <h2>Bölgeleri seçin, <em>fiyatınızı</em> anında görün.</h2>
          <p>Ne kadar çok bölge ve seans, o kadar büyük indirim. Seçtiğiniz paketle doğrudan randevu oluşturabilirsiniz.</p>
        </div>

        <div className="builder">
          <div className="card builder-pane reveal">
            {GROUPS.map((g) => (
              <div className="builder-group" key={g.id}>
                <h4>{g.label}</h4>
                <div className="area-grid">
                  {LASER_AREAS.filter((a) => a.group === g.id).map((a) => {
                    const on = selected.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        className={`area ${on ? 'on' : ''}`}
                        aria-pressed={on}
                        onClick={() => toggle(a.id)}
                      >
                        <span className="tick">{on && <Check size={12} />}</span>
                        <strong>{a.name}</strong>
                        <span>{tl(a.pricePerSession)} / seans</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="builder-group">
              <h4>Seans sayısı</h4>
              <div className="session-row">
                {BUILDER_RULES.sessionOptions.map((n) => {
                  const d = BUILDER_RULES.sessionDiscount[n];
                  return (
                    <button
                      key={n}
                      className={`session-opt ${sessions === n ? 'on' : ''}`}
                      aria-pressed={sessions === n}
                      onClick={() => setSessions(n)}
                    >
                      <strong>{n} seans</strong>
                      <span>{d ? `%${Math.round(d * 100)} indirim` : 'Standart'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="card summary reveal" aria-live="polite">
            <h3>Paket Özetiniz</h3>
            {calc.areas.length === 0 ? (
              <p className="empty-hint">Başlamak için en az bir bölge seçin.</p>
            ) : (
              <>
                <div className="sum-row"><span>Bölgeler</span><b>{calc.areas.map((a) => a.name).join(', ')}</b></div>
                <div className="sum-row"><span>Seans başı süre</span><b>~{calc.minutes} dk</b></div>
                <div className="sum-row"><span>Liste fiyatı ({sessions} seans)</span><b>{tl(calc.gross)}</b></div>
                {calc.sessionDisc > 0 && (
                  <div className="sum-row discount"><span>Seans indirimi</span><b>−%{Math.round(calc.sessionDisc * 100)}</b></div>
                )}
                {calc.areaDisc > 0 && (
                  <div className="sum-row discount"><span>Çoklu bölge indirimi</span><b>−%{Math.round(calc.areaDisc * 100)}</b></div>
                )}
                <div className="sum-total">
                  <div>
                    <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Toplam</span>
                    <strong>{tl(calc.total)}</strong>
                  </div>
                  <span style={{ color: 'var(--sage)', fontWeight: 800, fontSize: '.9rem' }}>
                    {tl(calc.saved)} tasarruf
                  </span>
                </div>
                <p className="sum-note">
                  Seans başı {tl(Math.round(calc.total / sessions))} · 12 taksitle aylık {tl(Math.round(calc.total / 12))}
                </p>
                {nextAreaTip && (
                  <p className="pkg-preset" style={{ marginBottom: 16 }}><Sparkles size={16} /> {nextAreaTip}</p>
                )}
              </>
            )}
            <button
              className="btn btn-rose btn-block"
              disabled={calc.areas.length === 0}
              onClick={() =>
                onBook({
                  serviceId: 'lazer-bolgesel',
                  packageTitle: `Özel paket: ${calc.areas.map((a) => a.name).join(' + ')} · ${sessions} seans (${tl(calc.total)})`,
                })
              }
            >
              Bu Paketle Randevu Al
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Appointment } from '../types';
import { EXPERTS, SERVICES } from '../data/catalog';
import { salonApi, toIsoDate } from '../services/api';

export default function MyAppointments({ onClose, onBook }: { onClose: () => void; onBook: () => void }) {
  const [phone, setPhone] = useState('');
  const [list, setList] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      setList(await salonApi.findAppointments(phone));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (a: Appointment) => {
    if (!confirm(`${a.date} ${a.time} randevunuz iptal edilsin mi?`)) return;
    try {
      await salonApi.cancelAppointment(a.id, phone);
      await search();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const today = toIsoDate(new Date());

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal narrow" role="dialog" aria-modal="true" aria-labelledby="my-title">
        <div className="modal-main">
        <div className="modal-head">
          <div>
            <h3 id="my-title">Randevularım</h3>
            <p>Randevu alırken kullandığınız telefon numarasını girin.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Kapat"><X size={20} /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={search} style={{ display: 'flex', gap: 10 }}>
            <div className="field" style={{ flex: 1 }}>
              <input aria-label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="05xx xxx xx xx" />
            </div>
            <button className="btn btn-dark" disabled={phone.replace(/\D/g, '').length < 10}><Search size={17} /> Sorgula</button>
          </form>

          {loading && <div className="loader" />}
          {error && <div className="alert">{error}</div>}
          {list && !loading && (
            list.length === 0 ? (
              <div className="empty-hint">
                Bu numaraya ait randevu bulunamadı.
                <div style={{ marginTop: 14 }}><button className="btn btn-accent btn-sm" onClick={onBook}>Yeni Randevu Al</button></div>
              </div>
            ) : (
              <div style={{ marginTop: 20, borderTop: '1px solid var(--line)' }}>
                {list.map((a) => {
                  const svc = SERVICES.find((s) => s.id === a.serviceId);
                  const exp = EXPERTS.find((e) => e.id === a.expertId);
                  const upcoming = a.date >= today && a.status !== 'İptal';
                  return (
                    <div className="appt" key={a.id}>
                      <div className="grow">
                        <strong>{svc?.name ?? a.serviceId}</strong>
                        <span>
                          {new Date(`${a.date}T00:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })} · {a.time} · {exp?.name}
                        </span>
                        <span style={{ display: 'block', fontSize: '.76rem' }}>Kod: {a.code}</span>
                      </div>
                      <span className={`status ${a.status}`}>{a.status}</span>
                      {upcoming && (
                        <button className="btn btn-line btn-sm" onClick={() => cancel(a)}>İptal Et</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

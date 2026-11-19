import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarPlus, Check, Gift, Users, X } from 'lucide-react';
import type { Appointment, Expert, ServiceCategory, TimeSlot } from '../types';
import { CATEGORY_LABEL, SALON } from '../data/catalog';
import { normalizePhone, openingHours, salonApi, toIsoDate } from '../services/api';
import { tl, useAsync } from '../hooks';

export interface BookingPreset {
  serviceId?: string;
  packageId?: string;
  packageTitle?: string;
}

const STEPS = ['Hizmet', 'Uzman', 'Tarih & Saat', 'Bilgileriniz', 'Onay'];
const ANY = 'any';
const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

function nextDays(n: number) {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function formatLongDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function downloadIcs(a: Appointment, serviceName: string) {
  const start = `${a.date.replace(/-/g, '')}T${a.time.replace(':', '')}00`;
  const [h, m] = a.time.split(':').map(Number);
  const endMins = h * 60 + m + 60;
  const end = `${a.date.replace(/-/g, '')}T${String(Math.floor(endMins / 60)).padStart(2, '0')}${String(endMins % 60).padStart(2, '0')}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nuans//Randevu//TR', 'BEGIN:VEVENT',
    `UID:${a.id}`, `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:${serviceName} - ${SALON.name}`, `LOCATION:${SALON.address}`,
    `DESCRIPTION:Randevu kodu: ${a.code}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `randevu-${a.code}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BookingModal({ preset, onClose }: { preset: BookingPreset; onClose: () => void }) {
  const services = useAsync(() => salonApi.getServices());
  const [step, setStep] = useState(preset.serviceId ? 1 : 0);
  const [pkg, setPkg] = useState(preset.packageTitle ? preset : null);
  const [serviceId, setServiceId] = useState(preset.serviceId ?? '');
  const [cat, setCat] = useState<ServiceCategory | 'all'>('all');
  const [experts, setExperts] = useState<Expert[]>([]);
  const [expertId, setExpertId] = useState(ANY);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<(TimeSlot & { expertId?: string })[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [time, setTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '', firstVisit: true, consent: false });
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<Appointment | null>(null);

  const service = services.data?.find((s) => s.id === serviceId);
  const days = useMemo(() => nextDays(21), []);

  // Esc to close + lock scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!serviceId) return;
    salonApi.getExperts(serviceId).then((list) => {
      setExperts(list);
      setExpertId((cur) => (cur === ANY || list.some((e) => e.id === cur) ? cur : ANY));
    });
  }, [serviceId]);

  // Load slots; for "any expert" merge availability across eligible experts.
  useEffect(() => {
    if (!date || experts.length === 0) return;
    let alive = true;
    setSlotsLoading(true);
    setTime('');
    const ids = expertId === ANY ? experts.map((e) => e.id) : [expertId];
    Promise.all(ids.map((id) => salonApi.getAvailability(id, date).then((s) => ({ id, s })))).then((results) => {
      if (!alive) return;
      const merged = (results[0]?.s ?? []).map((slot) => {
        const free = results.find((r) => r.s.find((x) => x.time === slot.time)?.available);
        return { time: slot.time, available: !!free, expertId: free?.id };
      });
      setSlots(merged);
      setSlotsLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [date, expertId, experts]);

  const phoneDigits = normalizePhone(form.phone);
  const errors = {
    name: form.name.trim().length < 3 ? 'Ad soyad girin.' : '',
    phone: !/^5\d{9}$/.test(phoneDigits) ? 'Geçerli bir cep telefonu girin (5xx xxx xx xx).' : '',
    email: form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? 'Geçerli bir e-posta girin.' : '',
    consent: !form.consent ? 'KVKK onayı gereklidir.' : '',
  };
  const formValid = !errors.name && !errors.phone && !errors.email && !errors.consent;

  const chosenSlot = slots.find((s) => s.time === time);
  const resolvedExpertId = expertId === ANY ? chosenSlot?.expertId : expertId;
  const resolvedExpert = experts.find((e) => e.id === resolvedExpertId);

  const canNext = [!!serviceId, !!expertId, !!date && !!time, formValid, true][step];

  const next = () => {
    if (step === 3 && !formValid) {
      setTouched(true);
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const submit = async () => {
    if (!resolvedExpertId) return;
    setSubmitting(true);
    setError('');
    try {
      const appt = await salonApi.createAppointment({
        serviceId,
        packageId: pkg?.packageId,
        expertId: resolvedExpertId,
        date,
        time,
        customerName: form.name.trim(),
        customerPhone: form.phone,
        customerEmail: form.email || undefined,
        note: [pkg?.packageTitle && `Paket: ${pkg.packageTitle}`, form.note].filter(Boolean).join(' — ') || undefined,
        firstVisit: form.firstVisit,
      });
      setDone(appt);
    } catch (e) {
      setError((e as Error).message);
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  };

  const visibleServices = (services.data ?? []).filter((s) => cat === 'all' || s.category === cat);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <div className="modal-head">
          <div>
            <h3 id="booking-title">{done ? 'Randevunuz alındı' : 'Online Randevu'}</h3>
            {!done && <p>Ortalama 1 dakika · Onay SMS ile gelir</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Kapat"><X size={20} /></button>
        </div>

        {!done && (
          <>
            <div className="progress" aria-hidden="true">
              {STEPS.map((s, i) => <div key={s} className={i <= step ? 'on' : ''} />)}
            </div>
            <div className="step-label">Adım {step + 1} / {STEPS.length} · {STEPS[step]}</div>
          </>
        )}

        <div className="modal-body">
          {done ? (
            <div className="success">
              <div className="success-ic"><Check size={36} /></div>
              <p style={{ color: 'var(--muted)' }}>
                {formatLongDate(done.date)} saat <b>{done.time}</b> için <b>{service?.name}</b> randevunuz oluşturuldu.
                Uzmanımız {resolvedExpert?.name} sizi bekliyor olacak.
              </p>
              <div className="code-box">{done.code}</div>
              <p style={{ color: 'var(--muted)', fontSize: '.88rem', marginBottom: 22 }}>
                Durum: <span className="status Beklemede">Beklemede</span> — 30 dakika içinde SMS/WhatsApp ile onaylanacaktır.
                Randevu kodunuzu ve telefon numaranızı “Randevularım” bölümünde kullanabilirsiniz.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-ghost" onClick={() => downloadIcs(done, service?.name ?? 'Randevu')}>
                  <CalendarPlus size={17} /> Takvime Ekle
                </button>
                <button className="btn btn-primary" onClick={onClose}>Tamam</button>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <>
                  <div className="chips cat-chips">
                    {(['all', 'lazer', 'cilt', 'vucut'] as const).map((c) => (
                      <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
                        {c === 'all' ? 'Tümü' : CATEGORY_LABEL[c]}
                      </button>
                    ))}
                  </div>
                  {services.loading ? <div className="loader" /> : (
                    <div className="opt-list">
                      {visibleServices.map((s) => (
                        <button
                          key={s.id}
                          className={`opt ${serviceId === s.id ? 'on' : ''}`}
                          onClick={() => { setServiceId(s.id); setPkg(null); setStep(1); }}
                        >
                          <div className="grow">
                            <strong>{s.name}</strong>
                            <span>{CATEGORY_LABEL[s.category]} · {s.durationMinutes} dk</span>
                          </div>
                          <span className="price">{tl(s.priceFrom)}’den</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  {pkg && (
                    <div className="pkg-preset">
                      <Gift size={18} /> <span>{pkg.packageTitle}</span>
                      <button onClick={() => { setPkg(null); setStep(0); }}>Değiştir</button>
                    </div>
                  )}
                  {!pkg && service && (
                    <div className="pkg-preset" style={{ background: 'var(--rose-light)', color: 'var(--plum)' }}>
                      <span>{service.name}</span>
                      <button onClick={() => setStep(0)}>Değiştir</button>
                    </div>
                  )}
                  <div className="opt-list">
                    <button className={`opt ${expertId === ANY ? 'on' : ''}`} onClick={() => setExpertId(ANY)}>
                      <span className="avatar" style={{ background: 'var(--gold)' }}><Users size={20} /></span>
                      <div className="grow">
                        <strong>Fark etmez</strong>
                        <span>En erken müsait uzmana yönlendirilirsiniz — daha fazla saat seçeneği</span>
                      </div>
                    </button>
                    {experts.map((e) => (
                      <button key={e.id} className={`opt ${expertId === e.id ? 'on' : ''}`} onClick={() => setExpertId(e.id)}>
                        <span className="avatar">{e.initials}</span>
                        <div className="grow">
                          <strong>{e.name}</strong>
                          <span>{e.title} · {e.experienceYears} yıl deneyim</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="date-strip" role="listbox" aria-label="Tarih seçin">
                    {days.map((d) => {
                      const iso = toIsoDate(d);
                      const closed = !openingHours(d);
                      return (
                        <button
                          key={iso}
                          role="option"
                          aria-selected={date === iso}
                          className={`date-pill ${date === iso ? 'on' : ''}`}
                          disabled={closed}
                          onClick={() => setDate(iso)}
                        >
                          <small>{DAY_NAMES[d.getDay()]}</small>
                          <strong>{d.getDate()}</strong>
                          <em>{closed ? 'Kapalı' : MONTHS[d.getMonth()]}</em>
                        </button>
                      );
                    })}
                  </div>
                  {!date ? (
                    <p className="empty-hint">Müsait saatleri görmek için bir gün seçin.</p>
                  ) : slotsLoading ? (
                    <div className="loader" />
                  ) : slots.filter((s) => s.available).length === 0 ? (
                    <p className="empty-hint">Bu gün için boş saat kalmadı. Lütfen başka bir gün seçin.</p>
                  ) : (
                    <>
                      <div className="slot-legend">
                        <span>{formatLongDate(date)}</span>
                        <span>· {slots.filter((s) => s.available).length} boş saat</span>
                      </div>
                      <div className="slot-grid">
                        {slots.map((s) => (
                          <button
                            key={s.time}
                            className={`slot ${time === s.time ? 'on' : ''}`}
                            disabled={!s.available}
                            aria-label={`${s.time} ${s.available ? 'müsait' : 'dolu'}`}
                            onClick={() => setTime(s.time)}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {error && <div className="alert">{error}</div>}
                </>
              )}

              {step === 3 && (
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="b-name">Ad Soyad *</label>
                    <input id="b-name" value={form.name} onChange={set('name')} autoComplete="name" className={touched && errors.name ? 'err' : ''} />
                    {touched && errors.name && <span className="msg">{errors.name}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="b-phone">Cep Telefonu *</label>
                    <input id="b-phone" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" className={touched && errors.phone ? 'err' : ''} />
                    {touched && errors.phone && <span className="msg">{errors.phone}</span>}
                  </div>
                  <div className="field full">
                    <label htmlFor="b-email">E-posta (isteğe bağlı)</label>
                    <input id="b-email" type="email" value={form.email} onChange={set('email')} autoComplete="email" className={touched && errors.email ? 'err' : ''} />
                    {touched && errors.email && <span className="msg">{errors.email}</span>}
                  </div>
                  <div className="field full">
                    <label htmlFor="b-note">Not (isteğe bağlı)</label>
                    <textarea id="b-note" rows={3} value={form.note} onChange={set('note')} placeholder="Örn. hassas cildim var, daha önce lazer yaptırdım…" />
                  </div>
                  <label className="check field full">
                    <input type="checkbox" checked={form.firstVisit} onChange={set('firstVisit')} />
                    <span>İlk ziyaretim — ücretsiz cilt analizi ve deneme atışı istiyorum.</span>
                  </label>
                  <label className="check field full">
                    <input type="checkbox" checked={form.consent} onChange={set('consent')} />
                    <span>Kişisel verilerimin randevu amacıyla işlenmesine ilişkin KVKK aydınlatma metnini okudum, onaylıyorum. *</span>
                  </label>
                  {touched && errors.consent && <span className="msg" style={{ color: '#C0392B', fontSize: '.78rem' }}>{errors.consent}</span>}
                </div>
              )}

              {step === 4 && (
                <>
                  <div className="recap">
                    <div className="sum-row"><span>Hizmet</span><b>{service?.name}</b></div>
                    {pkg && <div className="sum-row"><span>Paket</span><b>{pkg.packageTitle}</b></div>}
                    <div className="sum-row"><span>Uzman</span><b>{resolvedExpert?.name}</b></div>
                    <div className="sum-row"><span>Tarih</span><b>{formatLongDate(date)}, {time}</b></div>
                    <div className="sum-row"><span>Süre</span><b>~{service?.durationMinutes} dk</b></div>
                    <div className="sum-row"><span>Danışan</span><b>{form.name} · {form.phone}</b></div>
                  </div>
                  <p style={{ fontSize: '.84rem', color: 'var(--muted)' }}>
                    Randevunuzdan 24 saat öncesine kadar ücretsiz iptal veya değişiklik yapabilirsiniz.
                  </p>
                  {error && <div className="alert">{error}</div>}
                </>
              )}

              <div className="modal-foot">
                {step > 0 ? (
                  <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft size={17} /> Geri</button>
                ) : <span />}
                {step < 4 ? (
                  step !== 0 && (
                    <button className="btn btn-primary" disabled={step !== 3 && !canNext} onClick={next}>
                      Devam <ArrowRight size={17} />
                    </button>
                  )
                ) : (
                  <button className="btn btn-rose" disabled={submitting} onClick={submit}>
                    {submitting ? 'Gönderiliyor…' : 'Randevuyu Onayla'} <Check size={17} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

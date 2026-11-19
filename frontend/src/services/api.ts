import type {
  Appointment,
  CampaignPackage,
  CreateAppointmentRequest,
  Device,
  Expert,
  Service,
  TimeSlot,
} from '../types';
import { DEVICES, EXPERTS, PACKAGES, SERVICES } from '../data/catalog';

/**
 * Data access boundary. The UI only talks to `salonApi`.
 * - No VITE_API_URL  → LocalSalonApi (catalog constants + localStorage) so the
 *   site works standalone on GitHub Pages.
 * - VITE_API_URL set → HttpSalonApi, which calls the .NET backend.
 */
export interface SalonApi {
  getServices(): Promise<Service[]>;
  getPackages(): Promise<CampaignPackage[]>;
  getDevices(): Promise<Device[]>;
  getExperts(serviceId?: string): Promise<Expert[]>;
  getAvailability(expertId: string, date: string): Promise<TimeSlot[]>;
  createAppointment(req: CreateAppointmentRequest): Promise<Appointment>;
  findAppointments(phone: string): Promise<Appointment[]>;
  cancelAppointment(id: string, phone: string): Promise<Appointment>;
}

// ---------- shared scheduling rules (mirrored in the backend) ----------

export const SLOT_MINUTES = 30;

export function openingHours(date: Date): { open: number; close: number } | null {
  const day = date.getDay(); // 0 = Sunday
  if (day === 0) return null;
  if (day === 6) return { open: 10 * 60, close: 18 * 60 };
  return { open: 10 * 60, close: 20 * 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');
export const toIsoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toHm = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('90') ? digits.slice(2) : digits.startsWith('0') ? digits.slice(1) : digits;
}

// ---------- local (standalone) implementation ----------

const STORAGE_KEY = 'nuans.appointments.v1';
const delay = <T,>(value: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(value), ms));

function readStore(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Appointment[];
  } catch {
    return [];
  }
}
function writeStore(items: Appointment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — demo keeps working in memory for this call */
  }
}

/** Deterministic pseudo-occupancy so the demo calendar doesn't look empty. */
function seededBusy(expertId: string, date: string, time: string) {
  let h = 0;
  for (const c of expertId + date + time) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h % 100 < 28;
}

function makeCode() {
  const alphabet = 'ABCDEFGHJKLMNPRSTUVYZ23456789';
  let s = 'NU-';
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

class LocalSalonApi implements SalonApi {
  getServices() { return delay(SERVICES); }
  getPackages() { return delay(PACKAGES); }
  getDevices() { return delay(DEVICES); }

  getExperts(serviceId?: string) {
    const service = SERVICES.find((s) => s.id === serviceId);
    return delay(service ? EXPERTS.filter((e) => e.specialties.includes(service.category)) : EXPERTS);
  }

  getAvailability(expertId: string, date: string) {
    const d = new Date(`${date}T00:00:00`);
    const hours = openingHours(d);
    if (!hours) return delay<TimeSlot[]>([]);
    const now = new Date();
    const isToday = toIsoDate(now) === date;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const taken = new Set(
      readStore()
        .filter((a) => a.expertId === expertId && a.date === date && a.status !== 'İptal')
        .map((a) => a.time),
    );
    const slots: TimeSlot[] = [];
    for (let m = hours.open; m + SLOT_MINUTES <= hours.close; m += SLOT_MINUTES) {
      const time = toHm(m);
      const available = !(isToday && m <= nowMins + 60) && !taken.has(time) && !seededBusy(expertId, date, time);
      slots.push({ time, available });
    }
    return delay(slots);
  }

  async createAppointment(req: CreateAppointmentRequest) {
    const slots = await this.getAvailability(req.expertId, req.date);
    if (!slots.find((s) => s.time === req.time && s.available)) {
      throw new Error('Seçtiğiniz saat az önce doldu. Lütfen başka bir saat seçin.');
    }
    const appt: Appointment = {
      ...req,
      customerPhone: normalizePhone(req.customerPhone),
      id: crypto.randomUUID(),
      code: makeCode(),
      status: 'Beklemede',
      createdAt: new Date().toISOString(),
    };
    writeStore([...readStore(), appt]);
    return delay(appt, 400);
  }

  findAppointments(phone: string) {
    const p = normalizePhone(phone);
    return delay(
      readStore()
        .filter((a) => a.customerPhone === p)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    );
  }

  async cancelAppointment(id: string, phone: string) {
    const items = readStore();
    const appt = items.find((a) => a.id === id && a.customerPhone === normalizePhone(phone));
    if (!appt) throw new Error('Randevu bulunamadı.');
    appt.status = 'İptal';
    writeStore(items);
    return delay(appt);
  }
}

// ---------- HTTP implementation (.NET backend) ----------

class HttpSalonApi implements SalonApi {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
    if (!res.ok) {
      let message = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      try {
        const body = await res.json();
        message = body.detail ?? body.title ?? message;
      } catch { /* non-JSON error */ }
      throw new Error(message);
    }
    return res.json() as Promise<T>;
  }

  getServices() { return this.req<Service[]>('/api/services'); }
  getPackages() { return this.req<CampaignPackage[]>('/api/packages'); }
  getDevices() { return this.req<Device[]>('/api/devices'); }
  getExperts(serviceId?: string) {
    return this.req<Expert[]>(`/api/experts${serviceId ? `?serviceId=${encodeURIComponent(serviceId)}` : ''}`);
  }
  getAvailability(expertId: string, date: string) {
    return this.req<TimeSlot[]>(`/api/appointments/availability?expertId=${encodeURIComponent(expertId)}&date=${date}`);
  }
  createAppointment(body: CreateAppointmentRequest) {
    return this.req<Appointment>('/api/appointments', { method: 'POST', body: JSON.stringify(body) });
  }
  findAppointments(phone: string) {
    return this.req<Appointment[]>(`/api/appointments?phone=${encodeURIComponent(normalizePhone(phone))}`);
  }
  cancelAppointment(id: string, phone: string) {
    return this.req<Appointment>(`/api/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ phone: normalizePhone(phone) }),
    });
  }
}

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
export const salonApi: SalonApi = apiUrl ? new HttpSalonApi(apiUrl.replace(/\/$/, '')) : new LocalSalonApi();

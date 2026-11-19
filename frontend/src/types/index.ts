// Shared domain types. These mirror the DTOs the .NET API will expose,
// so swapping the mock repositories for HTTP calls needs no UI changes.

export type ServiceCategory = 'lazer' | 'cilt' | 'vucut';

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  durationMinutes: number;
  priceFrom: number;
  deviceIds: string[];
}

export interface CampaignPackage {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  sessions: number;
  regularPrice: number;
  campaignPrice: number;
  /** ISO date — campaign end */
  endsAt: string;
  highlights: string[];
  serviceId: string;
  badge?: string;
  featured?: boolean;
}

/** A body area used by the custom laser package builder */
export interface LaserArea {
  id: string;
  name: string;
  group: 'yuz' | 'ust' | 'alt';
  pricePerSession: number;
  minutes: number;
}

export interface Device {
  id: string;
  name: string;
  technology: string;
  wavelength?: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  /** Fitzpatrick skin types I–VI the device is suitable for */
  skinTypes: number[];
  benefits: string[];
  usedFor: string[];
  accent: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specialties: ServiceCategory[];
  experienceYears: number;
  initials: string;
}

export interface TimeSlot {
  time: string; // "HH:mm"
  available: boolean;
}

export type AppointmentStatus = 'Beklemede' | 'Onaylandı' | 'İptal';

export interface CreateAppointmentRequest {
  serviceId: string;
  packageId?: string;
  expertId: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  note?: string;
  firstVisit: boolean;
}

export interface Appointment extends CreateAppointmentRequest {
  id: string;
  code: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Testimonial {
  name: string;
  service: string;
  text: string;
  rating: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

# Nüans — Lazer & Cilt Bakım Stüdyosu

Güzellik merkezleri, lazer epilasyon ve cilt bakım salonları için web sitesi.

**Kilit özellikler**
- **Kampanyalı seans paketleri:** geri sayımlı kampanya kartları, seans başı fiyat, kazanç hesabı, kategori filtresi
- **Kendi paketini oluştur:** bölge + seans seçimi, çoklu bölge / seans indirimleri ile anlık fiyat
- **Cihaz tanıtımı:** Diode, Alexandrite, Nd:YAG, hidro-dermabrazyon, RF mikroiğne; dalga boyu spektrumu, teknik özellikler, Fitzpatrick ten tipi uyumu
- **Online randevu:** hizmet → uzman (veya "fark etmez") → tarih & müsait saat → bilgiler → onay; randevu kodu, takvime ekleme (.ics)
- **Randevularım:** telefon numarasıyla sorgulama ve iptal

## Yapı

```
frontend/   TypeScript + React + Vite
backend/    .NET Clean Architecture (frontend onayından sonra eklenecek)
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Veri erişimi `src/services/api.ts` içindeki `SalonApi` arayüzünden geçer:
- `VITE_API_URL` tanımlı değilse → `LocalSalonApi` (katalog verisi + localStorage, GitHub Pages'te tek başına çalışır)
- `VITE_API_URL` tanımlıysa → `HttpSalonApi` (.NET API)

Planlanan API uç noktaları:

| Metot | Yol |
|---|---|
| GET | `/api/services`, `/api/packages`, `/api/devices`, `/api/experts?serviceId=` |
| GET | `/api/appointments/availability?expertId=&date=` |
| POST | `/api/appointments` |
| GET | `/api/appointments?phone=` |
| POST | `/api/appointments/{id}/cancel` |

## Yayın

`main` dalına her push'ta GitHub Actions `frontend/dist` çıktısını GitHub Pages'e yayınlar.

import type {
  CampaignPackage,
  Device,
  Expert,
  FaqItem,
  LaserArea,
  Service,
  Testimonial,
} from '../types';

export const SALON = {
  name: 'Nüans',
  fullName: 'Nüans Lazer & Cilt Bakım Stüdyosu',
  phone: '+90 242 000 00 00',
  phoneHref: 'tel:+902420000000',
  whatsapp: 'https://wa.me/902420000000',
  address: 'Fener Mah. Tekelioğlu Cad. No: 00, Muratpaşa / Antalya',
  hours: [
    { day: 'Pazartesi – Cuma', time: '10:00 – 20:00' },
    { day: 'Cumartesi', time: '10:00 – 18:00' },
    { day: 'Pazar', time: 'Kapalı' },
  ],
  instagram: 'https://instagram.com/',
};

/** Days ahead from today, used so campaign countdowns stay live in the demo. */
const daysFromNow = (d: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  dt.setHours(23, 59, 0, 0);
  return dt.toISOString();
};

export const SERVICES: Service[] = [
  {
    id: 'lazer-tum-vucut',
    category: 'lazer',
    name: 'Tüm Vücut Lazer Epilasyon',
    description: 'Yüz hariç tüm bölgeler tek seansta. Buz başlıklı diode teknolojisiyle konforlu uygulama.',
    durationMinutes: 90,
    priceFrom: 1800,
    deviceIds: ['diode', 'alex'],
  },
  {
    id: 'lazer-bolgesel',
    category: 'lazer',
    name: 'Bölgesel Lazer Epilasyon',
    description: 'Koltuk altı, bikini, bacak, sırt gibi bölgeleri dilediğiniz gibi birleştirin.',
    durationMinutes: 30,
    priceFrom: 350,
    deviceIds: ['diode', 'alex', 'ndyag'],
  },
  {
    id: 'lazer-yuz',
    category: 'lazer',
    name: 'Yüz Lazer Epilasyon',
    description: 'Üst dudak, çene, favori ve alın bölgesi için hassas başlık ile uygulama.',
    durationMinutes: 20,
    priceFrom: 300,
    deviceIds: ['diode', 'alex'],
  },
  {
    id: 'hydra',
    category: 'cilt',
    name: 'Hydrafacial Derin Bakım',
    description: 'Temizlik, peeling, ekstraksiyon ve serum infüzyonu — 6 adımda ışıltılı cilt.',
    durationMinutes: 60,
    priceFrom: 1400,
    deviceIds: ['hydro'],
  },
  {
    id: 'mikroigne',
    category: 'cilt',
    name: 'RF Mikroiğne (Dermapen)',
    description: 'Akne izi, gözenek ve ince çizgiler için kolajen uyarımı.',
    durationMinutes: 45,
    priceFrom: 2200,
    deviceIds: ['rf'],
  },
  {
    id: 'leke',
    category: 'cilt',
    name: 'Leke & Karbon Peeling',
    description: 'Nd:YAG ile karbon peeling — leke, yağlanma ve gözenek görünümünde azalma.',
    durationMinutes: 40,
    priceFrom: 1500,
    deviceIds: ['ndyag'],
  },
  {
    id: 'klasik-bakim',
    category: 'cilt',
    name: 'Klasik Cilt Bakımı',
    description: 'Cilt analizi, buhar, temizlik ve cilt tipinize özel maske.',
    durationMinutes: 50,
    priceFrom: 900,
    deviceIds: ['hydro'],
  },
  {
    id: 'bolgesel-incelme',
    category: 'vucut',
    name: 'Bölgesel İncelme & Sıkılaşma',
    description: 'RF ve vakum destekli uygulama ile selülit görünümü ve sıkılaşma.',
    durationMinutes: 45,
    priceFrom: 1100,
    deviceIds: ['rf'],
  },
];

export const PACKAGES: CampaignPackage[] = [
  {
    id: 'pkg-tum-vucut-8',
    title: 'Tüm Vücut 8 Seans',
    subtitle: 'Lazer epilasyonda en çok tercih edilen paket',
    category: 'lazer',
    sessions: 8,
    regularPrice: 14400,
    campaignPrice: 8990,
    endsAt: daysFromNow(9),
    highlights: ['Yüz bölgesi hediye', 'Ücretsiz deneme atışı', '12 aya kadar taksit', 'Kaçırılan seans telafisi'],
    serviceId: 'lazer-tum-vucut',
    badge: 'En Çok Tercih Edilen',
    featured: true,
  },
  {
    id: 'pkg-mini-3bolge',
    title: '3 Bölge 6 Seans',
    subtitle: 'Koltuk altı + bikini + yarım bacak',
    category: 'lazer',
    sessions: 6,
    regularPrice: 7200,
    campaignPrice: 4490,
    endsAt: daysFromNow(5),
    highlights: ['Bölgeleri değiştirebilme', 'Ücretsiz deneme atışı', '6 taksit'],
    serviceId: 'lazer-bolgesel',
    badge: '%38 İndirim',
  },
  {
    id: 'pkg-hydra-4',
    title: 'Hydrafacial 4 Seans',
    subtitle: 'Aylık bakım kürü — 1 seans hediye',
    category: 'cilt',
    sessions: 4,
    regularPrice: 5600,
    campaignPrice: 3890,
    endsAt: daysFromNow(12),
    highlights: ['+1 seans hediye', 'Cilt analizi dahil', 'LED terapi ekstra'],
    serviceId: 'hydra',
    badge: '4 Al 5 Öde',
  },
  {
    id: 'pkg-akne-izi',
    title: 'Akne İzi Kürü',
    subtitle: '4 seans RF mikroiğne + 2 Hydrafacial',
    category: 'cilt',
    sessions: 6,
    regularPrice: 11600,
    campaignPrice: 7490,
    endsAt: daysFromNow(16),
    highlights: ['Uzman cilt analizi', 'Ev bakım seti hediye', 'Öncesi / sonrası takip'],
    serviceId: 'mikroigne',
  },
  {
    id: 'pkg-erkek-sirt',
    title: 'Erkek Sırt + Omuz 8 Seans',
    subtitle: 'Erkeklere özel güçlü başlık ile',
    category: 'lazer',
    sessions: 8,
    regularPrice: 9600,
    campaignPrice: 5990,
    endsAt: daysFromNow(7),
    highlights: ['Ense hediye', 'Nd:YAG ile koyu ten uyumu', '6 taksit'],
    serviceId: 'lazer-bolgesel',
  },
  {
    id: 'pkg-incelme-10',
    title: 'Sıkılaşma 10 Seans',
    subtitle: 'Karın, basen veya kol — tek bölge',
    category: 'vucut',
    sessions: 10,
    regularPrice: 11000,
    campaignPrice: 6990,
    endsAt: daysFromNow(20),
    highlights: ['Ölçüm takibi', 'Beslenme önerisi', '2 bölgeye geçiş imkânı'],
    serviceId: 'bolgesel-incelme',
  },
];

export const LASER_AREAS: LaserArea[] = [
  { id: 'ust-dudak', name: 'Üst Dudak', group: 'yuz', pricePerSession: 150, minutes: 5 },
  { id: 'cene', name: 'Çene', group: 'yuz', pricePerSession: 180, minutes: 5 },
  { id: 'tum-yuz', name: 'Tüm Yüz', group: 'yuz', pricePerSession: 400, minutes: 15 },
  { id: 'koltuk', name: 'Koltuk Altı', group: 'ust', pricePerSession: 250, minutes: 10 },
  { id: 'kol', name: 'Tüm Kol', group: 'ust', pricePerSession: 450, minutes: 15 },
  { id: 'gogus-karin', name: 'Göğüs + Karın', group: 'ust', pricePerSession: 500, minutes: 15 },
  { id: 'sirt', name: 'Sırt', group: 'ust', pricePerSession: 550, minutes: 20 },
  { id: 'bikini', name: 'Bikini Bölgesi', group: 'alt', pricePerSession: 350, minutes: 15 },
  { id: 'yarim-bacak', name: 'Yarım Bacak', group: 'alt', pricePerSession: 450, minutes: 20 },
  { id: 'tum-bacak', name: 'Tüm Bacak', group: 'alt', pricePerSession: 750, minutes: 30 },
];

/** Builder rules: more areas and more sessions mean bigger discounts. */
export const BUILDER_RULES = {
  sessionOptions: [4, 6, 8, 10],
  sessionDiscount: { 4: 0, 6: 0.1, 8: 0.18, 10: 0.25 } as Record<number, number>,
  areaDiscount: (count: number) => (count >= 5 ? 0.15 : count >= 3 ? 0.08 : 0),
};

export const DEVICES: Device[] = [
  {
    id: 'diode',
    name: 'Buz Başlıklı Diode Lazer',
    technology: 'Diode Lazer',
    wavelength: '808 nm',
    tagline: 'Neredeyse acısız, hızlı ve tüm yıl uygulanabilir.',
    description:
      'Safir buz başlık cildi uygulama sırasında yaklaşık 4°C’de tutar. 808 nm dalga boyu kıl kökündeki melanine odaklanır, çevre dokuyu korur. Geniş spot sayesinde tüm vücut seansı yaklaşık 60–90 dakikada tamamlanır.',
    specs: [
      { label: 'Dalga boyu', value: '808 nm' },
      { label: 'Soğutma', value: 'Safir temas, −4°C' },
      { label: 'Spot boyutu', value: '12 × 20 mm' },
      { label: 'Atış hızı', value: '10 Hz' },
    ],
    skinTypes: [1, 2, 3, 4, 5],
    benefits: ['Konforlu, acı hissi minimum', 'Bronz tende güvenli', 'Yaz aylarında da uygulanabilir'],
    usedFor: ['Tüm vücut', 'Bacak', 'Koltuk altı', 'Bikini'],
    accent: '#C46A7A',
  },
  {
    id: 'alex',
    name: 'Alexandrite Lazer',
    technology: 'Alexandrite',
    wavelength: '755 nm',
    tagline: 'İnce ve açık renkli kıllarda yüksek etkinlik.',
    description:
      '755 nm dalga boyu melanin tarafından çok güçlü emilir; bu yüzden ince, açık kahve kıllarda ve açık tenlerde daha az seansla sonuç verir. Kriyojen sprey soğutma ile her atış öncesi cilt korunur.',
    specs: [
      { label: 'Dalga boyu', value: '755 nm' },
      { label: 'Soğutma', value: 'Kriyojen sprey (DCD)' },
      { label: 'Spot boyutu', value: '6 – 18 mm' },
      { label: 'Atım süresi', value: '3 ms' },
    ],
    skinTypes: [1, 2, 3],
    benefits: ['İnce kıllarda güçlü sonuç', 'Daha az seans ihtiyacı', 'Yüz bölgesi için ideal'],
    usedFor: ['Yüz', 'Üst dudak', 'Kol', 'İnce kıllar'],
    accent: '#9A6BB8',
  },
  {
    id: 'ndyag',
    name: 'Nd:YAG Lazer',
    technology: 'Nd:YAG',
    wavelength: '1064 nm',
    tagline: 'Koyu tenlerde güvenli epilasyon ve karbon peeling.',
    description:
      'Uzun dalga boyu derin dokulara ulaşır ve epidermisteki melaninden daha az etkilenir. Koyu ve esmer tenlerde güvenli epilasyonun yanı sıra karbon peeling ile leke ve gözenek tedavisinde kullanılır.',
    specs: [
      { label: 'Dalga boyu', value: '1064 nm / 532 nm' },
      { label: 'Mod', value: 'Uzun atım + Q-Switch' },
      { label: 'Spot boyutu', value: '3 – 10 mm' },
      { label: 'Kullanım', value: 'Epilasyon, leke, karbon peeling' },
    ],
    skinTypes: [3, 4, 5, 6],
    benefits: ['Koyu tende güvenli', 'Leke ve gözenek tedavisi', 'Erkek sırt ve sakal bölgesi'],
    usedFor: ['Esmer ten', 'Sakal sınırı', 'Leke', 'Karbon peeling'],
    accent: '#3E6E8E',
  },
  {
    id: 'hydro',
    name: 'Hidro-dermabrazyon Sistemi',
    technology: 'Vakum + Serum İnfüzyonu',
    tagline: 'Tek seansta temiz, nemli ve ışıltılı bir cilt.',
    description:
      'Spiral başlıklar vakumla gözenekleri temizlerken aynı anda cildinize özel serumları infüze eder. Ağrısız, iyileşme süresi gerektirmez; seans sonrası makyaj yapılabilir.',
    specs: [
      { label: 'Adım', value: '6 aşamalı protokol' },
      { label: 'Başlık', value: 'Spiral vortex uçlar' },
      { label: 'Ek modül', value: 'LED + soğuk çekiç' },
      { label: 'Süre', value: '45 – 60 dk' },
    ],
    skinTypes: [1, 2, 3, 4, 5, 6],
    benefits: ['İyileşme süresi yok', 'Tüm cilt tiplerine uygun', 'Anında ışıltı'],
    usedFor: ['Siyah nokta', 'Matlık', 'Nem kaybı', 'Özel gün öncesi'],
    accent: '#3E9C93',
  },
  {
    id: 'rf',
    name: 'RF Mikroiğne',
    technology: 'Radyofrekans + Mikroiğne',
    tagline: 'Kolajen üretimini derinden uyarır.',
    description:
      'Altın kaplı mikroiğneler, ayarlanabilir derinlikte (0,5–3,5 mm) radyofrekans enerjisi ileterek kolajen ve elastin üretimini tetikler. Akne izi, gözenek, ince çizgi ve sıkılaşma için kullanılır.',
    specs: [
      { label: 'İğne derinliği', value: '0,5 – 3,5 mm' },
      { label: 'İğne', value: 'Altın kaplı, izole' },
      { label: 'Enerji', value: 'Bipolar RF' },
      { label: 'İyileşme', value: '1 – 3 gün kızarıklık' },
    ],
    skinTypes: [1, 2, 3, 4, 5, 6],
    benefits: ['Akne izinde belirgin iyileşme', 'Gözenek sıkılaşması', 'Yüz ve vücutta uygulanabilir'],
    usedFor: ['Akne izi', 'Gözenek', 'İnce çizgi', 'Çatlak'],
    accent: '#C58B4E',
  },
];

export const EXPERTS: Expert[] = [
  { id: 'e1', name: 'Selin Aydın', title: 'Lazer Uzmanı', specialties: ['lazer'], experienceYears: 9, initials: 'SA' },
  { id: 'e2', name: 'Derya Kaya', title: 'Medikal Estetisyen', specialties: ['cilt', 'vucut'], experienceYears: 12, initials: 'DK' },
  { id: 'e3', name: 'Melis Toprak', title: 'Cilt Bakım Uzmanı', specialties: ['cilt'], experienceYears: 6, initials: 'MT' },
  { id: 'e4', name: 'Burak Şen', title: 'Lazer Uzmanı (Erkek)', specialties: ['lazer', 'vucut'], experienceYears: 7, initials: 'BŞ' },
];

export const FITZPATRICK = [
  { type: 1, label: 'Tip I', desc: 'Çok açık, her zaman yanar', color: '#F6E3D4' },
  { type: 2, label: 'Tip II', desc: 'Açık, kolay yanar', color: '#EDCCB0' },
  { type: 3, label: 'Tip III', desc: 'Buğday, bazen yanar', color: '#D7A887' },
  { type: 4, label: 'Tip IV', desc: 'Esmer, nadiren yanar', color: '#B57F5A' },
  { type: 5, label: 'Tip V', desc: 'Koyu esmer', color: '#8A5737' },
  { type: 6, label: 'Tip VI', desc: 'Çok koyu', color: '#55341F' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ece T.',
    service: 'Tüm Vücut Lazer',
    text: 'Daha önce başka yerde çok acı çekmiştim. Buradaki buz başlıklı cihazla seanslar gerçekten rahat geçiyor, 5. seansta fark çok belirgin.',
    rating: 5,
  },
  {
    name: 'Zeynep A.',
    service: 'Hydrafacial',
    text: 'Düğünümden önce 2 seans yaptırdım, cildim hiç bu kadar parlak olmamıştı. Uygulama öncesi analiz çok detaylıydı.',
    rating: 5,
  },
  {
    name: 'Mert K.',
    service: 'Sırt Lazer',
    text: 'Erkeklere ayrı uzman olması rahatlattı. Online randevu sistemi çok pratik, saat seçip geldim, hiç beklemedim.',
    rating: 5,
  },
  {
    name: 'Buse Ç.',
    service: 'RF Mikroiğne',
    text: 'Akne izlerim için 3 seans aldım, gözeneklerim de küçüldü. Seans sonrası takip mesajları çok güzel bir detay.',
    rating: 4,
  },
];

export const FAQS: FaqItem[] = [
  {
    q: 'Lazer epilasyon kaç seans sürer?',
    a: 'Kıl yapısına, bölgeye ve hormonal duruma göre genellikle 6–10 seans gerekir. Seanslar arası 4–8 hafta beklenir. İlk görüşmede ücretsiz deneme atışı ile kişisel planınızı çıkarıyoruz.',
  },
  {
    q: 'Yaz aylarında lazer yaptırabilir miyim?',
    a: 'Evet. Diode ve Nd:YAG cihazlarımız bronz tende güvenle kullanılabilir. Yine de seanstan 1 hafta önce ve sonra yoğun güneşten kaçınmanızı, SPF 50 kullanmanızı öneriyoruz.',
  },
  {
    q: 'Kampanyalı paketleri bölmek ya da devretmek mümkün mü?',
    a: 'Paket seanslarınızı 12 ay içinde dilediğiniz zaman kullanabilirsiniz. Aynı kategori içinde bölge değişikliği ve birinci derece yakınınıza devir yapılabilir.',
  },
  {
    q: 'Online randevu aldıktan sonra ne oluyor?',
    a: 'Randevunuz sisteme “Beklemede” olarak düşer; ekibimiz 30 dakika içinde SMS/WhatsApp ile onaylar. Randevu kodunuzla “Randevularım” bölümünden durumu takip edebilir, iptal edebilirsiniz.',
  },
  {
    q: 'Cilt bakımı sonrası iyileşme süresi var mı?',
    a: 'Hydrafacial ve klasik bakımda iyileşme süresi yoktur. RF mikroiğne sonrası 1–3 gün hafif kızarıklık olabilir; uzmanınız size özel bakım talimatı verir.',
  },
  {
    q: 'Ödeme seçenekleriniz neler?',
    a: 'Nakit, kredi kartı ve paketlerde 12 aya kadar taksit seçeneği sunuyoruz. Kampanya fiyatları peşin ve taksitli ödemede aynıdır.',
  },
];

export const CATEGORY_LABEL: Record<string, string> = {
  lazer: 'Lazer Epilasyon',
  cilt: 'Cilt Bakımı',
  vucut: 'Vücut',
};

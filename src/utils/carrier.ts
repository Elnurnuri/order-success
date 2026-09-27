export interface CarrierConfig {
  name: string;
  trackingUrlPattern: (trackingNumber: string) => string;
  logoBg: string;
  badgeBg: string;
  website: string;
  supportPhone: string;
}

export const CARRIERS: Record<string, CarrierConfig> = {
  'Yurtiçi Kargo': {
    name: 'Yurtiçi Kargo',
    trackingUrlPattern: (code: string) =>
      `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#F58220]',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    website: 'https://www.yurticikargo.com',
    supportPhone: '444 99 99',
  },
  'Aras Kargo': {
    name: 'Aras Kargo',
    trackingUrlPattern: (code: string) =>
      `https://kargotakip.araskargo.com.tr/?code=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#009FE3]',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    website: 'https://www.araskargo.com.tr',
    supportPhone: '444 25 52',
  },
  'MNG Kargo': {
    name: 'MNG Kargo',
    trackingUrlPattern: (code: string) =>
      `https://kargotakip.mngkargo.com.tr/?trackingNumber=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#0B2046]',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    website: 'https://www.mngkargo.com.tr',
    supportPhone: '0850 222 06 06',
  },
  'Sürat Kargo': {
    name: 'Sürat Kargo',
    trackingUrlPattern: (code: string) =>
      `https://suratkargo.com.tr/KargoTakip/?kargotakipno=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#ED1C24]',
    badgeBg: 'bg-red-100 text-red-900 border-red-300',
    website: 'https://suratkargo.com.tr',
    supportPhone: '0850 202 02 02',
  },
  'Kolay Gelsin': {
    name: 'Kolay Gelsin',
    trackingUrlPattern: (code: string) =>
      `https://www.kolaygelsin.com/kargo-takip?tracking=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#FF6F00]',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    website: 'https://www.kolaygelsin.com',
    supportPhone: '0850 955 09 55',
  },
  'HepsiJET': {
    name: 'HepsiJET',
    trackingUrlPattern: (code: string) =>
      `https://hepsijet.com/gonderi-takibi?code=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#FF6000]',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
    website: 'https://hepsijet.com',
    supportPhone: '0850 558 03 33',
  },
  'Trendyol Express': {
    name: 'Trendyol Express',
    trackingUrlPattern: (code: string) =>
      `https://kargotakip.trendyol.com/?code=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#F27A1A]',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    website: 'https://trendyol.com',
    supportPhone: '0850 759 15 15',
  },
  'PTT Kargo': {
    name: 'PTT Kargo',
    trackingUrlPattern: (code: string) =>
      `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${encodeURIComponent(code)}`,
    logoBg: 'bg-[#FFCC00]',
    badgeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    website: 'https://www.ptt.gov.tr',
    supportPhone: '444 1 788',
  },
};

/**
 * Returns the dynamic carrier tracking URL based on carrier name and tracking number
 */
export function getCarrierTrackingUrl(
  carrierName?: string,
  trackingNumber?: string,
  customUrl?: string
): string {
  if (customUrl) return customUrl;
  const num = (trackingNumber || '').trim();
  const name = (carrierName || 'Yurtiçi Kargo').trim();

  for (const [key, val] of Object.entries(CARRIERS)) {
    if (
      name.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(name.toLowerCase())
    ) {
      return val.trackingUrlPattern(num);
    }
  }

  return `https://www.google.com/search?q=${encodeURIComponent(
    `${name} kargo takip ${num}`
  )}`;
}

/**
 * Returns carrier info like logo colors, support phone, etc.
 */
export function getCarrierConfig(carrierName?: string): CarrierConfig {
  const name = (carrierName || 'Yurtiçi Kargo').trim();
  for (const [key, val] of Object.entries(CARRIERS)) {
    if (
      name.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(name.toLowerCase())
    ) {
      return val;
    }
  }
  return {
    name: name,
    trackingUrlPattern: (code: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(
        `${name} kargo takip ${code}`
      )}`,
    logoBg: 'bg-blue-600',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
    website: '#',
    supportPhone: 'Müşteri Hizmetleri',
  };
}

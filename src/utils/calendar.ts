import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';

const TR_MONTHS: Record<string, number> = {
  'ocak': 0,
  'şubat': 1,
  'mart': 2,
  'nisan': 3,
  'mayıs': 4,
  'haziran': 5,
  'temmuz': 6,
  'ağustos': 7,
  'eylül': 8,
  'ekim': 9,
  'kasım': 10,
  'aralık': 11,
};

/**
 * Parses Turkish date strings like "14 Eylül 2026, 13:45" or "10 Eylül 2026"
 */
export function parseTurkishDate(dateStr?: string): Date {
  if (!dateStr) return new Date();
  try {
    const cleanStr = dateStr.toLowerCase().trim();
    const match = cleanStr.match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})(?:[,\s]+(\d{1,2}):(\d{2}))?/);
    if (match) {
      const day = parseInt(match[1], 10);
      const monthName = match[2];
      const year = parseInt(match[3], 10);
      const hours = match[4] ? parseInt(match[4], 10) : 13;
      const minutes = match[5] ? parseInt(match[5], 10) : 30;
      const month = TR_MONTHS[monthName] ?? 8;
      // Construct UTC date
      return new Date(Date.UTC(year, month, day, hours, minutes));
    }
  } catch (err) {
    console.error('Date parse error:', err);
  }
  return new Date();
}

function formatDateToUTCString(date: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function getEventContent(order: OrderData, eventType: 'order_date' | 'delivered_date' | 'return_deadline') {
  let title = '';
  let startDate: Date;
  let endDate: Date;

  const itemsSummary = order.items.map(i => `• ${i.name} (${i.quantity} Adet)`).join('\n');
  const location = `${order.shippingAddress.addressLine}, ${order.shippingAddress.district} / ${order.shippingAddress.city}`;

  if (eventType === 'order_date') {
    title = `Sipariş Verildi: #${order.orderNumber}`;
    startDate = parseTurkishDate(order.createdAt);
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour
  } else if (eventType === 'return_deadline') {
    title = `Sipariş İade Süresi Son Günü: #${order.orderNumber}`;
    // 14 days after delivered
    const delivered = parseTurkishDate(order.deliveryDetails?.deliveredAt || order.createdAt);
    startDate = new Date(delivered.getTime() + 14 * 24 * 60 * 60 * 1000);
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  } else {
    // delivered_date (default)
    title = `Sipariş Teslim Edildi: #${order.orderNumber}`;
    startDate = parseTurkishDate(order.deliveryDetails?.deliveredAt || order.createdAt);
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }

  const details = [
    `Sipariş Numarası: ${order.orderNumber}`,
    `Sipariş Tarihi: ${order.createdAt}`,
    `Teslimat Tarihi: ${order.deliveryDetails?.deliveredAt || order.estimatedDeliveryDate}`,
    `Kargo Firması: ${order.carrierName} (Takip No: ${order.trackingNumber})`,
    `Teslim Alan: ${order.deliveryDetails?.recipientName || order.shippingAddress.fullName}`,
    `Toplam Tutar: ${formatCurrency(order.total)}`,
    order.deliveryDetails?.returnEligibleUntil ? `14 Günlük İade Hakkı: ${order.deliveryDetails.returnEligibleUntil}` : '',
    '',
    'Satın Alınan Ürünler:',
    itemsSummary,
  ].filter(Boolean).join('\n');

  return { title, details, location, startDate, endDate };
}

/**
 * Generates Google Calendar web add-event URL
 */
export function createGoogleCalendarUrl(order: OrderData, eventType: 'order_date' | 'delivered_date' | 'return_deadline' = 'delivered_date'): string {
  const { title, details, location, startDate, endDate } = getEventContent(order, eventType);
  const startStr = formatDateToUTCString(startDate);
  const endStr = formatDateToUTCString(endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates Outlook Live / Outlook 365 web add-event URL
 */
export function createOutlookCalendarUrl(order: OrderData, eventType: 'order_date' | 'delivered_date' | 'return_deadline' = 'delivered_date'): string {
  const { title, details, location, startDate, endDate } = getEventContent(order, eventType);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: details,
    location: location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generates and downloads an iCalendar (.ics) file
 */
export function downloadIcsFile(order: OrderData, eventType: 'order_date' | 'delivered_date' | 'return_deadline' = 'delivered_date') {
  const { title, details, location, startDate, endDate } = getEventContent(order, eventType);
  const startStr = formatDateToUTCString(startDate);
  const endStr = formatDateToUTCString(endDate);
  const nowStr = formatDateToUTCString(new Date());

  const cleanDetails = details.replace(/\n/g, '\\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//E-Commerce Order Tracker//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:order-${order.orderNumber}-${eventType}@eticaret.app`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${cleanDetails}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `siparis-${order.orderNumber}-${eventType}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

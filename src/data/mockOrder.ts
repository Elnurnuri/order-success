import { OrderData } from '../types';

export const initialOrderData: OrderData = {
  orderNumber: 'TR-9824105',
  createdAt: '10 Eylül 2026, 15:42',
  estimatedDeliveryDate: '13 - 15 Eylül 2026',
  status: 'preparing',
  items: [
    {
      id: 'prod-1',
      name: 'Sony WH-1000XM5 Aktif Gürültü Engelleyici Kulaklık',
      variant: 'Gümüş Gri / Bluetooth 5.2',
      price: 11499,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-2',
      name: 'MagSafe 15W Hızlı Kablosuz Şarj Standı',
      variant: 'Mat Siyah / Alüminyum Gövde',
      price: 1250,
      quantity: 1,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-3',
      name: 'Örgülü Güçlendirilmiş Type-C to Type-C Kablo (2m)',
      variant: 'Gece Mavisi / 100W PD',
      price: 349,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=300&auto=format&fit=crop&q=80',
    }
  ],
  subtotal: 13447,
  shippingFee: 0, // Ücretsiz Kargo
  discount: 750, // Hoş geldin indirimi
  tax: 2285, // %20 Dahil KDV
  total: 12697,
  shippingAddress: {
    fullName: 'Cavid Nuri',
    email: 'cavidnuri505@gmail.com',
    phone: '+90 (555) 019 48 32',
    addressLine: 'Levent Mah. Cömert Sokak No: 14 Daire: 8',
    district: 'Beşiktaş',
    city: 'İstanbul',
    postalCode: '34330',
  },
  paymentDetails: {
    method: 'credit_card',
    cardHolder: 'CAVID NURI',
    cardNumberMasked: '•••• •••• •••• 4289',
    cardBrand: 'mastercard',
    installment: 3,
    paidAt: '10 Eylül 2026, 15:42:19',
    transactionId: 'TXN-9481726350',
  },
  carrierName: 'Yurtiçi Kargo',
  trackingNumber: 'YK-7839210492',
  trackingUrl: 'https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=YK-7839210492',
  courierInfo: {
    name: 'Mehmet Yılmaz',
    phone: '+90 (532) 410 88 19',
    plate: '34 YK 8421',
    estimatedArrival: '14 Eylül 2026, 11:30 - 14:00',
  },
  deliveryDetails: {
    deliveredAt: '14 Eylül 2026, 13:45',
    recipientName: 'Cavid Nuri (Kendisi)',
    confirmationCode: 'SMS Onaylı: 8492',
    returnEligibleUntil: '28 Eylül 2026 (14 gün kaldı)',
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
}

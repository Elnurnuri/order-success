export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  postalCode: string;
}

export interface PaymentDetails {
  method: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  cardHolder: string;
  cardNumberMasked: string;
  cardBrand: 'mastercard' | 'visa' | 'troy';
  installment: number;
  paidAt: string;
  transactionId: string;
}

export interface CourierInfo {
  name: string;
  phone: string;
  plate: string;
  estimatedArrival: string;
}

export interface DeliveryDetails {
  deliveredAt: string;
  recipientName: string;
  confirmationCode: string;
  returnEligibleUntil: string;
}

export interface OrderData {
  orderNumber: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  status: 'received' | 'preparing' | 'shipped' | 'delivered';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  carrierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  courierInfo?: CourierInfo;
  deliveryDetails?: DeliveryDetails;
}

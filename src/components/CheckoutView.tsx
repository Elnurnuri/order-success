import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  HelpCircle,
  AlertCircle,
  Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';

interface CheckoutViewProps {
  order: OrderData;
  onPaymentComplete: () => void;
  onDirectToSuccess: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  order,
  onPaymentComplete,
  onDirectToSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('5428 9201 4829 4289');
  const [cardHolder, setCardHolder] = useState(order.shippingAddress.fullName.toUpperCase());
  const [expiry, setExpiry] = useState('09/29');
  const [cvv, setCvv] = useState('834');
  const [selectedInstallment, setSelectedInstallment] = useState<number>(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  const formatCardNumberInput = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/[\s\S]{1,4}/g) || [];
    return parts.join(' ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumberInput(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (clean.length > 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setExpiry(clean);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(clean);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStep('256-Bit SSL ile güvenli banka bağlantısı kuruluyor...');

    setTimeout(() => {
      setProcessingStep('3D Secure şifreleme ve bakiye provizyonu doğrulanıyor...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Ödeme onaylandı! Sipariş Başarı Sayfasına yönlendiriliyorsunuz...');
    }, 1800);

    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2500);
  };

  const installments = [
    { count: 1, label: 'Tek Çekim', monthly: order.total, total: order.total },
    { count: 3, label: '3 Taksit (Vade Farksız)', monthly: order.total / 3, total: order.total },
    { count: 6, label: '6 Taksit', monthly: (order.total * 1.05) / 6, total: order.total * 1.05 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Banner Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
              NT
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight">NovaTech Checkout</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Güvenli Ödeme Noktası
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDirectToSuccess}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              title="Doğrudan Sipariş Başarı Sayfasını İncele"
            >
              <span>Doğrudan Başarı Sayfası</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>1. Sepet & Teslimat</span>
          </div>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span className="h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
            <span>2. Ödeme Aşaması</span>
          </div>
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px]">3</span>
            <span>3. Sipariş Başarılı (Hedef)</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <form onSubmit={handleSubmitPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Forms): 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Summary Pill */}
            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Teslimat Adresi & Alıcı Bilgileri</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Doğrulandı
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine}, {order.shippingAddress.district} / {order.shippingAddress.city}</p>
                <p className="text-slate-500">Tel: {order.shippingAddress.phone} • E-posta: {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-slate-900">Kredi veya Banka Kartı ile Ödeme</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>256-bit SSL</span>
                </div>
              </div>

              {/* Realistic Visual Card Mockup */}
              <div className="relative mx-auto max-w-sm h-48 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-5 text-white shadow-lg flex flex-col justify-between overflow-hidden border border-slate-700">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-9 rounded bg-amber-400/80 border border-amber-300/50 flex items-center justify-center">
                      <div className="w-5 h-3 border-t border-b border-amber-600/40" />
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono tracking-widest">TEMASSIZ</span>
                  </div>
                  <div className="flex items-center -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-red-500/90" />
                    <div className="h-6 w-6 rounded-full bg-amber-500/90" />
                  </div>
                </div>

                <div className="z-10">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Kart Numarası</p>
                  <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                </div>

                <div className="flex items-center justify-between z-10 text-xs">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Kart Sahibi</p>
                    <p className="font-semibold uppercase tracking-wider text-slate-200">
                      {cardHolder || 'AD SOYAD'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">SKT</p>
                    <p className="font-mono font-semibold text-slate-200">{expiry || 'AA/YY'}</p>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 pt-2">
                <div>
                  <label htmlFor="card-holder-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    id="card-holder-input"
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="Adınız Soyadınız"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor="card-number-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    id="card-number-input"
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card-expiry-input" className="block text-xs font-semibold text-slate-700 mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      id="card-expiry-input"
                      type="text"
                      required
                      maxLength={5}
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="AA/YY"
                      className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv-input" className="block text-xs font-semibold text-slate-700 mb-1">
                      Güvenlik Kodu (CVV)
                    </label>
                    <input
                      id="card-cvv-input"
                      type="password"
                      required
                      maxLength={3}
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="•••"
                      className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Installment Options */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Taksit Seçeneği
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {installments.map((inst) => (
                      <button
                        type="button"
                        id={`installment-btn-${inst.count}`}
                        key={inst.count}
                        onClick={() => setSelectedInstallment(inst.count)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          selectedInstallment === inst.count
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-1 ring-indigo-600'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-[11px] font-bold">{inst.label}</p>
                        <p className="text-xs font-semibold mt-0.5">{formatCurrency(inst.monthly)}</p>
                        <p className="text-[10px] text-slate-500">/ ay</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Pay Button: 5 Columns */}
          <div className="lg:col-span-5 space-y-6">

            <div className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Sipariş Özeti ({order.items.length} Kalem)
              </h3>

              {/* Items preview */}
              <div className="space-y-3 divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{item.quantity} Adet • {formatCurrency(item.price)}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="border-t border-slate-200/80 pt-4 mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Kupon İndirimi</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span className="text-emerald-600 font-semibold">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>KDV (%20 Dahil)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Ödenecek Tutar</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Submit Pay Button */}
              <div className="mt-6">
                <button
                  id="complete-payment-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 px-4 text-xs font-bold text-white shadow-md hover:shadow-lg transition active:scale-98 disabled:opacity-75 disabled:pointer-events-none"
                >
                  <Lock className="h-4 w-4" />
                  <span>Ödemeyi Tamamla ve Siparişi Onayla ({formatCurrency(order.total)})</span>
                </button>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>3D Secure Güvenli Ödeme Protokolü</span>
              </div>
            </div>

            {/* Trust Badges Area */}
            <div id="checkout-trust-badges" className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">
                Güvenli Alışveriş Standartları
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-emerald-950">Siparişiniz Güvende</p>
                  <p className="text-[9px] text-emerald-700 font-medium">14 Gün İade</p>
                </div>
                <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-2">
                  <Lock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-blue-950">SSL Korumalı</p>
                  <p className="text-[9px] text-blue-700 font-medium">256-Bit Şifreli</p>
                </div>
                <div className="rounded-xl bg-purple-50/70 border border-purple-100 p-2">
                  <Headphones className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-purple-950">7/24 Destek</p>
                  <p className="text-[9px] text-purple-700 font-medium">Müşteri Hattı</p>
                </div>
              </div>
            </div>

            {/* Reassurance notes */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 space-y-2">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                <p>
                  Siparişiniz <strong className="text-slate-700">{order.estimatedDeliveryDate}</strong> tarihleri arasında kargoya verilecektir.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-700 shrink-0 mt-0.5" />
                <p>
                  Ödeme tamamlandığında otomatik olarak <strong className="text-slate-700">Order-Success</strong> sayfasına yönlendirileceksiniz.
                </p>
              </div>
            </div>

          </div>

        </form>
      </div>

      {/* 3D Secure / Payment Processing Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl space-y-4"
            >
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <ShieldCheck className="absolute h-7 w-7 text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-900">
                  Ödemeniz İşleniyor
                </h3>
                <p className="text-xs text-slate-600 transition-all duration-300">
                  {processingStep}
                </p>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-emerald-600 animate-pulse w-full rounded-full" />
              </div>

              <p className="text-[11px] text-slate-400 pt-2">
                Lütfen tarayıcınızı kapatmayınız veya sayfayı yenilemeyiniz.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

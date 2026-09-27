import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Star,
  RefreshCw,
  Printer,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Calendar,
  CalendarPlus,
  CalendarCheck,
  ChevronDown,
  Download,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  FileCheck2,
  Share2,
  RotateCcw,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';
import {
  createGoogleCalendarUrl,
  createOutlookCalendarUrl,
  downloadIcsFile,
  parseTurkishDate
} from '../utils/calendar';

const GoogleCalendarIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#FFFFFF" />
    <path fill="#4285F4" d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3 4.9 3 6v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
    <path fill="#FFFFFF" d="M5 9h14v11H5z" />
    <text x="12" y="17" fill="#1A73E8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
  </svg>
);

const OutlookCalendarIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0078D4" />
    <path d="M7 3v2M17 3v2M4 8h16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="15" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="12" cy="17" r="1.5" fill="#FFFFFF" />
  </svg>
);

interface DeliveredViewProps {
  order: OrderData;
  onViewInvoice: () => void;
  onStartNewOrder: () => void;
  onBackToOrderSummary: () => void;
}

export const DeliveredView: React.FC<DeliveredViewProps> = ({
  order,
  onViewInvoice,
  onStartNewOrder,
  onBackToOrderSummary,
}) => {
  const [ratings, setRatings] = useState<{ [productId: string]: number }>({
    'prod-1': 5,
    'prod-2': 5,
    'prod-3': 4,
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [comment, setComment] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnRequested, setReturnRequested] = useState(false);

  // Calendar feature states
  const [calendarEventType, setCalendarEventType] = useState<'order_date' | 'delivered_date' | 'return_deadline'>('order_date');
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [calendarToast, setCalendarToast] = useState<string | null>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(e.target as Node)) {
        setShowCalendarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showToast = (message: string) => {
    setCalendarToast(message);
    setTimeout(() => setCalendarToast(null), 3500);
  };

  const handleStarClick = (productId: string, star: number) => {
    setRatings((prev) => ({ ...prev, [productId]: star }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
  };

  const handleConfirmReturn = () => {
    setReturnRequested(true);
    setShowReturnModal(false);
  };

  return (
    <div className="space-y-2.5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Celebration Banner: 4. Aşama Teslim Edildi */}
      <div className="rounded-lg sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 p-3 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-emerald-50 border border-white/20 mb-1.5 sm:mb-2">
              <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-300" />
              Aşama 4: Teslimat Tamamlandı
            </div>
            <h1 className="text-base sm:text-2xl font-bold tracking-tight">
              Siparişiniz Teslim Edildi!
            </h1>
            <p className="text-[11px] sm:text-sm text-emerald-100 mt-0.5 sm:mt-1">
              Paketiniz <strong className="text-white">{order.deliveryDetails?.deliveredAt}</strong> tarihinde alıcı <strong className="text-white">{order.deliveryDetails?.recipientName}</strong> kişisine teslim edilmiştir.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Takvime Ekle Dropdown Menüsü */}
            <div className="relative" ref={calendarDropdownRef}>
              <button
                id="header-calendar-menu-btn"
                type="button"
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white border border-emerald-400/40 px-3 py-1.5 sm:px-3.5 sm:py-2.5 text-[11px] sm:text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                title="Sipariş tarihini Google veya Outlook takviminize ekleyin"
              >
                <CalendarPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-300" />
                <span>Takvime Ekle</span>
                <ChevronDown className={`h-3 w-3 text-emerald-300 transition-transform ${showCalendarMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showCalendarMenu && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-white p-2.5 text-slate-800 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      Takvim Etkinliği:
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {calendarEventType === 'order_date'
                        ? 'Sipariş Tarihi'
                        : calendarEventType === 'delivered_date'
                        ? 'Teslimat Tarihi'
                        : 'İade Bitişi'}
                    </span>
                  </div>

                  <div className="space-y-1 mb-2">
                    <label className="text-[10px] text-slate-500 font-medium block">Etkinlik Tarihi Seç:</label>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setCalendarEventType('order_date')}
                        className={`px-2 py-1 rounded-md text-left transition font-semibold flex items-center justify-between cursor-pointer ${
                          calendarEventType === 'order_date'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Sipariş Tarihi</span>
                        {calendarEventType === 'order_date' && <Check className="h-3 w-3 text-blue-600" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarEventType('delivered_date')}
                        className={`px-2 py-1 rounded-md text-left transition font-semibold flex items-center justify-between cursor-pointer ${
                          calendarEventType === 'delivered_date'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Teslim Tarihi</span>
                        {calendarEventType === 'delivered_date' && <Check className="h-3 w-3 text-blue-600" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    {/* Google Takvim */}
                    <a
                      id="dropdown-google-calendar-link"
                      href={createGoogleCalendarUrl(order, calendarEventType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        showToast('Google Takvim açıldı. Sipariş tarihini kaydedebilirsiniz.');
                        setShowCalendarMenu(false);
                      }}
                      className="flex items-center justify-between gap-2 w-full px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition text-[11px] font-bold text-slate-800 hover:text-blue-900 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <GoogleCalendarIcon className="h-4 w-4 shrink-0" />
                        <span>Google Takvim'e Ekle</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600" />
                    </a>

                    {/* Outlook Takvim */}
                    <a
                      id="dropdown-outlook-calendar-link"
                      href={createOutlookCalendarUrl(order, calendarEventType)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        showToast('Outlook Takvim açıldı. Sipariş tarihini kaydedebilirsiniz.');
                        setShowCalendarMenu(false);
                      }}
                      className="flex items-center justify-between gap-2 w-full px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-sky-50/80 border border-slate-200 hover:border-sky-300 transition text-[11px] font-bold text-slate-800 hover:text-sky-900 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <OutlookCalendarIcon className="h-4 w-4 shrink-0" />
                        <span>Outlook Takvim'e Ekle</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-sky-600" />
                    </a>

                    {/* iCal / .ics */}
                    <button
                      type="button"
                      onClick={() => {
                        downloadIcsFile(order, calendarEventType);
                        showToast('Takvim dosyası (.ics) indirildi.');
                        setShowCalendarMenu(false);
                      }}
                      className="flex items-center justify-between gap-2 w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition text-[10px] font-medium text-slate-600 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Download className="h-3 w-3 text-slate-500" />
                        <span>Apple / iCal Dosyası (.ics)</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="delivered-view-invoice-btn"
              onClick={onViewInvoice}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-white px-3 py-1.5 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-emerald-950 shadow-md hover:bg-emerald-50 transition active:scale-95 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-700" />
              <span>E-Faturayı İndir</span>
            </button>
          </div>
        </div>

        {/* Proof of delivery bar */}
        <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-emerald-200 text-[10px] sm:text-xs">Teslimat Kodu:</span>
            <span className="font-semibold bg-white/15 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[11px] sm:text-xs">
              {order.deliveryDetails?.confirmationCode}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-emerald-100 text-[9px] sm:text-[11px]">
            <span>Kargo: <strong className="text-white">{order.carrierName} ({order.trackingNumber})</strong></span>
            <span>İade: <strong className="text-white">{order.deliveryDetails?.returnEligibleUntil}</strong></span>
          </div>
        </div>
      </div>

      {/* Return confirmation alert if initiated */}
      {returnRequested && (
        <div className="rounded-lg sm:rounded-2xl bg-amber-50 border border-amber-200 p-2.5 sm:p-4 text-[11px] sm:text-xs text-amber-900 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-[11px] sm:text-xs">Kolay İade Talebi Alındı (#RET-78912)</p>
              <p className="text-amber-700 text-[9px] sm:text-xs mt-0.5">
                Yurtiçi Kargo şubesine bu kod ile paketi teslim edebilirsiniz.
              </p>
            </div>
          </div>
          <span className="text-[9px] sm:text-[11px] font-semibold bg-amber-200/70 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shrink-0">Hazır</span>
        </div>
      )}

      {/* Grid: Rating & Reviews + Delivery Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-6">

        {/* Left 2 Columns: Product Rating & Satisfaction */}
        <div className="lg:col-span-2 space-y-2.5 sm:space-y-6">

          {/* Product Reviews Box */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 mb-2 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-400" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Ürün ve Teslimat Değerlendirmesi</h3>
              </div>
              <span className="text-[9px] sm:text-xs text-slate-500">Puan Verin</span>
            </div>

            {reviewSubmitted ? (
              <div className="rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 sm:p-5 text-center space-y-1.5 sm:space-y-2">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <ThumbsUp className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950">Değerlendirmeniz İçin Teşekkürler!</h4>
                <p className="text-[10px] sm:text-xs text-emerald-700 max-w-md mx-auto">
                  Puanınız ve yorumunuz kaydedildi. Bir sonraki siparişinizde geçerli 50 TL indirim kuponu tanımlandı.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-2 sm:space-y-4">
                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2 sm:py-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="h-9 w-9 sm:h-12 sm:w-12 rounded-md sm:rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-[9px] sm:text-[11px] text-slate-400">{item.variant}</p>
                        </div>
                      </div>

                      {/* Interactive Stars */}
                      <div className="flex items-center gap-0.5 sm:gap-1 self-end sm:self-auto">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleStarClick(item.id, star)}
                            className="p-0.5 sm:p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
                            title={`${star} Yıldız`}
                          >
                            <Star
                              className={`h-3.5 w-3.5 sm:h-5 sm:w-5 ${
                                (ratings[item.id] || 0) >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment area */}
                <div className="pt-1">
                  <label htmlFor="review-comment-input" className="block text-[10px] sm:text-xs font-semibold text-slate-700 mb-1">
                    Yorumunuz (Opsiyonel)
                  </label>
                  <textarea
                    id="review-comment-input"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ürün kalitesi ve teslimat hızı nasıldı?"
                    className="w-full rounded-lg sm:rounded-xl border border-slate-300 p-2 sm:p-3 text-[11px] sm:text-xs text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    id="submit-review-btn"
                    type="submit"
                    className="rounded-lg sm:rounded-xl bg-emerald-600 px-3 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition cursor-pointer"
                  >
                    Değerlendirmeyi Gönder
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Delivery receipt summary */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2 sm:space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-1.5 sm:pb-2.5">
              <FileCheck2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>Resmi Teslimat Kaydı</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs text-slate-600">
              <div className="bg-slate-50 p-2 sm:p-3 rounded-md sm:rounded-xl">
                <span className="text-slate-400 text-[8px] sm:text-[10px] uppercase font-bold">Adres</span>
                <p className="font-semibold text-slate-900 text-[10px] sm:text-xs mt-0.5">{order.shippingAddress.district} / {order.shippingAddress.city}</p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 truncate">{order.shippingAddress.addressLine}</p>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3 rounded-md sm:rounded-xl">
                <span className="text-slate-400 text-[8px] sm:text-[10px] uppercase font-bold">Teslim Alan</span>
                <p className="font-semibold text-slate-900 text-[10px] sm:text-xs mt-0.5">{order.deliveryDetails?.recipientName}</p>
                <p className="text-[9px] sm:text-[11px] text-slate-500">Tel: {order.shippingAddress.phone}</p>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3 rounded-md sm:rounded-xl">
                <span className="text-slate-400 text-[8px] sm:text-[10px] uppercase font-bold">Kargo & İrsaliye</span>
                <p className="font-semibold text-slate-900 text-[10px] sm:text-xs mt-0.5">{order.carrierName}</p>
                <p className="text-[9px] sm:text-[11px] text-slate-500 font-mono">Takip: {order.trackingNumber}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Calendar, Return policy & Quick Actions */}
        <div className="space-y-2.5 sm:space-y-6">

          {/* Google & Outlook Takvime Ekle Kartı */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                <span>Takvim Hatırlatıcısı</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                <CalendarCheck className="h-3 w-3 text-blue-600" />
                Google & Outlook
              </span>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug">
              Sipariş veya teslimat tarihinizi takviminize kaydedin, garanti ve iade süreçlerini kolayca takip edin:
            </p>

            {/* Tarih Tipi Seçimi */}
            <div className="space-y-1">
              <div className="bg-slate-100/90 p-1 rounded-lg flex items-center gap-1 text-[10px]">
                <button
                  type="button"
                  id="tab-order-date"
                  onClick={() => setCalendarEventType('order_date')}
                  className={`flex-1 py-1 px-1.5 rounded-md font-semibold text-center transition cursor-pointer ${
                    calendarEventType === 'order_date'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sipariş Tarihi
                </button>
                <button
                  type="button"
                  id="tab-delivered-date"
                  onClick={() => setCalendarEventType('delivered_date')}
                  className={`flex-1 py-1 px-1.5 rounded-md font-semibold text-center transition cursor-pointer ${
                    calendarEventType === 'delivered_date'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Teslim Tarihi
                </button>
                <button
                  type="button"
                  id="tab-return-deadline"
                  onClick={() => setCalendarEventType('return_deadline')}
                  className={`flex-1 py-1 px-1.5 rounded-md font-semibold text-center transition cursor-pointer ${
                    calendarEventType === 'return_deadline'
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  İade Süresi
                </button>
              </div>

              {/* Seçili Tarih Bilgi Kutusu */}
              <div className="rounded-lg bg-blue-50/60 border border-blue-100/80 p-2 flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="text-slate-600">Etkinlik Tarihi:</span>
                <span className="font-bold text-blue-900 font-mono">
                  {calendarEventType === 'order_date'
                    ? order.createdAt
                    : calendarEventType === 'delivered_date'
                    ? order.deliveryDetails?.deliveredAt
                    : order.deliveryDetails?.returnEligibleUntil}
                </span>
              </div>
            </div>

            {/* Butonlar: Google & Outlook */}
            <div className="grid grid-cols-1 gap-2 pt-0.5">
              {/* Google Takvim Butonu */}
              <a
                id="btn-add-to-google-calendar"
                href={createGoogleCalendarUrl(order, calendarEventType)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast('Google Takvim açıldı. Sipariş tarihini kaydedebilirsiniz.')}
                className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-blue-400 py-2 px-3 text-[11px] sm:text-xs font-bold text-slate-800 shadow-2xs transition active:scale-98 group cursor-pointer"
              >
                <GoogleCalendarIcon className="h-4 w-4 shrink-0" />
                <span>Google Takvim'e Ekle</span>
                <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-600 ml-auto" />
              </a>

              {/* Outlook Takvim Butonu */}
              <a
                id="btn-add-to-outlook-calendar"
                href={createOutlookCalendarUrl(order, calendarEventType)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => showToast('Outlook Takvim açıldı. Sipariş tarihini kaydedebilirsiniz.')}
                className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-[#0078D4] hover:bg-[#006cc0] text-white py-2 px-3 text-[11px] sm:text-xs font-bold shadow-2xs transition active:scale-98 group cursor-pointer"
              >
                <OutlookCalendarIcon className="h-4 w-4 shrink-0" />
                <span>Outlook Takvim'e Ekle</span>
                <ExternalLink className="h-3 w-3 text-blue-200 group-hover:text-white ml-auto" />
              </a>

              {/* Apple / iCal .ics İndirme */}
              <button
                type="button"
                id="btn-download-ics-calendar"
                onClick={() => {
                  downloadIcsFile(order, calendarEventType);
                  showToast('iCalendar (.ics) dosyası indirildi.');
                }}
                className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 hover:text-slate-800 py-0.5 transition cursor-pointer"
              >
                <Download className="h-3 w-3 text-slate-400" />
                <span>Apple / Diğer Takvimler İçin .ics İndir</span>
              </button>
            </div>
          </div>

          {/* 14 Day Return Box */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 border border-slate-200/90 shadow-2xs space-y-2 sm:space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
              <span>Kolay İade & Değişim Hakkı</span>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-600 leading-snug">
              Ürünlerinizden memnun kalmazsanız <strong className="text-slate-800">{order.deliveryDetails?.returnEligibleUntil}</strong> tarihine kadar Yurtiçi Kargo ile ücretsiz iade edebilirsiniz.
            </p>

            <button
              id="open-return-modal-btn"
              onClick={() => setShowReturnModal(true)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500" />
              <span>Kolay İade Talebi Başlat</span>
            </button>
          </div>

          {/* Re-order / New Order */}
          <div className="rounded-lg sm:rounded-2xl bg-slate-900 text-white p-2.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-200">Tekrar Satın Al</h4>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 leading-snug">
              Aynı ürünleri sepetinize ekleyebilir veya yeni bir alışveriş akışını baştan simüle edebilirsiniz.
            </p>
            <button
              id="start-new-order-btn"
              onClick={onStartNewOrder}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-emerald-500 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-950 hover:bg-emerald-400 transition cursor-pointer"
            >
              <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Yeni Sipariş / Baştan Başlat</span>
            </button>
          </div>

          {/* Quick back */}
          <div className="text-center pt-1">
            <button
              onClick={onBackToOrderSummary}
              className="text-[10px] sm:text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline transition cursor-pointer"
            >
              ← Genel Sipariş Detaylarına Dön
            </button>
          </div>

        </div>

      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Kolay İade Talebi Oluştur</h3>
            <p className="text-xs text-slate-600">
              İade etmek istediğiniz ürünü seçin. Yurtiçi Kargo iade kodunuz anında üretilecektir.
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {order.items.map((item) => (
                <label key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                  <span className="font-medium text-slate-800 truncate">{item.name}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReturnModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Vazgeç
              </button>
              <button
                onClick={handleConfirmReturn}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                İade Kodunu Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Action Toast Notification */}
      {calendarToast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-slate-900/95 text-white px-3.5 py-2.5 text-xs font-semibold shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{calendarToast}</span>
        </div>
      )}
    </div>
  );
};

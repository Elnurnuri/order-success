import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Truck,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Share2,
  ArrowRight,
  ExternalLink,
  Clock,
  Sparkles,
  Lock,
  Headphones
} from 'lucide-react';
import { motion } from 'motion/react';
import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';
import { InvoiceModal } from './InvoiceModal';
import { TrackingModal } from './TrackingModal';
import { ShippedView } from './ShippedView';
import { DeliveredView } from './DeliveredView';
import { CircleStepper } from './CircleStepper';
import { getCarrierTrackingUrl } from '../utils/carrier';

interface OrderSuccessProps {
  order: OrderData;
  onContinueShopping: () => void;
  activeStepView?: 'overview' | 'shipped' | 'delivered';
  onStepChange?: (step: 'overview' | 'shipped' | 'delivered') => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  order,
  onContinueShopping,
  activeStepView = 'overview',
  onStepChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [stepView, setStepView] = useState<'overview' | 'shipped' | 'delivered'>(activeStepView);

  // Sync with prop changes if provided
  React.useEffect(() => {
    if (activeStepView) {
      setStepView(activeStepView);
    }
  }, [activeStepView]);

  const handleStepClick = (step: 'overview' | 'shipped' | 'delivered') => {
    setStepView(step);
    if (onStepChange) {
      onStepChange(step);
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Sipariş No: #${order.orderNumber} - ${order.carrierName} ile tahmini teslimat: ${order.estimatedDeliveryDate}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Toast notification */}
      {shareToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Sipariş bilgileri panoya kopyalandı!</span>
        </div>
      )}

      {/* Hero Banner with Green Checkmark Animation - Ultra-compact & aligned on mobile */}
      <div className="bg-white border-b border-slate-200/80 pt-4 pb-4 sm:pt-10 sm:pb-12 shadow-xs">
        <div className="max-w-4xl mx-auto px-2.5 sm:px-6 text-center">
          
          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200 }}
            className="mx-auto relative flex h-11 w-11 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-4 sm:ring-8 ring-emerald-50/70 shadow-2xs sm:shadow-sm"
          >
            <CheckCircle2 className="h-6 w-6 sm:h-11 sm:w-11 text-emerald-600 stroke-[2.2]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -top-0.5 -right-0.5 bg-amber-400 text-amber-950 p-0.5 sm:p-1 rounded-full shadow-xs"
            >
              <Sparkles className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-2.5 sm:mt-5 space-y-1.5 sm:space-y-2"
          >
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-ping" />
                Ödeme Başarıyla Tamamlandı
              </span>
            </div>
            <h1 className="text-base sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Siparişiniz İçin Teşekkür Ederiz!
            </h1>
            <p className="max-w-xl mx-auto text-[11px] sm:text-sm text-slate-600 leading-relaxed px-1">
              Siparişiniz sistemimize ulaştı. Satın alma özeti ve e-arşiv faturanız{' '}
              <span className="inline-block font-semibold text-slate-900 bg-slate-100 border border-slate-200/90 px-1.5 py-0.5 rounded text-[10px] sm:text-xs break-all sm:break-normal">
                {order.shippingAddress.email}
              </span>{' '}
              adresinize gönderildi.
            </p>
          </motion.div>

          {/* Reference pill */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-2.5 sm:mt-5 inline-flex items-center justify-center gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-xl bg-slate-100/90 border border-slate-200/90 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs shadow-2xs max-w-full"
          >
            <span className="text-slate-500 font-medium whitespace-nowrap">Sipariş No:</span>
            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm tracking-wider whitespace-nowrap">
              #{order.orderNumber}
            </span>
            <button
              id="copy-order-btn"
              onClick={handleCopyOrderNumber}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 sm:px-2.5 sm:py-1 font-medium text-slate-700 shadow-2xs hover:bg-slate-50 border border-slate-200 transition active:scale-95 cursor-pointer whitespace-nowrap"
              title="Sipariş numarasını kopyala"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 stroke-[2.5]" />
                  <span className="text-[9px] sm:text-[11px] text-emerald-700 font-bold">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500" />
                  <span className="text-[9px] sm:text-[11px] font-semibold">Kopyala</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Trust Badges Info Area - Perfectly aligned 3-column responsive grid */}
          <motion.div
            id="trust-badges-info-area"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-3 sm:mt-6 grid grid-cols-3 gap-1.5 sm:gap-3 max-w-xl mx-auto w-full"
          >
            {/* Badge 1: Siparişiniz Güvende */}
            <div
              id="trust-badge-safe-order"
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5 rounded-lg sm:rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-1.5 sm:px-3 sm:py-2.5 shadow-2xs transition hover:bg-emerald-50"
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-emerald-600 text-white shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-bold text-emerald-950 leading-tight">
                  <span className="sm:hidden">Sipariş Güvende</span>
                  <span className="hidden sm:inline">Siparişiniz Güvende</span>
                </p>
                <p className="text-[8px] sm:text-[10px] text-emerald-700 font-medium leading-tight mt-0.5">
                  <span className="sm:hidden">14 Gün İade</span>
                  <span className="hidden sm:inline">14 gün iade & koruma</span>
                </p>
              </div>
            </div>

            {/* Badge 2: SSL Korumalı */}
            <div
              id="trust-badge-ssl"
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5 rounded-lg sm:rounded-xl bg-blue-50/70 border border-blue-200/80 p-1.5 sm:px-3 sm:py-2.5 shadow-2xs transition hover:bg-blue-50"
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-blue-600 text-white shadow-xs">
                <Lock className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-bold text-blue-950 leading-tight">
                  SSL Korumalı
                </p>
                <p className="text-[8px] sm:text-[10px] text-blue-700 font-medium leading-tight mt-0.5">
                  <span className="sm:hidden">256-Bit Şifre</span>
                  <span className="hidden sm:inline">256-bit şifreli ödeme</span>
                </p>
              </div>
            </div>

            {/* Badge 3: 7/24 Destek */}
            <div
              id="trust-badge-support"
              className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-1 sm:gap-2.5 rounded-lg sm:rounded-xl bg-purple-50/70 border border-purple-200/80 p-1.5 sm:px-3 sm:py-2.5 shadow-2xs transition hover:bg-purple-50"
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md sm:rounded-lg bg-purple-600 text-white shadow-xs">
                <Headphones className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-[10px] sm:text-xs font-bold text-purple-950 leading-tight">
                  7/24 Destek
                </p>
                <p className="text-[8px] sm:text-[10px] text-purple-700 font-medium leading-tight mt-0.5">
                  <span className="sm:hidden">Canlı Yardım</span>
                  <span className="hidden sm:inline">Canlı yardım hattı</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-2 sm:px-6 mt-2.5 sm:mt-8 space-y-2.5 sm:space-y-6">

        {/* Delivery Highlights & Timeline Stepper */}
        <div id="order-stepper-container" className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-7 shadow-xs border border-slate-200/90 relative overflow-hidden">
          {/* Top Header with ETA and Live Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-100 pb-2.5 sm:pb-5 mb-2 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3.5">
              <div className="relative flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 border border-emerald-200/80 text-emerald-700 shadow-2xs">
                <Truck className="h-4 w-4 sm:h-6 sm:w-6" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="text-[9px] sm:text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Tahmini Teslimat</p>
                  <span className="inline-flex items-center rounded bg-slate-100 px-1 py-0.2 text-[8px] sm:text-[10px] font-semibold text-slate-600">
                    {order.carrierName}
                  </span>
                </div>
                <p className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">{order.estimatedDeliveryDate}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">Takip Kodu: <span className="font-mono font-medium text-slate-700">{order.trackingNumber}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Süreç İlerlemesi</span>
                <span className={`text-xs font-bold ${
                  stepView === 'delivered' ? 'text-emerald-700' : stepView === 'shipped' ? 'text-blue-700' : 'text-amber-700'
                }`}>
                  {stepView === 'delivered' ? '4/4 Teslim Edildi (%100)' : stepView === 'shipped' ? '3/4 Dağıtımda (%75)' : '2/4 Hazırlanıyor (%45)'}
                </span>
              </div>
              {stepView === 'shipped' && (
                <a
                  id="header-carrier-direct-btn"
                  href={getCarrierTrackingUrl(order.carrierName, order.trackingNumber, order.trackingUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 px-2 py-1.5 sm:px-3 sm:py-2.5 text-[10px] sm:text-xs font-bold text-slate-950 shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                  title={`${order.carrierName} resmi takip sayfasını aç`}
                >
                  <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-950 shrink-0" />
                  <span className="whitespace-nowrap">
                    <span className="sm:hidden">{order.carrierName.replace(/\s+Kargo$/i, '')} Takip</span>
                    <span className="hidden sm:inline">{order.carrierName} Takip</span>
                  </span>
                </a>
              )}
              <button
                id="track-cargo-btn"
                onClick={() => setIsTrackingOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-emerald-600 px-2 py-1.5 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Truck className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="whitespace-nowrap">Kargo Takip</span>
              </button>
              <button
                id="print-invoice-btn"
                onClick={() => setIsInvoiceOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-2 py-1.5 sm:px-3.5 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Printer className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500 shrink-0" />
                <span className="whitespace-nowrap">E-Fatura</span>
              </button>
            </div>
          </div>

          {/* Modern Circle-Based Stepper (Line-free, distinct colors: Green for Completed, Blue for Active, Gray for Passive) */}
          <CircleStepper
            order={order}
            stepView={stepView}
            onStepClick={handleStepClick}
          />

          {/* Contextual Status Bar & Step Navigation Tabs */}
          <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
              <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                {stepView === 'overview' && (
                  <>Durum: <strong className="text-slate-900">Sipariş depoda hazırlanıyor.</strong></>
                )}
                {stepView === 'shipped' && (
                  <>Durum: <strong className="text-slate-900">Kargonuz dağıtım aracında.</strong></>
                )}
                {stepView === 'delivered' && (
                  <>Durum: <strong className="text-slate-900">Siparişiniz teslim edildi.</strong></>
                )}
              </span>
            </div>

            {/* Clean Segmented Pill Switcher */}
            <div className="grid grid-cols-3 sm:inline-flex w-full sm:w-auto p-0.5 sm:p-1 bg-slate-100 rounded-md sm:rounded-xl gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-center">
              <button
                type="button"
                id="view-tab-overview"
                onClick={() => handleStepClick('overview')}
                className={`py-1 sm:py-1.5 px-1.5 sm:px-3 rounded sm:rounded-lg font-semibold transition cursor-pointer truncate ${
                  stepView === 'overview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1-2. Hazırlık
              </button>
              <button
                type="button"
                id="view-tab-shipped"
                onClick={() => handleStepClick('shipped')}
                className={`py-1 sm:py-1.5 px-1.5 sm:px-3 rounded sm:rounded-lg font-semibold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                  stepView === 'shipped'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="truncate">3. Kargo</span>
              </button>
              <button
                type="button"
                id="view-tab-delivered"
                onClick={() => handleStepClick('delivered')}
                className={`py-1 sm:py-1.5 px-1.5 sm:px-3 rounded sm:rounded-lg font-semibold transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                  stepView === 'delivered'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="truncate">4. Teslim</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Rendering with Smooth Animated Transitions */}
        <motion.div
          key={stepView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {stepView === 'shipped' ? (
            <ShippedView
              order={order}
              onViewInvoice={() => setIsInvoiceOpen(true)}
              onSimulateDelivery={() => handleStepClick('delivered')}
              onBackToOrderSummary={() => handleStepClick('overview')}
            />
          ) : stepView === 'delivered' ? (
            <DeliveredView
              order={order}
              onViewInvoice={() => setIsInvoiceOpen(true)}
              onStartNewOrder={onContinueShopping}
              onBackToOrderSummary={() => handleStepClick('overview')}
            />
          ) : (
            /* 2-Column Details Layout (Default Step 1 & 2 Overview) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-6">

          {/* Left 2 Columns: Items & Address Info */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-6">

            {/* Ordered Products Card */}
            <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-6 shadow-xs border border-slate-200/80">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 mb-2 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                    Satın Alınan Ürünler ({order.items.reduce((a, b) => a + b.quantity, 0)} Ürün)
                  </h2>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-500">
                  Kargo: <span className="text-emerald-600 font-semibold">{order.carrierName}</span>
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2 sm:py-3.5 flex items-center gap-2 sm:gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 sm:h-18 sm:w-18 rounded-md sm:rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                        {item.variant}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1.5 text-[10px] sm:text-xs text-slate-600">
                        <span className="inline-flex items-center rounded bg-slate-100 px-1 sm:px-1.5 py-0.2 text-[9px] sm:text-[11px] font-medium text-slate-700">
                          {item.quantity} Adet
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Delivery Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              
              {/* Shipping Address */}
              <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-900 mb-1.5 sm:mb-3">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  <span>Teslimat Adresi</span>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600 space-y-0.5 sm:space-y-1">
                  <p className="font-semibold text-slate-900 text-[11px] sm:text-xs">{order.shippingAddress.fullName}</p>
                  <p className="truncate">{order.shippingAddress.addressLine}</p>
                  <p>{order.shippingAddress.district} / {order.shippingAddress.city}</p>
                  <div className="pt-1 sm:pt-2 flex items-center gap-1 text-[9px] sm:text-[11px] text-slate-500">
                    <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-900 mb-1.5 sm:mb-3">
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600" />
                  <span>Ödeme Bilgileri</span>
                </div>
                <div className="text-[10px] sm:text-xs text-slate-600 space-y-0.5 sm:space-y-1">
                  <p className="font-semibold text-slate-900 text-[11px] sm:text-xs">Kredi / Banka Kartı</p>
                  <p className="font-mono text-slate-700">{order.paymentDetails.cardNumberMasked}</p>
                  <p className="text-[9px] sm:text-[11px] text-slate-500">
                    Kart: <span className="text-slate-700 font-medium">{order.paymentDetails.cardHolder}</span>
                  </p>
                  <p className="text-[9px] sm:text-[11px] text-slate-500">
                    Plan: <span className="text-emerald-700 font-semibold">{order.paymentDetails.installment} Taksit</span>
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Financial Summary & Quick Action Card */}
          <div className="space-y-2.5 sm:space-y-6">

            {/* Price Breakdown */}
            <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-6 shadow-xs border border-slate-200/80">
              <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 sm:mb-4 border-b border-slate-100 pb-1.5 sm:pb-2">
                Ödeme Özeti
              </h3>
              
              <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ürünler Toplamı</span>
                  <span className="font-medium text-slate-900">{formatCurrency(order.subtotal)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1">
                      Kupon (HOSGELDIN)
                    </span>
                    <span className="font-semibold">-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Kargo Ücreti</span>
                  <span className="text-emerald-600 font-semibold">Ücretsiz</span>
                </div>

                <div className="flex justify-between text-slate-400 text-[9px] sm:text-[11px]">
                  <span>KDV (%20 Dahil)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>

                <div className="border-t border-slate-200/80 pt-2 sm:pt-3 mt-2 sm:mt-3 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">Toplam Ödenen</span>
                    <p className="text-[9px] sm:text-[11px] text-emerald-600 font-medium">Onaylandı</p>
                  </div>
                  <span className="text-sm sm:text-lg font-extrabold text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons inside Card */}
              <div className="mt-3 sm:mt-6 space-y-1.5 sm:space-y-2.5">
                <button
                  id="action-view-invoice"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-slate-900 py-1.5 sm:py-2.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition cursor-pointer"
                >
                  <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Resmi E-Faturayı İndir</span>
                </button>

                <button
                  id="action-tracking"
                  onClick={() => setIsTrackingOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white py-1.5 sm:py-2.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                >
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
                  <span>Kargo Detayları</span>
                </button>

                <button
                  id="action-share"
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white py-1.5 px-2.5 sm:px-4 text-[10px] sm:text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Share2 className="h-3 w-3 text-slate-400" />
                  <span>Siparişi Paylaş</span>
                </button>
              </div>

              {/* Restart or test again */}
              <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-100 text-center">
                <button
                  id="action-continue-shopping"
                  onClick={onContinueShopping}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition cursor-pointer"
                >
                  <RefreshCw className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  <span>Yeni Sipariş / Akışı Yeniden Başlat</span>
                </button>
              </div>
            </div>

            {/* Guarantees & Support */}
            <div id="sidebar-trust-box" className="rounded-lg sm:rounded-2xl bg-white border border-slate-200/80 p-2.5 sm:p-5 shadow-xs space-y-2 sm:space-y-3.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px] sm:text-xs border-b border-slate-100 pb-1.5 sm:pb-2.5">
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                <span>Güvenlik & Güvence</span>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs">
                <div className="flex items-start gap-1.5 sm:gap-2.5">
                  <div className="flex h-4 w-4 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-600 mt-0.5">
                    <ShieldCheck className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-[10px] sm:text-[11px]">Siparişiniz Güvende</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">14 gün koşulsuz iade garantisi</p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5">
                  <div className="flex h-4 w-4 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600 mt-0.5">
                    <Lock className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-[10px] sm:text-[11px]">SSL Korumalı</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">256-bit SSL şifreleme güvencesi</p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 sm:gap-2.5">
                  <div className="flex h-4 w-4 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded bg-purple-50 text-purple-600 mt-0.5">
                    <Headphones className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-[10px] sm:text-[11px]">7/24 Destek</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">0850 300 00 00 müşteri hattı</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
        )}
        </motion.div>

      </div>

      {/* Modals */}
      <InvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      <TrackingModal
        order={order}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
};

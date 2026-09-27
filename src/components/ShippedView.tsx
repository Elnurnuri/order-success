import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Package,
  Copy,
  Check,
  ExternalLink,
  Navigation,
  UserCheck,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';
import { getCarrierTrackingUrl, getCarrierConfig } from '../utils/carrier';

interface ShippedViewProps {
  order: OrderData;
  onViewInvoice: () => void;
  onSimulateDelivery: () => void;
  onBackToOrderSummary: () => void;
}

export const ShippedView: React.FC<ShippedViewProps> = ({
  order,
  onViewInvoice,
  onSimulateDelivery,
  onBackToOrderSummary,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState<string>('address');
  const [preferenceSuccess, setPreferenceSuccess] = useState<string | null>(null);
  const [trackingToast, setTrackingToast] = useState<string | null>(null);

  const trackingUrl = getCarrierTrackingUrl(order.carrierName, order.trackingNumber, order.trackingUrl);
  const carrierConfig = getCarrierConfig(order.carrierName);

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showTrackingToast = () => {
    setTrackingToast(`${order.carrierName} resmi takip sayfasına yönlendiriliyorsunuz...`);
    setTimeout(() => setTrackingToast(null), 3000);
  };

  const handleSavePreference = (pref: string) => {
    setSelectedPreference(pref);
    setPreferenceSuccess('Teslimat tercihiniz kuryeye iletildi.');
    setTimeout(() => setPreferenceSuccess(null), 3000);
  };

  const checkpoints = [
    {
      title: 'Kurye Dağıtıma Çıktı',
      desc: 'Kargonuz dağıtım aracına yüklendi ve gün içinde teslim edilecek.',
      time: 'Bugün • 09:15',
      location: `${order.carrierName} Beşiktaş Levent Şubesi`,
      isCurrent: true,
    },
    {
      title: 'Varış Transfer Merkezine Ulaştı',
      desc: 'Paket ayrıştırma işlemi tamamlandı ve dağıtım şubesine sevk edildi.',
      time: '11 Eylül 2026 • 23:40',
      location: 'Ayazağa Lojistik Transfer Merkezi',
      isCurrent: false,
    },
    {
      title: 'Kargo Çıkış Şubesinden Ayrıldı',
      desc: 'Kargo paketlenip ana aktarma merkezine gönderildi.',
      time: '11 Eylül 2026 • 18:20',
      location: 'Tuzla Depo Çıkış Şubesi',
      isCurrent: false,
    },
    {
      title: 'Kargo Barkodu Oluşturuldu',
      desc: 'Sipariş hazırlandı ve kargo taşıma irsaliyesi düzenlendi.',
      time: '10 Eylül 2026 • 16:30',
      location: 'NovaTech Maslak Merkez',
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-2.5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Toast notification for tracking redirect */}
      {trackingToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <Truck className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{trackingToast}</span>
        </div>
      )}

      {/* Banner: 3. Aşama Kargoya Verildi */}
      <div className="rounded-lg sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-3 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/20 backdrop-blur-xs px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wide text-blue-50 border border-white/20 mb-1.5 sm:mb-2">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-ping" />
              Aşama 3: Kargo Yolda & Dağıtımda
            </div>
            <h1 className="text-base sm:text-2xl font-bold tracking-tight">
              Siparişiniz {order.carrierName} ile Kargoya Verildi
            </h1>
            <p className="text-[11px] sm:text-sm text-blue-100 mt-0.5 sm:mt-1">
              Kuryemiz dağıtım rotasında. Tahmini teslimat: <strong className="text-white font-semibold">{order.estimatedDeliveryDate}</strong>
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Dinamik Kargo Şirketi Takip Butonu */}
            <a
              id="shipped-banner-carrier-tracking-btn"
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={showTrackingToast}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold shadow-md transition active:scale-95 cursor-pointer group whitespace-nowrap"
              title={`${order.carrierName} resmi takip sayfasını yeni sekmede aç`}
            >
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900 group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">
                <span className="sm:hidden">{order.carrierName} Takip</span>
                <span className="hidden sm:inline">{order.carrierName} Takip Sayfası</span>
              </span>
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <button
              id="simulate-delivered-btn"
              onClick={onSimulateDelivery}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-blue-900 shadow-md hover:bg-blue-50 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span>4. Teslim Edildi Ekranına Geç</span>
            </button>
          </div>
        </div>

        {/* Tracking number & carrier quick bar */}
        <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-blue-200 text-[10px] sm:text-xs">Kargo Takip No:</span>
            <span className="font-mono font-bold bg-white/15 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md tracking-wider text-[11px] sm:text-xs">
              {order.trackingNumber}
            </span>
            <button
              onClick={handleCopyTracking}
              className="p-0.5 sm:p-1 rounded hover:bg-white/20 transition text-blue-200 hover:text-white cursor-pointer"
              title="Kopyala"
            >
              {copied ? <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-300" /> : <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
            </button>
            <a
              id="shipped-bar-carrier-link"
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={showTrackingToast}
              className="inline-flex items-center gap-1 rounded bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 text-[10px] sm:text-xs font-semibold transition cursor-pointer ml-1"
              title={`${order.carrierName} resmi sitesinde sorgula`}
            >
              <span>Resmi Sayfada Gör</span>
              <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 text-blue-100 text-[9px] sm:text-[11px]">
            <span>Taşıyıcı: <strong className="text-white">{order.carrierName}</strong></span>
            <span>Gönderi: <strong className="text-white">Hızlı Teslimat</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Courier Card & Live Map Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 sm:gap-6">

        {/* Live Courier & Delivery Preference */}
        <div className="lg:col-span-1 space-y-2.5 sm:space-y-6">

          {/* Assigned Courier Card */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 mb-2 sm:mb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider">Zimmetli Kurye</h3>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.2 text-[8px] sm:text-[10px] font-semibold text-emerald-700">
                Aktif Görevde
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs sm:text-base shadow-sm shrink-0">
                MY
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-sm font-bold text-slate-900 truncate">{order.courierInfo?.name}</p>
                <p className="text-[10px] sm:text-xs text-slate-500">{order.carrierName} Kuryesi</p>
                <p className="text-[9px] sm:text-[11px] font-mono text-slate-600">Araç: {order.courierInfo?.plate}</p>
              </div>
            </div>

            <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tahmini Varış:</span>
                <span className="font-semibold text-blue-700">{order.courierInfo?.estimatedArrival}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Kurye Telefonu:</span>
                <span className="font-mono text-slate-800 font-medium">{order.courierInfo?.phone}</span>
              </div>

              <a
                href={`tel:${order.courierInfo?.phone}`}
                className="mt-1.5 sm:mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-blue-50 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>Kuryeyi Ara</span>
              </a>
            </div>
          </div>

          {/* Delivery Preferences Selection */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-5 border border-slate-200/90 shadow-2xs">
            <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 sm:mb-2">
              Teslimat Tercihiniz
            </h3>
            <p className="text-[9px] sm:text-[11px] text-slate-500 mb-2 sm:mb-3">
              Evde değilseniz veya farklı bir talimat vermek isterseniz kuryeye bildirebilirsiniz:
            </p>

            {preferenceSuccess && (
              <div className="mb-2.5 sm:mb-3 rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{preferenceSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2 text-xs">
              {[
                { id: 'address', label: 'Adresime Bizzat Teslim Edilsin' },
                { id: 'neighbor', label: 'Komşuma / Görevliye Bırakılsın' },
                { id: 'security', label: 'Site Güvenliğine Teslim Edilsin' },
                { id: 'branch', label: 'Levent Şubesinden Alacağım' },
              ].map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => handleSavePreference(pref.id)}
                  className={`w-full text-left p-2 sm:p-2.5 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs transition flex items-center justify-between cursor-pointer ${
                    selectedPreference === pref.id
                      ? 'border-blue-600 bg-blue-50/50 text-blue-950 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{pref.label}</span>
                  {selectedPreference === pref.id && (
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Kargo Şirketi Resmi Takip Portalı Kartı */}
          <div className="rounded-lg sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white p-2.5 sm:p-5 border border-slate-700/80 shadow-md space-y-2.5 sm:space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-blue-500/15 blur-xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-md bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Truck className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
                  Resmi Kargo Takibi
                </h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                {order.carrierName}
              </span>
            </div>

            <p className="text-[10px] sm:text-xs text-slate-300 leading-snug">
              Paketinizin dağıtım şubesi, araç konumu ve kurye teslim aşamalarını doğrudan <strong className="text-white">{order.carrierName}</strong> resmi takip sisteminden görüntüleyebilirsiniz.
            </p>

            {/* Tracking Code Box */}
            <div className="rounded-lg bg-white/10 border border-white/10 p-2 sm:p-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 block font-medium">Gönderi Takip Kodu</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider truncate block">
                  {order.trackingNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyTracking}
                className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white/15 hover:bg-white/25 px-2 py-1.5 rounded-md text-slate-200 hover:text-white transition active:scale-95 cursor-pointer shrink-0"
                title="Kodu kopyala"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            {/* Dinamik Kargo Takip Butonu */}
            <a
              id="leftcard-carrier-tracking-btn"
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={showTrackingToast}
              className="w-full flex items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2 sm:py-2.5 px-3 text-[11px] sm:text-xs shadow-md hover:shadow-lg transition active:scale-98 group cursor-pointer whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 text-slate-900 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="whitespace-nowrap">
                <span className="sm:hidden">{order.carrierName} Takip Sitesi</span>
                <span className="hidden sm:inline">{order.carrierName} Takip Sayfasına Git</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-900 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 pt-1.5 border-t border-white/10">
              <span>{order.carrierName} Destek Hattı:</span>
              <span className="font-mono text-amber-300 font-semibold">{carrierConfig.supportPhone}</span>
            </div>
          </div>

        </div>

        {/* Live Route & Movement History (2 columns) */}
        <div className="lg:col-span-2 space-y-2.5 sm:space-y-6">

          {/* Visual Route Tracker */}
          <div className="rounded-lg sm:rounded-2xl bg-white p-2.5 sm:p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 sm:pb-3 mb-2 sm:mb-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Navigation className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">Sevkiyat Güzergahı</h3>
              </div>
              <span className="text-[9px] sm:text-xs text-slate-500">
                Hedef: <span className="font-semibold text-slate-800">{order.shippingAddress.district}</span>
              </span>
            </div>

            {/* Simulated Live Route Visual */}
            <div className="relative rounded-lg sm:rounded-xl bg-slate-900 text-white p-2.5 sm:p-5 overflow-hidden">
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-emerald-300 text-[10px] sm:text-xs">Canlı Konum</span>
                </div>
                <span className="text-[9px] sm:text-[11px] text-slate-400">4 dk önce güncellendi</span>
              </div>

              {/* Progress bar visual */}
              <div className="space-y-1.5 sm:space-y-3 py-0.5 sm:py-2">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span>Transfer Merkezi</span>
                  <span className="font-bold text-white">Dağıtım Aracı</span>
                  <span>Teslim Adresi</span>
                </div>
                <div className="relative h-2 sm:h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 w-3/4 rounded-full" />
                </div>
              </div>

              <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-slate-300">
                <span>Mesafe:</span>
                <span className="font-bold text-white">~1.8 km (3 teslimat sonra)</span>
              </div>
            </div>

            {/* Checkpoint Timeline */}
            <div className="mt-3 sm:mt-6">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 sm:mb-4">
                Kargo Hareket Geçmişi
              </h4>

              <div className="space-y-2.5 sm:space-y-4">
                {checkpoints.map((cp, idx) => (
                  <div key={idx} className="relative flex gap-2 sm:gap-3.5">
                    {idx !== checkpoints.length - 1 && (
                      <div
                        className={`absolute left-2.5 sm:left-3.5 top-4 sm:top-6 bottom-0 w-0.5 ${
                          idx === 0 ? 'bg-blue-400' : 'bg-slate-200'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-5 w-5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-[9px] sm:text-xs font-bold ${
                        cp.isCurrent
                          ? 'bg-blue-600 text-white ring-1.5 sm:ring-4 ring-blue-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {cp.isCurrent ? <Clock className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 animate-pulse" /> : <Check className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />}
                    </div>

                    <div className="flex-1 pb-1.5 sm:pb-3">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className={`text-[10px] sm:text-xs font-bold ${cp.isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                          {cp.title}
                        </p>
                        <span className="text-[9px] sm:text-[11px] text-slate-400 font-medium shrink-0">{cp.time}</span>
                      </div>
                      <p className="text-[9px] sm:text-[11px] text-slate-600 mt-0.5 leading-snug">{cp.desc}</p>
                      <p className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-2 w-2 sm:h-3 sm:w-3" /> {cp.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 bg-slate-100/80 rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200">
            <button
              onClick={onBackToOrderSummary}
              className="text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline transition cursor-pointer text-center sm:text-left py-0.5 sm:py-0"
            >
              ← Sipariş Özetine Geri Dön
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <a
                id="shipped-footer-carrier-tracking-btn"
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={showTrackingToast}
                className="flex-1 sm:flex-initial rounded-lg sm:rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center whitespace-nowrap"
              >
                <Truck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-900 shrink-0" />
                <span className="whitespace-nowrap">
                  <span className="sm:hidden">{order.carrierName.replace(/\s+Kargo$/i, '')} Takip</span>
                  <span className="hidden sm:inline">{order.carrierName} Takip</span>
                </span>
                <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-900 shrink-0" />
              </a>
              <button
                onClick={onViewInvoice}
                className="flex-1 sm:flex-initial rounded-lg sm:rounded-xl border border-slate-300 bg-white px-2 sm:px-3.5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center whitespace-nowrap"
              >
                Fatura
              </button>
              <button
                onClick={onSimulateDelivery}
                className="flex-1 sm:flex-initial rounded-lg sm:rounded-xl bg-emerald-600 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs transition cursor-pointer text-center whitespace-nowrap"
              >
                Teslim Edildi →
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { X, Truck, Package, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { OrderData } from '../types';
import { getCarrierTrackingUrl, getCarrierConfig } from '../utils/carrier';

interface TrackingModalProps {
  order: OrderData;
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const trackingUrl = getCarrierTrackingUrl(order.carrierName, order.trackingNumber, order.trackingUrl);
  const carrierConfig = getCarrierConfig(order.carrierName);

  const checkpoints = [
    {
      title: 'Sipariş Alındı & Onaylandı',
      location: 'NovaTech Lojistik Maslak',
      time: '10 Eylül 2026 • 15:42',
      status: 'completed',
      desc: 'Ödeme onaylandı ve sipariş kaydı oluşturuldu.',
    },
    {
      title: 'Hazırlanıyor & Paketlendi',
      location: 'Merkez Depo (Tuzla / İstanbul)',
      time: '10 Eylül 2026 • 16:15',
      status: 'completed',
      desc: 'Ürünler kalite kontrolünden geçti ve koruyucu kutuya yerleştirildi.',
    },
    {
      title: 'Kargo Firmasına Teslim Edildi',
      location: order.carrierName + ' Levent Transfer Merkezi',
      time: 'Bugün • 17:30',
      status: 'current',
      desc: `Kargo barkodu oluşturuldu (${order.trackingNumber}). Taşıyıcı araca yüklendi.`,
    },
    {
      title: 'Dağıtım Merkezine Ulaşım',
      location: order.carrierName + ' ' + order.shippingAddress.district + ' Şubesi',
      time: 'Tahmini: 12 Eylül 2026 • 08:30',
      status: 'upcoming',
      desc: 'Varış şubesine intikal edip kurye zimmetine atanacaktır.',
    },
    {
      title: 'Teslimat Gerçekleştirildi',
      location: order.shippingAddress.addressLine + ', ' + order.shippingAddress.district + ' / ' + order.shippingAddress.city,
      time: 'Tahmini: ' + order.estimatedDeliveryDate,
      status: 'upcoming',
      desc: 'Alıcı ' + order.shippingAddress.fullName + ' kişisine teslim edilecektir.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl text-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Kargo Canlı Takibi</h3>
              <p className="text-xs text-slate-500">
                {order.carrierName} • <span className="font-mono font-medium text-slate-700">{order.trackingNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current status pill */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide">Mevcut Durum</span>
            <p className="text-sm font-semibold text-slate-900">Kargoya Verildi & Yolda</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500">Tahmini Teslimat</span>
            <p className="text-xs font-semibold text-emerald-600">{order.estimatedDeliveryDate}</p>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {checkpoints.map((step, idx) => (
            <div key={idx} className="relative flex gap-3.5 group">
              {/* Vertical line connecting steps */}
              {idx !== checkpoints.length - 1 && (
                <div
                  className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                    step.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Icon Circle */}
              <div
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.status === 'completed'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : step.status === 'current'
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step.status === 'completed' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : step.status === 'current' ? (
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Step details */}
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-xs font-semibold ${
                      step.status === 'current'
                        ? 'text-blue-700'
                        : step.status === 'completed'
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.status === 'current' && (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                      Son Durum
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span>{step.location}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{step.desc}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{order.carrierName} İletişim: <strong className="text-slate-700">{carrierConfig.supportPhone}</strong></span>
          <div className="flex items-center gap-2">
            <a
              id="modal-carrier-tracking-link-btn"
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 px-3 py-1.5 text-xs font-bold text-slate-950 transition cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span className="whitespace-nowrap">
                <span className="sm:hidden">{order.carrierName} Sorgula</span>
                <span className="hidden sm:inline">{order.carrierName} Sitesinde Sorgula</span>
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-slate-900 shrink-0" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-4 py-1.5 font-medium text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

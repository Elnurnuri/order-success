import React, { useState } from 'react';
import {
  Check,
  PackageCheck,
  Boxes,
  Truck,
  Home,
  Clock,
  Info,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderData } from '../types';

export type StepTarget = 'overview' | 'shipped' | 'delivered';

export interface CircleStepperProps {
  order: OrderData;
  stepView: StepTarget;
  onStepClick: (target: StepTarget) => void;
}

export const CircleStepper: React.FC<CircleStepperProps> = ({
  order,
  stepView,
  onStepClick,
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Determine state for each of the 4 steps: 'completed' | 'active' | 'passive'
  const getStepState = (stepIndex: number): 'completed' | 'active' | 'passive' => {
    if (stepView === 'delivered') {
      return 'completed';
    }
    if (stepView === 'shipped') {
      if (stepIndex === 1 || stepIndex === 2) return 'completed';
      if (stepIndex === 3) return 'active';
      return 'passive';
    }
    // stepView === 'overview'
    if (stepIndex === 1) return 'completed';
    if (stepIndex === 2) return 'active';
    return 'passive';
  };

  const steps = [
    {
      id: 'step-1',
      number: 1,
      title: 'Sipariş Alındı',
      shortTitle: '1. Alındı',
      statusMobile: 'Onaylandı',
      subtitle: order.createdAt,
      state: getStepState(1),
      target: 'overview' as StepTarget,
      icon: PackageCheck,
      tooltip: {
        header: 'Sipariş Onayı & Ödeme',
        badge: 'İşlem Başarılı',
        badgeColor: 'bg-emerald-900/80 text-emerald-300 border-emerald-700/50',
        primaryInfo: `Sipariş Tarihi: ${order.createdAt}`,
        primaryIcon: Calendar,
        secondaryInfo: 'Online Ödeme & 3D Secure Korumalı',
        secondaryIcon: ShieldCheck,
        detail: 'Sipariş kaydınız alındı, e-arşiv faturanız sistemde hazırlandı.',
        highlightLabel: 'İşlem Süresi',
        highlightValue: 'Anında Onay',
      },
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Hazırlanıyor',
      shortTitle: '2. Hazırlık',
      statusMobile: stepView === 'overview' ? 'Depoda' : 'Hazır',
      subtitle: 'Depoda Paketleniyor',
      state: getStepState(2),
      target: 'overview' as StepTarget,
      icon: Boxes,
      tooltip: {
        header: 'Paketleme & Kalite Kontrol',
        badge: 'Depo Sürecinde',
        badgeColor: 'bg-amber-900/80 text-amber-300 border-amber-700/50',
        primaryInfo: 'Tahmini Hazırlık: 2 - 4 Saat İçinde',
        primaryIcon: Clock,
        secondaryInfo: 'İstanbul Ana Lojistik Merkezi (Depo A-4)',
        secondaryIcon: MapPin,
        detail: 'Ürünler raftan toplandı, koruyucu ambalaj ile paketleniyor.',
        highlightLabel: 'Kargo Çıkışı',
        highlightValue: 'Bugün 17:00 Öncesi',
      },
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Kargoya Verildi',
      shortTitle: '3. Kargo',
      statusMobile: stepView === 'shipped' ? 'Dağıtımda' : stepView === 'delivered' ? 'Teslim' : 'Sırada',
      subtitle: order.carrierName,
      state: getStepState(3),
      target: 'shipped' as StepTarget,
      icon: Truck,
      tooltip: {
        header: 'Taşıma & Kargo Aşaması',
        badge: `${order.carrierName} Express`,
        badgeColor: 'bg-blue-900/80 text-blue-300 border-blue-700/50',
        primaryInfo: `Kargo Firması: ${order.carrierName}`,
        primaryIcon: Truck,
        secondaryInfo: `Takip Kodu: ${order.trackingNumber}`,
        secondaryIcon: Clock,
        courierInfo: order.courierInfo ? `Kurye: ${order.courierInfo.name} (${order.courierInfo.plate})` : undefined,
        detail: 'Paketiniz transfer merkezinden çıktı, teslimat şubesine doğru yolda.',
        highlightLabel: 'Tahmini Teslim',
        highlightValue: '1 - 2 İş Günü',
      },
    },
    {
      id: 'step-4',
      number: 4,
      title: 'Teslim Edildi',
      shortTitle: '4. Teslim',
      statusMobile: stepView === 'delivered' ? 'Teslim Edildi' : 'Bekleniyor',
      subtitle: order.estimatedDeliveryDate,
      state: getStepState(4),
      target: 'delivered' as StepTarget,
      icon: Home,
      tooltip: {
        header: 'Adrese Teslimat & Onay',
        badge: 'Tahmini Teslimat',
        badgeColor: 'bg-purple-900/80 text-purple-300 border-purple-700/50',
        primaryInfo: `Teslimat: ${order.estimatedDeliveryDate}`,
        primaryIcon: Calendar,
        secondaryInfo: `${order.shippingAddress.district}, ${order.shippingAddress.city}`,
        secondaryIcon: MapPin,
        detail: 'Alıcıya kapıda kimlik ve SMS doğrulama kodu ile teslim edilir.',
        highlightLabel: 'Zaman Aralığı',
        highlightValue: '09:00 - 18:00 Arası',
      },
    },
  ];

  const getSegmentClass = (idx: number): string => {
    if (idx === 0) {
      if (stepView === 'overview') return 'bg-gradient-to-r from-emerald-500 to-blue-500 w-full';
      return 'bg-emerald-500 w-full';
    }
    if (idx === 1) {
      if (stepView === 'delivered') return 'bg-emerald-500 w-full';
      if (stepView === 'shipped') return 'bg-gradient-to-r from-emerald-500 to-blue-500 w-full';
      return 'w-0';
    }
    if (idx === 2) {
      if (stepView === 'delivered') return 'bg-emerald-500 w-full';
      return 'w-0';
    }
    return 'w-0';
  };

  return (
    <div id="circle-stepper-component" className="w-full relative py-1 sm:py-2">
      {/* 4 Sıralı Adım ve Düğümler Arası Bağlantı Çizgileri */}
      <div className="relative z-10 grid grid-cols-4 gap-0">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isSelectedView =
            (step.target === 'overview' && stepView === 'overview') ||
            (step.target === 'shipped' && stepView === 'shipped') ||
            (step.target === 'delivered' && stepView === 'delivered');

          const isCompleted = step.state === 'completed';
          const isActive = step.state === 'active';
          const isPassive = step.state === 'passive';

          // Responsive alignment for floating tooltips
          const tooltipPositionClass =
            idx === 0
              ? 'left-0 sm:translate-x-0'
              : idx === 1
              ? 'left-1/2 -translate-x-1/3 sm:-translate-x-1/2'
              : idx === 2
              ? 'right-1/2 translate-x-1/3 sm:translate-x-1/2 sm:right-auto sm:left-1/2 sm:-translate-x-1/2'
              : 'right-0 sm:translate-x-0';

          const caretPositionClass =
            idx === 0
              ? 'left-5 sm:left-8'
              : idx === 1
              ? 'left-1/3 sm:left-1/2 -translate-x-1/2'
              : idx === 2
              ? 'right-1/3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2'
              : 'right-5 sm:right-8';

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredStep(step.number)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              {/* Kusursuz Düğüm Arası Bağlantı Çizgisi (Daire Merkezinden Merkezine) */}
              {idx < steps.length - 1 && (
                <div className="absolute top-[14px] sm:top-[20px] left-1/2 w-full h-[2px] sm:h-[3px] -translate-y-1/2 z-0 pointer-events-none">
                  <div className="w-full h-full bg-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${getSegmentClass(idx)}`}
                    />
                  </div>
                </div>
              )}

              {/* Desktop Hover Tooltip */}
              <AnimatePresence>
                {hoveredStep === step.number && (
                  <motion.div
                    role="tooltip"
                    id={`step-tooltip-${step.number}`}
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.96 }}
                    transition={{ duration: 0.14, ease: 'easeOut' }}
                    className={`hidden sm:block absolute bottom-full mb-3 z-40 w-72 rounded-xl bg-slate-900 text-white p-3 shadow-xl border border-slate-700/80 text-left pointer-events-none ${tooltipPositionClass}`}
                  >
                    <div className="flex items-center justify-between gap-1 border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-xs font-bold text-slate-100 flex items-center gap-1 truncate">
                        <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{step.tooltip.header}</span>
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${step.tooltip.badgeColor}`}>
                        {step.tooltip.badge}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <step.tooltip.primaryIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-slate-100 line-clamp-1">
                          {step.tooltip.primaryInfo}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <step.tooltip.secondaryIcon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span className="text-slate-300 text-[11px] line-clamp-1">
                          {step.tooltip.secondaryInfo}
                        </span>
                      </div>

                      {step.tooltip.courierInfo && (
                        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                          <UserCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="line-clamp-1">{step.tooltip.courierInfo}</span>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-400 pt-1 leading-relaxed border-t border-slate-800/80 line-clamp-2">
                        {step.tooltip.detail}
                      </p>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{step.tooltip.highlightLabel}:</span>
                      <span className="font-bold text-emerald-400">{step.tooltip.highlightValue}</span>
                    </div>

                    <div
                      className={`absolute top-full ${caretPositionClass} w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-900`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sequential Step Node Button (Ultra-compact on mobile) */}
              <button
                type="button"
                id={`circle-step-${step.number}`}
                onClick={() => onStepClick(step.target)}
                onFocus={() => setHoveredStep(step.number)}
                onBlur={() => setHoveredStep(null)}
                className="group w-full flex flex-col items-center text-center cursor-pointer transition-all duration-150 relative pt-0 pb-1 sm:pb-2 px-0.5"
              >
                {/* Node Circle (28px mobile, 40px desktop) */}
                <div className="relative z-10 mb-1 sm:mb-2 flex items-center justify-center">
                  {isCompleted && (
                    <div
                      className={`flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs ring-2 sm:ring-4 transition-transform group-hover:scale-105 ${
                        isSelectedView
                          ? 'ring-emerald-400 ring-offset-2 ring-offset-white'
                          : 'ring-emerald-100 ring-offset-1 ring-offset-white'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 sm:h-5 sm:w-5 stroke-[3]" />
                    </div>
                  )}

                  {isActive && (
                    <div
                      className={`relative flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs ring-2 sm:ring-4 ring-blue-200 transition-transform group-hover:scale-105 ${
                        isSelectedView
                          ? 'ring-blue-400 ring-offset-2 ring-offset-white'
                          : 'ring-blue-100 ring-offset-1 ring-offset-white'
                      }`}
                    >
                      <StepIcon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500 ring-1 ring-white"></span>
                      </span>
                    </div>
                  )}

                  {isPassive && (
                    <div className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white border-2 border-slate-300 text-slate-400 transition-colors group-hover:border-slate-400 group-hover:text-slate-600 shadow-2xs">
                      <span className="text-[11px] sm:text-xs font-bold">{step.number}</span>
                    </div>
                  )}
                </div>

                {/* Step Title: Sequential & Compact */}
                <span
                  className={`block text-[10px] sm:text-xs font-bold leading-tight truncate w-full px-0.5 transition-colors ${
                    isCompleted
                      ? 'text-emerald-950 group-hover:text-emerald-700'
                      : isActive
                      ? 'text-blue-950 font-extrabold group-hover:text-blue-700'
                      : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                >
                  <span className="sm:hidden">{step.shortTitle}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </span>

                {/* Subtitle / Status */}
                <span className="block text-[9px] sm:text-[11px] leading-tight mt-0.5 truncate w-full px-0.5">
                  <span className="sm:hidden">
                    {isCompleted ? (
                      <span className="text-emerald-600 font-semibold">{step.statusMobile}</span>
                    ) : isActive ? (
                      <span className="text-blue-600 font-bold">{step.statusMobile}</span>
                    ) : (
                      <span className="text-slate-400 font-medium">{step.statusMobile}</span>
                    )}
                  </span>
                  <span className="hidden sm:inline text-slate-500 font-medium">
                    {step.subtitle}
                  </span>
                </span>

                {/* Active Selected View Indicator Pill */}
                {isSelectedView && (
                  <span className="mt-1 inline-block h-1 w-3 sm:w-5 rounded-full bg-emerald-500" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};



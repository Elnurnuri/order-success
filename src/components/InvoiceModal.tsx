import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { OrderData } from '../types';
import { formatCurrency } from '../data/mockOrder';

interface InvoiceModalProps {
  order: OrderData;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl text-slate-800"
        id="printable-invoice"
      >
        {/* Modal Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> E-Arşiv Fatura
            </span>
            <span className="text-xs text-slate-500">#{order.orderNumber}-FATURA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="invoice-print-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-3.5 w-3.5" /> Yazdır
            </button>
            <button
              id="invoice-close-btn"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              aria-label="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="space-y-6">
          {/* Header & Company details */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  SHOP
                </div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">NovaTech Elektronik</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">NovaTech Ticaret A.Ş.</p>
              <p className="text-xs text-slate-500">Maslak Mah. Büyükdere Cad. No: 198, Sarıyer / İstanbul</p>
              <p className="text-xs text-slate-500">Mersis: 084920491020001 • Maslak V.D. 7192849102</p>
            </div>
            <div className="sm:text-right text-xs space-y-1">
              <div className="font-semibold text-slate-900 text-sm">E-ARŞİV FATURA</div>
              <div className="text-slate-600">Fatura No: <span className="font-mono text-slate-900">GIB202600009418</span></div>
              <div className="text-slate-600">Fatura Tarihi: <span className="font-medium text-slate-900">{order.createdAt}</span></div>
              <div className="text-slate-600">Sipariş No: <span className="font-medium text-slate-900">#{order.orderNumber}</span></div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div>
              <p className="font-semibold text-slate-900 mb-1">Müşteri / Alıcı Bilgileri</p>
              <p className="font-medium text-slate-800">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.addressLine}</p>
              <p className="text-slate-600">{order.shippingAddress.district} / {order.shippingAddress.city}</p>
              <p className="text-slate-600">Tel: {order.shippingAddress.phone}</p>
              <p className="text-slate-600">E-posta: {order.shippingAddress.email}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">Ödeme & Kargo Detayı</p>
              <p className="text-slate-700"><span className="text-slate-500">Ödeme Şekli:</span> Kredi Kartı ({order.paymentDetails.cardBrand.toUpperCase()})</p>
              <p className="text-slate-700"><span className="text-slate-500">Kart:</span> {order.paymentDetails.cardNumberMasked}</p>
              <p className="text-slate-700"><span className="text-slate-500">Taksit:</span> {order.paymentDetails.installment} Taksit</p>
              <p className="text-slate-700"><span className="text-slate-500">Kargo Firması:</span> {order.carrierName}</p>
              <p className="text-slate-700"><span className="text-slate-500">Takip Kodu:</span> {order.trackingNumber}</p>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 font-medium">Ürün Açıklaması</th>
                  <th className="py-2.5 text-center font-medium">Miktar</th>
                  <th className="py-2.5 text-right font-medium">Birim Fiyat</th>
                  <th className="py-2.5 text-right font-medium">KDV (%20)</th>
                  <th className="py-2.5 text-right font-medium">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => {
                  const vatAmount = (item.price * item.quantity * 0.20) / 1.20;
                  return (
                    <tr key={item.id} className="text-slate-700">
                      <td className="py-3">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">{item.variant}</div>
                      </td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="py-3 text-right text-slate-500">{formatCurrency(vatAmount)}</td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Bu belge 213 sayılı V.U.K. hükümlerine göre elektronik ortamda düzenlenmiştir.</span>
            </div>
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span className="font-medium text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>İndirim Tutarı:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Kargo Bedeli:</span>
                <span className="text-emerald-600 font-medium">Ücretsiz</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Hesaplanan KDV (%20):</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                <span>Ödenecek Toplam:</span>
                <span className="text-emerald-700">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Database, 
  Layers, 
  Calendar, 
  Wrench, 
  Package, 
  FileText,
  Users
} from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    setIsResetting(true);
    // Execute reset and give clear feedback
    setTimeout(() => {
      onConfirmReset();
      setIsResetting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Konfirmasi Kosongkan & Reset Data Sistem</h3>
              <p className="text-[11px] text-red-100">Bersihkan seluruh data simulasi menjadi kosongan</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isResetting}
            className="w-7 h-7 rounded-lg text-white/80 hover:text-white hover:bg-red-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Sistem Berhasil Dikosongkan!</h4>
              <p className="text-slate-600 max-w-xs mx-auto text-xs">
                Seluruh database aset, jadwal, perbaikan, dan gudang telah dibersihkan menjadi kosongan. Pengguna aktif hanya tersisa Fatchur Rochman.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">Perhatian: Tindakan Pengosongan Data</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Tindakan ini akan menghapus seluruh data simulasi dan mengosongkan seluruh tabel operasional gedung agar siap diisi dengan data riil dari awal.
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-2">Kondisi database setelah proses ini:</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>Aset Gedung: 0 (Kosongan)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Jadwal Servis: 0 (Kosongan)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Wrench className="w-3.5 h-3.5 text-red-500" />
                    <span>Tiket Perbaikan: 0 (Kosongan)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <Package className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Stok Gudang: 0 (Kosongan)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 col-span-2">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Hanya tersisa: <strong>Fatchur Rochman</strong> (GA Manager)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isResetting}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  id="btn-confirm-reset-simulation"
                  onClick={handleExecuteReset}
                  disabled={isResetting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-2 active:scale-95"
                >
                  <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Mengosongkan Data...' : 'Ya, Kosongkan Seluruh Data'}</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

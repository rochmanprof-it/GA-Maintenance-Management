import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  X, 
  Save, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  PhoneCall, 
  Building, 
  Briefcase,
  RotateCcw
} from 'lucide-react';
import { FacilityProfile } from '../types';

interface EditFacilityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FacilityProfile;
  onSave: (updated: Partial<FacilityProfile>) => void;
}

export const EditFacilityProfileModal: React.FC<EditFacilityProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [companyName, setCompanyName] = useState(profile.companyName || '');
  const [buildingName, setBuildingName] = useState(profile.buildingName || '');
  const [towerUnit, setTowerUnit] = useState(profile.towerUnit || '');
  const [address, setAddress] = useState(profile.address || '');
  const [floorsCount, setFloorsCount] = useState(profile.floorsCount || '');
  const [auditStandard, setAuditStandard] = useState(profile.auditStandard || '');
  const [technicianHotline, setTechnicianHotline] = useState(profile.technicianHotline || '');
  const [opsOffice, setOpsOffice] = useState(profile.opsOffice || '');

  useEffect(() => {
    if (isOpen) {
      setCompanyName(profile.companyName || '');
      setBuildingName(profile.buildingName || '');
      setTowerUnit(profile.towerUnit || '');
      setAddress(profile.address || '');
      setFloorsCount(profile.floorsCount || '');
      setAuditStandard(profile.auditStandard || '');
      setTechnicianHotline(profile.technicianHotline || '');
      setOpsOffice(profile.opsOffice || '');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: companyName.trim() || 'Perusahaan Pengelola',
      buildingName: buildingName.trim() || 'Gedung Operasional',
      towerUnit: towerUnit.trim(),
      address: address.trim(),
      floorsCount: floorsCount.trim(),
      auditStandard: auditStandard.trim(),
      technicianHotline: technicianHotline.trim(),
      opsOffice: opsOffice.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Edit Data Perusahaan & Fasilitas Gedung</h3>
              <p className="text-xs text-slate-400">Perbarui identitas gedung, entitas perusahaan, dan standar fasilitas</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                <span>Nama Perusahaan / Pengelola *</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Graha Solusi Propertindo"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-600" />
                <span>Nama Gedung / Fasilitas *</span>
              </label>
              <input
                type="text"
                required
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="Contoh: Menara Graha Kencana"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Tower / Sayap / Blok Gedung</span>
              </label>
              <input
                type="text"
                value={towerUnit}
                onChange={(e) => setTowerUnit(e.target.value)}
                placeholder="Contoh: Tower A & B, Sayap Barat"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Jumlah Lantai & Struktur</span>
              </label>
              <input
                type="text"
                value={floorsCount}
                onChange={(e) => setFloorsCount(e.target.value)}
                placeholder="Contoh: 18 Lantai, 2 Basement"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Alamat Lengkap Gedung / Lokasi</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Standar Operasional / Audit</span>
              </label>
              <input
                type="text"
                value={auditStandard}
                onChange={(e) => setAuditStandard(e.target.value)}
                placeholder="Contoh: ISO 55001 Asset Management"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Hotline Teknisi ME / Darurat</span>
              </label>
              <input
                type="text"
                value={technicianHotline}
                onChange={(e) => setTechnicianHotline(e.target.value)}
                placeholder="Contoh: Ext. 2101 / 2102 (24 Jam)"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Lokasi Kantor GA & Engineering</span>
            </label>
            <input
              type="text"
              value={opsOffice}
              onChange={(e) => setOpsOffice(e.target.value)}
              placeholder="Contoh: Ruang GA & Facility Management Lt. B1"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Info note */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] leading-relaxed">
            Perubahan nama perusahaan dan gedung akan otomatis disinkronkan ke seluruh tampilan sistem: header dashboard, kartu laporan audit, berkas cadangan data (backup JSON), serta surat jalan teknisi.
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

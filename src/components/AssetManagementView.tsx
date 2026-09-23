import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  Wrench, 
  User, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Asset, AssetCategory, AssetStatus, WorkOrder, MaintenanceSchedule } from '../types';

interface AssetManagementViewProps {
  assets: Asset[];
  workOrders: WorkOrder[];
  schedules: MaintenanceSchedule[];
  onOpenNewAssetModal: () => void;
  onOpenNewTicketForAsset: (asset: Asset) => void;
  selectedAssetDetailId: string | null;
  setSelectedAssetDetailId: (id: string | null) => void;
}

export const AssetManagementView: React.FC<AssetManagementViewProps> = ({
  assets,
  workOrders,
  schedules,
  onOpenNewAssetModal,
  onOpenNewTicketForAsset,
  selectedAssetDetailId,
  setSelectedAssetDetailId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'all' | 'repairs' | 'preventive'>('all');

  const categories: AssetCategory[] = [
    'HVAC & Pendingin',
    'Kelistrikan & Panel',
    'Plumbing & Pompa',
    'Mekanikal & Lift',
    'K3 & Fire Protection',
    'Sipil & Gedung'
  ];

  const statuses: AssetStatus[] = [
    'Kondisi Baik',
    'Perlu Perawatan',
    'Rusak Ringan',
    'Rusak Kritis',
    'Dalam Perbaikan'
  ];

  // Filtered assets list
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchSearch = searchQuery === '' ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.floor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.picTechnician.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || a.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  // Active selected asset for modal / slideover
  const selectedAsset = assets.find(a => a.id === selectedAssetDetailId) || null;

  // History for selected asset
  const assetWorkOrders = useMemo(() => {
    if (!selectedAsset) return [];
    return workOrders.filter(w => w.assetId === selectedAsset.id || w.assetCode === selectedAsset.code);
  }, [selectedAsset, workOrders]);

  const assetSchedules = useMemo(() => {
    if (!selectedAsset) return [];
    return schedules.filter(s => s.assetId === selectedAsset.id || s.assetCode === selectedAsset.code);
  }, [selectedAsset, schedules]);

  const totalRepairCost = assetWorkOrders.reduce((sum, wo) => sum + (wo.actualCost || wo.estimatedCost || 0), 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const statusBadge = (st: AssetStatus) => {
    switch (st) {
      case 'Kondisi Baik':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Perlu Perawatan':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rusak Ringan':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Rusak Kritis':
        return 'bg-red-500 text-white font-bold animate-pulse';
      case 'Dalam Perbaikan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Registri Aset Gedung & Riwayat Perbaikan</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pelacakan status operasional mesin, utilitas gedung, masa garansi/servis, dan histori perbaikan kumulatif setiap unit.
          </p>
        </div>
        <button
          id="btn-add-asset"
          onClick={onOpenNewAssetModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Aset Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode aset, nama mesin, lokasi, teknisi PIC..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Kategori Aset</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Kondisi Aset</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto text-amber-600">
              <Boxes className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Belum Ada Aset Terdaftar</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Tidak ada data aset yang cocok dengan filter pencarian Anda.'
                : 'Database aset gedung masih kosong. Mulai tambahkan mesin genset, AC chiller, pompa, atau utilitas gedung lainnya.'}
            </p>
            <button
              onClick={onOpenNewAssetModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Registrasi Aset Baru</span>
            </button>
          </div>
        ) : (
          filteredAssets.map(asset => {
            const repairsCount = workOrders.filter(w => w.assetId === asset.id).length;
            const activeRepair = workOrders.find(w => w.assetId === asset.id && w.status !== 'Selesai');

            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {asset.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge(asset.status)}`}>
                      {asset.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{asset.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{asset.category} • {asset.brandModel}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{asset.location.building} • {asset.location.floor}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5 truncate">
                      {asset.location.room}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Servis Terakhir:</span>
                      <strong className="font-semibold text-slate-700">{asset.lastServiceDate || '-'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Servis Berikutnya:</span>
                      <strong className="font-semibold text-amber-700">{asset.nextServiceDate || '-'}</strong>
                    </div>
                  </div>

                  {activeRepair && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-md text-[11px] text-red-800 flex items-center gap-1.5 font-medium">
                      <Wrench className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span className="truncate">Sedang Diperbaiki: #{activeRepair.ticketNumber}</span>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    {repairsCount} Riwayat Perbaikan
                  </span>

                  <button
                    onClick={() => setSelectedAssetDetailId(asset.id)}
                    className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Riwayat & Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL MODAL: RIWAYAT PERBAIKAN SETIAP ASET */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                    {selectedAsset.code}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusBadge(selectedAsset.status)}`}>
                    {selectedAsset.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedAsset.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedAsset.category} • Brand: {selectedAsset.brandModel} • Serial: {selectedAsset.serialNumber}
                </p>
              </div>

              <button
                onClick={() => setSelectedAssetDetailId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sub-nav / Quick Specs */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Lokasi Fisik:</span>
                <span className="font-semibold text-slate-800">{selectedAsset.location.building}, {selectedAsset.location.floor}</span>
                <p className="text-[11px] text-slate-500">{selectedAsset.location.room}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Teknisi PIC:</span>
                <span className="font-semibold text-slate-800">{selectedAsset.picTechnician}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Tanggal Pasang:</span>
                <span className="font-semibold text-slate-800">{selectedAsset.installDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold">Total Biaya Perbaikan:</span>
                <span className="font-bold text-amber-700">{formatIDR(totalRepairCost)}</span>
              </div>
            </div>

            {/* History Selector Tabs */}
            <div className="px-5 pt-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveHistoryTab('all')}
                  className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                    activeHistoryTab === 'all' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semua Riwayat ({assetWorkOrders.length + assetSchedules.length})
                </button>
                <button
                  onClick={() => setActiveHistoryTab('repairs')}
                  className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                    activeHistoryTab === 'repairs' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Riwayat Perbaikan & Kerusakan ({assetWorkOrders.length})
                </button>
                <button
                  onClick={() => setActiveHistoryTab('preventive')}
                  className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                    activeHistoryTab === 'preventive' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Riwayat Servis Berkala ({assetSchedules.length})
                </button>
              </div>

              <button
                onClick={() => {
                  onOpenNewTicketForAsset(selectedAsset);
                  setSelectedAssetDetailId(null);
                }}
                className="mb-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>+ Lapor Kerusakan Unit Ini</span>
              </button>
            </div>

            {/* Modal Body: Riwayat Chronological Feed */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Asset Notes */}
              {selectedAsset.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <strong className="block font-bold">Catatan Operasional GA:</strong>
                  {selectedAsset.notes}
                </div>
              )}

              {/* Work Orders List (Riwayat Perbaikan) */}
              {(activeHistoryTab === 'all' || activeHistoryTab === 'repairs') && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-red-600" />
                    Catatan Riwayat Kerusakan & Perbaikan (Work Orders)
                  </h4>

                  {assetWorkOrders.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-50 text-slate-400 text-center text-xs">
                      Belum ada riwayat keluhan atau kerusakan tercatat untuk aset ini. Unit beroperasi normal.
                    </div>
                  ) : (
                    assetWorkOrders.map(wo => (
                      <div key={wo.id} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {wo.ticketNumber}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              wo.priority === 'Darurat / Emergency' ? 'bg-red-500 text-white' :
                              wo.priority === 'Tinggi' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {wo.priority}
                            </span>
                            <span className="text-slate-500">Status: <strong>{wo.status}</strong></span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">{wo.reportedDate}</span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800">{wo.issueTitle}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{wo.issueDescription}</p>
                        </div>

                        {wo.resolutionNotes && (
                          <div className="p-2 bg-emerald-50 rounded text-[11px] text-emerald-900 border border-emerald-100">
                            <strong>Hasil Perbaikan:</strong> {wo.resolutionNotes}
                          </div>
                        )}

                        {/* Spare parts used */}
                        {wo.sparePartsUsed.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700">Sparepart & Suku Cadang Terpakai:</span>
                            <div className="mt-1 space-y-1">
                              {wo.sparePartsUsed.map((part, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-slate-50 p-1.5 rounded">
                                  <span>{part.itemName} ({part.quantity} {part.unit})</span>
                                  <span className="font-medium text-slate-700">{formatIDR(part.quantity * part.unitPrice)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-500">Teknisi Pelaksana: <strong className="text-slate-700">{wo.assignedTechnician}</strong></span>
                          <span className="text-slate-700">Biaya Total: <strong className="text-amber-700">{formatIDR(wo.actualCost || wo.estimatedCost)}</strong></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Maintenance Schedules List (Servis Berkala) */}
              {(activeHistoryTab === 'all' || activeHistoryTab === 'preventive') && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Jadwal Pemeliharaan Preventif (SOP Servis)
                  </h4>

                  {assetSchedules.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-50 text-slate-400 text-center text-xs">
                      Belum ada jadwal servis terdaftar untuk aset ini.
                    </div>
                  ) : (
                    assetSchedules.map(sch => (
                      <div key={sch.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{sch.title}</p>
                          <p className="text-[11px] text-slate-500">Frekuensi: {sch.frequency} • PIC: {sch.assignedTechnician}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Tanggal: {sch.scheduledDate} {sch.completedDate ? `(Selesai: ${sch.completedDate})` : ''}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                          sch.status === 'Terlambat / Overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {sch.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAssetDetailId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Tutup Ringkasan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

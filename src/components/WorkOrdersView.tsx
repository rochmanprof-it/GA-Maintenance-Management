import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Package, 
  DollarSign, 
  ChevronRight, 
  ShieldAlert,
  ArrowRight,
  Columns3,
  List
} from 'lucide-react';
import { WorkOrder, TicketPriority, TicketStatus, InventoryItem, Asset } from '../types';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  assets: Asset[];
  inventory: InventoryItem[];
  onOpenNewTicketModal: () => void;
  onUpdateWorkOrderStatus: (id: string, newStatus: TicketStatus, notes?: string) => void;
  onOpenSparePartModal: (workOrder: WorkOrder) => void;
  onSelectAssetDetail: (assetId: string) => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  assets,
  inventory,
  onOpenNewTicketModal,
  onUpdateWorkOrderStatus,
  onOpenSparePartModal,
  onSelectAssetDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState('');

  const priorities: TicketPriority[] = ['Darurat / Emergency', 'Tinggi', 'Sedang', 'Rendah'];
  const statuses: TicketStatus[] = [
    'Menunggu Validasi',
    'Ditugaskan',
    'Sedang Dikerjakan',
    'Menunggu Sparepart',
    'Selesai'
  ];

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(wo => {
      const matchSearch = searchQuery === '' ||
        wo.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority = selectedPriority === 'ALL' || wo.priority === selectedPriority;
      const matchStatus = selectedStatus === 'ALL' || wo.status === selectedStatus;

      return matchSearch && matchPriority && matchStatus;
    });
  }, [workOrders, searchQuery, selectedPriority, selectedStatus]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'Darurat / Emergency':
        return 'bg-red-600 text-white font-bold animate-pulse';
      case 'Tinggi':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Sedang':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rendah':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const kanbanColumns: TicketStatus[] = [
    'Menunggu Validasi',
    'Ditugaskan',
    'Sedang Dikerjakan',
    'Menunggu Sparepart',
    'Selesai'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold text-slate-900">Pelacakan Perbaikan & Tiket Kerusakan Real-Time</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sistem ticketing perbaikan fasilitas gedung, eskalasi prioritas teknisi, alokasi suku cadang gudang, dan pemantauan durasi MTTR (Mean Time to Repair).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Papan Kanban"
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden md:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Tabel</span>
            </button>
          </div>

          <button
            id="btn-add-ticket"
            onClick={onOpenNewTicketModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Lapor Kerusakan Baru</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor tiket (#WO-...), keluhan, nama aset, lokasi, atau teknisi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Prioritas</option>
              {priorities.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Status Tiket</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(colStatus => {
            const colTickets = filteredWorkOrders.filter(w => w.status === colStatus);

            return (
              <div key={colStatus} className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 flex flex-col min-w-[270px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span className="text-xs font-bold text-slate-800">{colStatus}</span>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                    {colTickets.length}
                  </span>
                </div>

                {/* Column Tickets */}
                <div className="space-y-3 flex-1">
                  {colTickets.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-400 border border-dashed border-slate-300 rounded-lg">
                      Tidak ada tiket
                    </div>
                  ) : (
                    colTickets.map(wo => (
                      <div 
                        key={wo.id}
                        className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {wo.ticketNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(wo.priority)}`}>
                            {wo.priority}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{wo.issueTitle}</h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {wo.issueDescription}
                          </p>
                        </div>

                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                          <div className="text-slate-600 truncate">
                            <strong>Lokasi:</strong> {wo.location}
                          </div>
                          <div className="text-slate-600 truncate">
                            <strong>Aset:</strong> <button onClick={() => onSelectAssetDetail(wo.assetId)} className="text-slate-800 font-semibold hover:underline hover:text-amber-600">{wo.assetName}</button>
                          </div>
                          <div className="text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span>Pelapor: {wo.reportedBy}</span>
                            <span>{wo.reportedDate.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Spare part badge */}
                        {wo.sparePartsUsed.length > 0 && (
                          <div className="p-1.5 bg-amber-50 text-amber-800 rounded text-[10px] font-medium border border-amber-200/60">
                            Terpakai: {wo.sparePartsUsed.map(p => `${p.quantity}x ${p.itemName}`).join(', ')}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                          <span className="text-[11px] text-slate-500">
                            PIC: <strong className="text-slate-800 font-medium">{wo.assignedTechnician}</strong>
                          </span>
                        </div>

                        {/* Workflow Action Bar */}
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {wo.status === 'Menunggu Validasi' && (
                            <button
                              onClick={() => onUpdateWorkOrderStatus(wo.id, 'Ditugaskan')}
                              className="w-full py-1 text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                            >
                              Tugaskan Teknisi →
                            </button>
                          )}

                          {wo.status === 'Ditugaskan' && (
                            <button
                              onClick={() => onUpdateWorkOrderStatus(wo.id, 'Sedang Dikerjakan')}
                              className="w-full py-1 text-[11px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded transition-colors cursor-pointer"
                            >
                              Mulai Pengerjaan Fisik →
                            </button>
                          )}

                          {(wo.status === 'Sedang Dikerjakan' || wo.status === 'Menunggu Sparepart') && (
                            <>
                              <button
                                onClick={() => onOpenSparePartModal(wo)}
                                className="flex-1 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors cursor-pointer flex items-center justify-center gap-1"
                                title="Ambil spare part dari gudang"
                              >
                                <Package className="w-3 h-3 text-amber-600" />
                                <span>+ Suku Cadang</span>
                              </button>
                              <button
                                onClick={() => {
                                  setResolvingTicketId(wo.id);
                                  setResolutionNoteInput('');
                                }}
                                className="flex-1 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                              >
                                Selesaikan ✓
                              </button>
                            </>
                          )}

                          {wo.status === 'Selesai' && (
                            <div className="w-full py-1 text-[10px] text-emerald-700 font-medium text-center bg-emerald-50 rounded">
                              ✓ Terverifikasi Selesai
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">No. Tiket</th>
                  <th className="p-3.5">Prioritas</th>
                  <th className="p-3.5">Kendala & Deskripsi</th>
                  <th className="p-3.5">Aset & Lokasi</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Teknisi PIC</th>
                  <th className="p-3.5">Biaya / Sparepart</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredWorkOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-500">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto">
                          <Wrench className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Tiket Perbaikan</h4>
                        <p className="text-xs text-slate-500">
                          {searchQuery || selectedPriority !== 'ALL' || selectedStatus !== 'ALL'
                            ? 'Tidak ada tiket perbaikan yang cocok dengan filter pencarian.'
                            : 'Belum ada tiket perbaikan dilaporkan. Semua fasilitas gedung berjalan optimal.'}
                        </p>
                        <button
                          onClick={onOpenNewTicketModal}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Lapor Kerusakan Baru</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWorkOrders.map(wo => (
                  <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{wo.ticketNumber}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(wo.priority)}`}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-bold text-slate-900">{wo.issueTitle}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{wo.issueDescription}</div>
                    </td>
                    <td className="p-3.5">
                      <button onClick={() => onSelectAssetDetail(wo.assetId)} className="font-semibold text-slate-800 hover:text-amber-600 hover:underline">
                        {wo.assetName}
                      </button>
                      <div className="text-[11px] text-slate-500">{wo.location}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                        {wo.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium">{wo.assignedTechnician}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{formatIDR(wo.actualCost || wo.estimatedCost)}</div>
                      <div className="text-[10px] text-slate-400">{wo.sparePartsUsed.length} item part</div>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {wo.status !== 'Selesai' && (
                        <button
                          onClick={() => {
                            setResolvingTicketId(wo.id);
                            setResolutionNoteInput('');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Selesai
                        </button>
                      )}
                      <button
                        onClick={() => onOpenSparePartModal(wo)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] cursor-pointer"
                      >
                        Part
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESOLUTION DIALOG MODAL */}
      {resolvingTicketId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900">Konfirmasi Penyelesaian Perbaikan</h3>
            </div>
            <p className="text-xs text-slate-600">
              Tuliskan tindakan yang telah dilakukan oleh teknisi di lapangan dan catatan hasil pengujian:
            </p>
            <textarea
              rows={3}
              value={resolutionNoteInput}
              onChange={(e) => setResolutionNoteInput(e.target.value)}
              placeholder="Contoh: Penggantian bearing motor selesai, vibrasi berkurang drastis, sudah diuji 30 menit aman..."
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResolvingTicketId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onUpdateWorkOrderStatus(resolvingTicketId, 'Selesai', resolutionNoteInput || 'Perbaikan selesai dan diverifikasi aman oleh GA');
                  setResolvingTicketId(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Simpan & Tutup Tiket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

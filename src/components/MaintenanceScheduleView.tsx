import React, { useState, useMemo } from 'react';
import { 
  Calendar,
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Search, 
  Plus, 
  Wrench, 
  User, 
  CheckSquare, 
  Square, 
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { MaintenanceSchedule, AssetCategory, ScheduleStatus, Asset } from '../types';

interface MaintenanceScheduleViewProps {
  schedules: MaintenanceSchedule[];
  assets: Asset[];
  onOpenNewScheduleModal: () => void;
  toggleChecklistItem: (scheduleId: string, checklistId: string) => void;
  onCompleteSchedule: (scheduleId: string, notes?: string) => void;
  onSelectAssetDetail: (assetId: string) => void;
}

export const MaintenanceScheduleView: React.FC<MaintenanceScheduleViewProps> = ({
  schedules,
  assets,
  onOpenNewScheduleModal,
  toggleChecklistItem,
  onCompleteSchedule,
  onSelectAssetDetail
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [expandedScheduleId, setExpandedScheduleId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState<Record<string, string>>({});

  const categories: AssetCategory[] = [
    'HVAC & Pendingin',
    'Kelistrikan & Panel',
    'Plumbing & Pompa',
    'Mekanikal & Lift',
    'K3 & Fire Protection',
    'Sipil & Gedung'
  ];

  const statuses: ScheduleStatus[] = [
    'Terjadwal',
    'Menjelang Jatuh Tempo',
    'Terlambat / Overdue',
    'Sedang Dikerjakan',
    'Selesai'
  ];

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      const matchSearch = searchQuery === '' || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.assetCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
      const matchStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [schedules, searchQuery, selectedCategory, selectedStatus]);

  const overdueCount = schedules.filter(s => s.status === 'Terlambat / Overdue').length;
  const dueSoonCount = schedules.filter(s => s.status === 'Menjelang Jatuh Tempo').length;

  return (
    <div className="space-y-6">
      
      {/* Header Banner & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Jadwal Pemeliharaan Gedung (Preventive Maintenance)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen agenda inspeksi rutin, servis berkala, dan checklist teknisi untuk menjaga performa aset gedung.
          </p>
        </div>
        <button
          id="btn-add-schedule"
          onClick={onOpenNewScheduleModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Jadwal Servis Baru</span>
        </button>
      </div>

      {/* Reminder Alerts Bar */}
      {(overdueCount > 0 || dueSoonCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {overdueCount > 0 && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 animate-bounce" />
              <div className="text-xs">
                <span className="font-bold text-red-900">{overdueCount} Jadwal Servis Telah Terlewat (Overdue)!</span>
                <p className="text-red-700 mt-0.5">Segera jadwalkan teknisi untuk menghindari downtime fasilitas gedung.</p>
              </div>
            </div>
          )}
          {dueSoonCount > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-900">{dueSoonCount} Servis Menjelang Jatuh Tempo</span>
                <p className="text-amber-700 mt-0.5">Persiapkan tools kerja, izin kerja (PTW), dan ketersediaan spare part.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama servis, nama aset, kode aset, atau nama teknisi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Filter */}
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

          {/* Status Filter */}
          <div className="w-full md:w-52">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="ALL">Semua Status Servis</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredSchedules.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Belum Ada Agenda Pemeliharaan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL'
                ? 'Tidak ada jadwal pemeliharaan yang sesuai dengan filter pencarian Anda.'
                : 'Buat agenda servis berkala (mingguan, bulanan, triwulan, tahunan) untuk menjaga keandalan fasilitas gedung.'}
            </p>
            <button
              onClick={onOpenNewScheduleModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Jadwal Pemeliharaan Baru</span>
            </button>
          </div>
        ) : (
          filteredSchedules.map(sch => {
            const isExpanded = expandedScheduleId === sch.id;
            const completedCount = sch.checklist.filter(c => c.completed).length;
            const totalCount = sch.checklist.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            const statusColors: Record<string, string> = {
              'Terlambat / Overdue': 'bg-red-100 text-red-800 border-red-200',
              'Menjelang Jatuh Tempo': 'bg-amber-100 text-amber-800 border-amber-200',
              'Sedang Dikerjakan': 'bg-blue-100 text-blue-800 border-blue-200',
              'Terjadwal': 'bg-slate-100 text-slate-700 border-slate-200',
              'Selesai': 'bg-emerald-100 text-emerald-800 border-emerald-200'
            };

            return (
              <div 
                key={sch.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all overflow-hidden"
              >
                {/* Card Main Row */}
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[sch.status] || 'bg-slate-100'}`}>
                        {sch.status}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Frekuensi: {sch.frequency}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {sch.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{sch.title}</h3>
                    
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span>Aset: <button onClick={() => onSelectAssetDetail(sch.assetId)} className="font-semibold text-slate-800 hover:text-amber-600 hover:underline">{sch.assetName} ({sch.assetCode})</button></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        PIC: <strong className="font-medium text-slate-800">{sch.assignedTechnician}</strong>
                      </span>
                      <span>•</span>
                      <span>Estimasi: {sch.estimatedDurationHours} Jam Kerja</span>
                    </div>
                  </div>

                  {/* Right: Date & Actions */}
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <p className="text-[11px] text-slate-400">Jadwal Pelaksanaan</p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1 md:justify-end">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                        {sch.scheduledDate}
                      </p>
                      {sch.completedDate && (
                        <p className="text-[10px] text-emerald-600 font-medium">Selesai: {sch.completedDate}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedScheduleId(isExpanded ? null : sch.id)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Checklist ({completedCount}/{totalCount})</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>

                      {sch.status !== 'Selesai' && (
                        <button
                          onClick={() => {
                            const note = completionNotes[sch.id] || 'Pemeriksaan rutin berjalan normal';
                            onCompleteSchedule(sch.id, note);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tandai Selesai</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Checklist Progress Bar */}
                <div className="px-4 pb-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${sch.status === 'Selesai' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Checklist & Notes Section */}
                {isExpanded && (
                  <div className="bg-slate-50/80 p-4 border-t border-slate-200/70 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-amber-600" />
                        Checklist Inspeksi Prosedur Standar (SOP)
                      </h4>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Centang setiap item tindakan setelah teknisi selesai melakukan verifikasi fisik di lapangan:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sch.checklist.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleChecklistItem(sch.id, item.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                              item.completed 
                                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900 font-medium' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                            )}
                            <span className="leading-snug">{item.task}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {sch.notes && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs">
                        <strong className="text-slate-700">Catatan Khusus GA / Lapangan:</strong>
                        <p className="text-slate-600 mt-0.5">{sch.notes}</p>
                      </div>
                    )}

                    {/* Completion Notes Input if not finished */}
                    {sch.status !== 'Selesai' && (
                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="text"
                          value={completionNotes[sch.id] || ''}
                          onChange={(e) => setCompletionNotes({ ...completionNotes, [sch.id]: e.target.value })}
                          placeholder="Catatan penutupan servis (misal: Semua tekanan normal, oli diganti)..."
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => {
                            const note = completionNotes[sch.id] || 'Pemeriksaan rutin berjalan normal';
                            onCompleteSchedule(sch.id, note);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer shrink-0"
                        >
                          Simpan & Selesaikan Servis
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

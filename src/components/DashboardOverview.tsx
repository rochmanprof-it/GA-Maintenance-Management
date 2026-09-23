import React from 'react';
import { 
  Building2, 
  Calendar, 
  Wrench, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Boxes, 
  ShieldAlert, 
  TrendingUp, 
  User, 
  History,
  AlertCircle
} from 'lucide-react';
import { 
  Asset, 
  MaintenanceSchedule, 
  WorkOrder, 
  InventoryItem, 
  ActivityLog, 
  NotificationItem 
} from '../types';
import { TabKey } from '../state/useAppState';

interface DashboardOverviewProps {
  stats: {
    totalAssets: number;
    healthyAssets: number;
    criticalAssets: number;
    assetHealthPercent: number;
    totalSchedules: number;
    overdueSchedules: number;
    dueSoonSchedules: number;
    completedSchedules: number;
    totalWorkOrders: number;
    activeWorkOrders: number;
    emergencyWorkOrders: number;
    completedWorkOrders: number;
    lowStockCount: number;
    lowStockItems: InventoryItem[];
    totalInventoryValue: number;
    unreadNotificationsCount: number;
  };
  schedules: MaintenanceSchedule[];
  workOrders: WorkOrder[];
  assets: Asset[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  setCurrentTab: (tab: TabKey) => void;
  onOpenNewTicketModal: () => void;
  onOpenNewScheduleModal: () => void;
  onOpenNewAssetModal: () => void;
  onOpenQuickOpnameModal: (item?: InventoryItem) => void;
  onSelectAssetDetail: (assetId: string) => void;
  onCompleteSchedule: (scheduleId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  schedules,
  workOrders,
  assets,
  activityLogs,
  notifications,
  setCurrentTab,
  onOpenNewTicketModal,
  onOpenNewScheduleModal,
  onOpenNewAssetModal,
  onOpenQuickOpnameModal,
  onSelectAssetDetail,
  onCompleteSchedule
}) => {
  // Urgent alerts for banner
  const overdueOrEmergencyAlerts = notifications.filter(n => n.type === 'urgent' && !n.isRead);

  // Active work orders sorted by priority
  const activeRepairs = [...workOrders]
    .filter(w => w.status !== 'Selesai' && w.status !== 'Dibatalkan')
    .sort((a, b) => {
      const pMap: Record<string, number> = { 'Darurat / Emergency': 3, 'Tinggi': 2, 'Sedang': 1, 'Rendah': 0 };
      return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
    })
    .slice(0, 5);

  // Upcoming schedules (overdue & due soon first)
  const upcomingSchedules = [...schedules]
    .filter(s => s.status !== 'Selesai')
    .sort((a, b) => {
      if (a.status === 'Terlambat / Overdue') return -1;
      if (b.status === 'Terlambat / Overdue') return 1;
      return a.scheduledDate.localeCompare(b.scheduledDate);
    })
    .slice(0, 5);

  // Format currency IDR
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Automated System Reminder / Urgent Alerts Banner */}
      {overdueOrEmergencyAlerts.length > 0 && (
        <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-500/20 text-red-600 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Perhatian GA & Tim Maintenance: {overdueOrEmergencyAlerts.length} Insiden Kritis Memerlukan Tindakan!
              </h4>
              <p className="text-xs text-red-700 mt-0.5">
                {overdueOrEmergencyAlerts[0].message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab(overdueOrEmergencyAlerts[0].targetTab)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Tangani Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Asset Health */}
        <div 
          onClick={() => setCurrentTab('assets')}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-400/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kesehatan Aset Gedung</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.assetHealthPercent}%</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.healthyAssets} / {stats.totalAssets} Siap Operasi
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{stats.criticalAssets > 0 ? `${stats.criticalAssets} Aset Perlu Perbaikan` : 'Semua Aset Terpantau'}</span>
            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform">Detail →</span>
          </div>
        </div>

        {/* Card 2: Servis & Preventive Maintenance */}
        <div 
          onClick={() => setCurrentTab('schedules')}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-400/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jadwal Servis Berkala</span>
            <span className={`p-2 rounded-lg ${stats.overdueSchedules > 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} group-hover:scale-110 transition-transform`}>
              <Calendar className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalSchedules}</span>
            <span className="text-xs text-slate-500">Agenda Terdaftar</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            {stats.overdueSchedules > 0 ? (
              <span className="font-bold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {stats.overdueSchedules} Terlambat
              </span>
            ) : (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Semua On-Schedule
              </span>
            )}
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 font-medium">{stats.dueSoonSchedules} Jatuh Tempo</span>
          </div>
        </div>

        {/* Card 3: Real-Time Repair Tickets */}
        <div 
          onClick={() => setCurrentTab('repairs')}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-400/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelacakan Perbaikan</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.activeWorkOrders}</span>
            <span className="text-xs text-slate-500">Tiket Aktif Berjalan</span>
          </div>
          <div className="mt-2 text-xs flex items-center justify-between">
            {stats.emergencyWorkOrders > 0 ? (
              <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                {stats.emergencyWorkOrders} Prioritas Darurat/Tinggi
              </span>
            ) : (
              <span className="text-slate-500">{stats.completedWorkOrders} Tiket Selesai</span>
            )}
            <span className="text-amber-600 font-semibold group-hover:translate-x-0.5 transition-transform">Pantau →</span>
          </div>
        </div>

        {/* Card 4: Inventory & Low Stock Alert */}
        <div 
          onClick={() => setCurrentTab('inventory')}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:border-amber-400/80 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Barang Operasional</span>
            <span className={`p-2 rounded-lg ${stats.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'} group-hover:scale-110 transition-transform`}>
              <Package className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.lowStockCount}</span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Item Di Bawah Min.
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Estimasi Nilai Logistik:</span>
            <span className="font-semibold text-slate-800">{formatIDR(stats.totalInventoryValue)}</span>
          </div>
        </div>

      </div>

      {/* 3. Quick Action Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Aksi Cepat General Affairs & Maintenance</h3>
            <p className="text-xs text-slate-400">Pencatatan langsung terintegrasi dengan audit trail dan inventaris gudang</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            id="btn-dash-new-ticket"
            onClick={onOpenNewTicketModal}
            className="flex-1 md:flex-none px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>+ Lapor Kerusakan</span>
          </button>
          <button
            id="btn-dash-new-schedule"
            onClick={onOpenNewScheduleModal}
            className="flex-1 md:flex-none px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Jadwal Servis</span>
          </button>
          <button
            id="btn-dash-quick-opname"
            onClick={() => onOpenQuickOpnameModal()}
            className="flex-1 md:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Input Stok Opname</span>
          </button>
          <button
            id="btn-dash-new-asset"
            onClick={onOpenNewAssetModal}
            className="flex-1 md:flex-none px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Boxes className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Registrasi Aset</span>
          </button>
        </div>
      </div>

      {/* 4. Split Grid: Jadwal Servis Mendatang vs Pelacakan Perbaikan Real-Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Jadwal Pemeliharaan & Servis Berkala */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Jadwal Servis Berkala & Pengingat</h3>
            </div>
            <button
              onClick={() => setCurrentTab('schedules')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Kalender Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 flex flex-col justify-center">
            {upcomingSchedules.length === 0 ? (
              <div className="py-8 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Belum ada jadwal pemeliharaan mendatang.</p>
                <button
                  onClick={onOpenNewScheduleModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Buat Jadwal Servis</span>
                </button>
              </div>
            ) : (
              upcomingSchedules.map(sch => {
                const completedTasks = sch.checklist.filter(c => c.completed).length;
                const totalTasks = sch.checklist.length;
                const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                return (
                  <div key={sch.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sch.status === 'Terlambat / Overdue' 
                              ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' 
                              : sch.status === 'Menjelang Jatuh Tempo'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {sch.status}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">{sch.category}</span>
                          <span className="text-[11px] text-slate-400">• PIC: {sch.assignedTechnician}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{sch.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Aset: <button onClick={() => onSelectAssetDetail(sch.assetId)} className="font-semibold text-slate-700 hover:text-amber-600 hover:underline">{sch.assetName}</button>
                        </p>
                        
                        {/* Progress Checklist */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium shrink-0">
                            {completedTasks}/{totalTasks} Task ({progress}%)
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {sch.scheduledDate}
                        </span>
                        <button
                          onClick={() => onCompleteSchedule(sch.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          title="Tandai Servis Selesai"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selesai</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Pelacakan Perbaikan Real-Time (Work Orders) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-bold text-slate-900">Pelacakan Tiket Perbaikan Aktif</h3>
            </div>
            <button
              onClick={() => setCurrentTab('repairs')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua Tiket ({workOrders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 divide-y divide-slate-100 flex flex-col justify-center">
            {activeRepairs.length === 0 ? (
              <div className="py-8 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-500 font-medium">Tidak ada tiket perbaikan aktif atau kerusakan dilaporkan.</p>
                <button
                  onClick={onOpenNewTicketModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Lapor Kerusakan Baru</span>
                </button>
              </div>
            ) : (
              activeRepairs.map(wo => {
                const priorityBadge = 
                  wo.priority === 'Darurat / Emergency' ? 'bg-red-500 text-white' :
                  wo.priority === 'Tinggi' ? 'bg-orange-100 text-orange-800' :
                  wo.priority === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700';

                return (
                  <div key={wo.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                            {wo.ticketNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityBadge}`}>
                            {wo.priority}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            Status: {wo.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{wo.issueTitle}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {wo.location} • Aset: <button onClick={() => onSelectAssetDetail(wo.assetId)} className="text-slate-700 font-semibold hover:text-amber-600 hover:underline">{wo.assetName}</button>
                        </p>

                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            Teknisi: <strong className="text-slate-700 font-medium">{wo.assignedTechnician}</strong>
                          </span>
                          {wo.sparePartsUsed.length > 0 && (
                            <span className="text-amber-700 font-medium bg-amber-50 px-1.5 py-0.2 rounded text-[10px]">
                              {wo.sparePartsUsed.length} Sparepart Gudang Dipakai
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] text-slate-400">{wo.reportedDate.split(' ')[0]}</span>
                        <button
                          onClick={() => setCurrentTab('repairs')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                        >
                          Kelola Tiket →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 5. Lower Row: Critical Inventory Alert & Live Activity Log Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (1 col): Stok Barang Siaga & Opname Alert */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Stok Kritis Menipis</h3>
            </div>
            <button
              onClick={() => setCurrentTab('inventory')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Kelola Stok →
            </button>
          </div>

          <div className="mt-3 flex-1 space-y-3">
            {stats.lowStockItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Seluruh stok barang operasional berada di atas batas minimum.
              </div>
            ) : (
              stats.lowStockItems.slice(0, 4).map(item => (
                <div key={item.id} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Sisa: <span className="font-bold text-red-600">{item.currentStock} {item.unit}</span> (Min: {item.minStock} {item.unit})
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{item.storageRack}</p>
                  </div>
                  <button
                    onClick={() => onOpenQuickOpnameModal(item)}
                    className="shrink-0 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Opname / Tambah
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (2 cols): Live Audit Activity Log */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Log Aktivitas & Jejak Audit (Real-Time)</h3>
                <p className="text-[11px] text-slate-400">Transparansi tindakan GA dan Teknisi sesuai perannya</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('logs')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
            >
              Lihat Audit Trail Lengkap →
            </button>
          </div>

          <div className="mt-3 flex-1 divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="py-2.5 flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {log.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                      {log.module}
                    </span>
                    <span className="font-semibold text-slate-700">{log.action}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

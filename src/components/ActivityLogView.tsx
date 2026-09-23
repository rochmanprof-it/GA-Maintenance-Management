import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  User, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ActivityLog, ActivityModule } from '../types';

interface ActivityLogViewProps {
  activityLogs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ activityLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<string>('ALL');

  const modules: ActivityModule[] = ['Aset', 'Jadwal Servis', 'Perbaikan', 'Stok Barang', 'Stok Opname', 'Sistem'];

  // Unique users from logs
  const distinctUsers = useMemo(() => {
    return Array.from(new Set(activityLogs.map(l => l.userName)));
  }, [activityLogs]);

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const matchSearch = searchQuery === '' ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchModule = selectedModule === 'ALL' || log.module === selectedModule;
      const matchUser = selectedUser === 'ALL' || log.userName === selectedUser;

      return matchSearch && matchModule && matchUser;
    });
  }, [activityLogs, searchQuery, selectedModule, selectedUser]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Waktu', 'Nama Pengguna', 'Peran / Jabatan', 'Modul', 'Tindakan', 'Detail Aktivitas'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit-Log-GA-Maintenance-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getBadgeStyle = (type: ActivityLog['badgeType']) => {
    switch (type) {
      case 'create':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'complete':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-200 font-bold';
      case 'status':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'delete':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Log Aktivitas & Jejak Audit (Audit Trail)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap keputusan GA, tindakan teknisi lapangan, pergantian sparepart, dan hasil stok opname secara transparan dan terverifikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cetak Berita Acara Audit"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Unduh data dalam format CSV untuk Excel"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV Audit</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata kunci tindakan, detail insiden, teknisi, atau modul..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">Semua Modul Sistem</option>
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="ALL">Semua Personel (GA / Teknisi)</option>
              {distinctUsers.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Log Feed Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Tidak ada catatan log aktivitas yang cocok dengan kriteria filter.
          </div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start justify-between gap-3">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* User Avatar Circle */}
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {log.userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">{log.userName}</span>
                    <span className="text-[11px] text-slate-500 font-normal">({log.userRole})</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(log.badgeType)}`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      Modul: {log.module}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>

              {/* Timestamp on right */}
              <div className="text-right text-[11px] text-slate-400 flex items-center gap-1 shrink-0 self-end sm:self-start">
                <Clock className="w-3.5 h-3.5 text-slate-300" />
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

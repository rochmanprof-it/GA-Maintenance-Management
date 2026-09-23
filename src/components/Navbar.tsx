import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Bell, 
  UserCircle2, 
  Calendar, 
  Wrench, 
  Package, 
  LayoutDashboard, 
  FileText, 
  Boxes, 
  Search, 
  CheckCheck, 
  AlertTriangle, 
  Clock, 
  ChevronDown,
  Download,
  RotateCcw,
  Users,
  UserPlus,
  Edit3
} from 'lucide-react';
import { ActiveUser, NotificationItem, FacilityProfile } from '../types';
import { TabKey } from '../state/useAppState';

interface NavbarProps {
  currentTab: TabKey;
  setCurrentTab: (tab: TabKey) => void;
  activeUser: ActiveUser;
  setActiveUser: (user: ActiveUser) => void;
  usersList: ActiveUser[];
  facilityProfile: FacilityProfile;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  onOpenNewTicketModal: () => void;
  onOpenNewScheduleModal: () => void;
  onOpenUserManagementModal: () => void;
  onOpenEditFacilityModal: () => void;
  onExportBackup: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeUser,
  setActiveUser,
  usersList,
  facilityProfile,
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  unreadNotificationsCount,
  globalSearch,
  setGlobalSearch,
  onOpenNewTicketModal,
  onOpenNewScheduleModal,
  onOpenUserManagementModal,
  onOpenEditFacilityModal,
  onExportBackup,
  onResetData
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'schedules', label: 'Jadwal Servis', icon: <Calendar className="w-4 h-4" /> },
    { key: 'assets', label: 'Data Aset & Riwayat', icon: <Boxes className="w-4 h-4" /> },
    { key: 'repairs', label: 'Pelacakan Perbaikan', icon: <Wrench className="w-4 h-4" /> },
    { key: 'inventory', label: 'Stok & Opname', icon: <Package className="w-4 h-4" /> },
    { key: 'logs', label: 'Log Aktivitas & Audit', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Building Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">{facilityProfile.buildingName}</span>
                {facilityProfile.towerUnit && (
                  <span className="text-xs bg-slate-800 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                    {facilityProfile.towerUnit}
                  </span>
                )}
                <button
                  id="btn-navbar-edit-facility"
                  onClick={onOpenEditFacilityModal}
                  className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit Data Gedung & Perusahaan"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{facilityProfile.companyName || 'Sistem GA & Pemeliharaan Gedung'}</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Cari aset, tiket, stok, jadwal..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/90 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Quick Action Buttons + Notifications + User Selector */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Action: New Ticket */}
            <button
              id="btn-quick-new-ticket"
              onClick={onOpenNewTicketModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Lapor Kerusakan Baru"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>+ Tiket Kerusakan</span>
            </button>

            {/* Quick Action: New Schedule */}
            <button
              id="btn-quick-new-schedule"
              onClick={onOpenNewScheduleModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Buat Jadwal Servis"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>+ Jadwal Servis</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors cursor-pointer"
                title="Pemberitahuan Sistem"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700/80 flex items-center justify-between bg-slate-850">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Pemberitahuan Otomatis</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3 h-3" /> Tandai Dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">Tidak ada pemberitahuan baru</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            setCurrentTab(n.targetTab);
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-left hover:bg-slate-700/50 transition-colors cursor-pointer flex gap-3 ${
                            !n.isRead ? 'bg-slate-750/70' : 'opacity-70'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'urgent' ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                            ) : n.type === 'warning' ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-100 flex items-center justify-between">
                              <span className="truncate">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal shrink-0 ml-1">{n.timestamp}</span>
                            </p>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                            <span className="inline-block mt-1 text-[10px] text-amber-400 font-medium">Buka menu →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Dropdown (GA Manager vs Senior Technician) */}
            <div className="relative" ref={userRef}>
              <button
                id="btn-active-user-toggle"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
                title="Ganti Profil Aktor (Simulasi Transparansi Audit)"
              >
                <div className="w-7 h-7 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                  {activeUser.avatar}
                </div>
                <div className="text-left hidden xl:block max-w-[140px]">
                  <p className="text-xs font-medium text-white truncate">{activeUser.name}</p>
                  <p className="text-[10px] text-amber-400 truncate">{activeUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl z-50 p-2">
                  <div className="px-3 py-2 border-b border-slate-700 text-[11px] text-slate-400">
                    Pilih Peran untuk Pencatatan Log Audit:
                  </div>
                  <div className="mt-1 space-y-1">
                    {usersList.map(u => (
                      <button
                        key={u.name}
                        onClick={() => {
                          setActiveUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          activeUser.name === u.name ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30' : 'text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span className="w-6 h-6 rounded bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center justify-center">
                          {u.avatar}
                        </span>
                        <div className="truncate">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-700 space-y-1">
                    <button
                      id="btn-open-edit-facility"
                      onClick={() => {
                        onOpenEditFacilityModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-amber-300 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Data Perusahaan & Gedung</span>
                    </button>
                    <button
                      id="btn-open-user-management"
                      onClick={() => {
                        onOpenUserManagementModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Kelola Personel (Tambah / Hapus)</span>
                    </button>
                    <button
                      onClick={() => {
                        onExportBackup();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cadangkan Data (JSON)</span>
                    </button>
                    <button
                      id="btn-trigger-reset-simulation"
                      onClick={() => {
                        onResetData();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Kosongkan & Reset Data Sistem</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-2 border-t border-slate-800">
          {navItems.map(item => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                id={`tab-btn-${item.key}`}
                onClick={() => setCurrentTab(item.key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

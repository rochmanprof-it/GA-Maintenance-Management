import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Check, 
  ShieldCheck, 
  X, 
  Phone, 
  Mail, 
  Briefcase, 
  Search,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { ActiveUser } from '../types';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: ActiveUser[];
  activeUser: ActiveUser;
  onSetActiveUser: (user: ActiveUser) => void;
  onAddUser: (userData: Omit<ActiveUser, 'id'> & { id?: string }) => void;
  onDeleteUser: (userIdOrName: string) => boolean;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  activeUser,
  onSetActiveUser,
  onAddUser,
  onDeleteUser
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [roleSelection, setRoleSelection] = useState('Teknisi Elektrikal & Genset');
  const [customRole, setCustomRole] = useState('');
  const [divisionSelection, setDivisionSelection] = useState('Engineering & Maintenance');
  const [customDivision, setCustomDivision] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customAvatar, setCustomAvatar] = useState('');
  const [setAsActiveImmediately, setSetAsActiveImmediately] = useState(true);

  if (!isOpen) return null;

  // Auto generate avatar initials when name changes
  const handleNameChange = (val: string) => {
    setNewName(val);
    const initials = val
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
    setCustomAvatar(initials || 'US');
  };

  const rolePresets = [
    'GA & Building Operations Manager',
    'Koordinator Teknisi ME',
    'Teknisi Elektrikal & Genset',
    'Teknisi HVAC & Chiller',
    'Teknisi Plumbing & Sanitasi',
    'Teknisi Mekanikal & Lift',
    'Staff Inventori & Logistik GA',
    'Spesialis K3 & Fire Protection',
    'Supervisor Facility Care',
    'Vendor Spesialis Rekanan',
    'Lainnya (Ketik Manual)'
  ];

  const divisionPresets = [
    'General Affairs Department',
    'Engineering & Maintenance',
    'HVAC Specialist',
    'General Affairs Team',
    'K3 & Safety Department',
    'Logistik & Pergudangan',
    'Lainnya (Ketik Manual)'
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const finalRole = roleSelection === 'Lainnya (Ketik Manual)' ? (customRole.trim() || 'Staff GA') : roleSelection;
    const finalDivision = divisionSelection === 'Lainnya (Ketik Manual)' ? (customDivision.trim() || 'General Affairs') : divisionSelection;
    const finalAvatar = customAvatar.trim().toUpperCase() || newName.slice(0, 2).toUpperCase();

    const newUser = onAddUser({
      name: newName.trim(),
      role: finalRole,
      division: finalDivision,
      avatar: finalAvatar,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined
    });

    if (setAsActiveImmediately && newUser) {
      onSetActiveUser(newUser);
    }

    // Reset form
    setNewName('');
    setCustomRole('');
    setCustomDivision('');
    setEmail('');
    setPhone('');
    setCustomAvatar('');
    setActiveTab('list');
  };

  const handleDelete = (u: ActiveUser) => {
    const key = u.id || u.name;
    const success = onDeleteUser(key);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      u.division.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Kelola Personel & Akun Pengguna</h3>
              <p className="text-[11px] text-slate-400">Manajemen akun tim GA, teknisi ME, dan pergantian persona aktif</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0">
          <button
            onClick={() => { setActiveTab('list'); setDeleteConfirmId(null); }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'list'
                ? 'border-amber-500 text-amber-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Pengguna Terdaftar ({users.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('add'); setDeleteConfirmId(null); }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'add'
                ? 'border-amber-500 text-amber-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Tambah Pengguna Baru</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1">
          
          {/* TAB 1: USER LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Search and stats bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama pengguna, peran, divisi..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Tambah User</span>
                </button>
              </div>

              {/* User cards */}
              <div className="space-y-2.5">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Tidak ada pengguna yang cocok dengan filter pencarian.
                  </div>
                ) : (
                  filteredUsers.map(u => {
                    const isActive = activeUser.name === u.name || (activeUser.id && u.id && activeUser.id === u.id);
                    const isDeleting = deleteConfirmId === (u.id || u.name);

                    return (
                      <div
                        key={u.id || u.name}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                              isActive
                                ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400/40'
                                : 'bg-slate-800 text-amber-400'
                            }`}>
                              {u.avatar || u.name.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-slate-900 truncate">{u.name}</span>
                                {isActive && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                                    <UserCheck className="w-3 h-3" />
                                    Profil Aktif
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-medium text-slate-600 mt-0.5">{u.role}</p>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3 h-3" />
                                  {u.division}
                                </span>
                                {u.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" />
                                    {u.email}
                                  </span>
                                )}
                                {u.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {u.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {!isActive && (
                              <button
                                onClick={() => onSetActiveUser(u)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                title="Pilih sebagai pengguna aktif saat ini"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Gunakan Profil</span>
                              </button>
                            )}

                            {/* Delete User Button & Inline Confirmation */}
                            {isDeleting ? (
                              <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg border border-red-200 animate-in fade-in">
                                <span className="text-[10px] font-bold text-red-700 px-1">Yakin hapus?</span>
                                <button
                                  onClick={() => handleDelete(u)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(u.id || u.name)}
                                disabled={users.length <= 1}
                                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                  users.length <= 1
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title={users.length <= 1 ? 'Minimal 1 pengguna harus tersisa' : 'Hapus pengguna ini'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ADD USER FORM */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Bambang Triatmojo, S.T. / Andi Setiawan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Peran / Jabatan Operasional *
                  </label>
                  <select
                    value={roleSelection}
                    onChange={(e) => setRoleSelection(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {rolePresets.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Departemen / Divisi *
                  </label>
                  <select
                    value={divisionSelection}
                    onChange={(e) => setDivisionSelection(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
                  >
                    {divisionPresets.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Role or Division if selected "Lainnya" */}
              {roleSelection === 'Lainnya (Ketik Manual)' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tulis Jabatan / Peran Kustom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Contoh: Auditor Eksternal K3, Koordinator BMS..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {divisionSelection === 'Lainnya (Ketik Manual)' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tulis Nama Departemen Kustom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customDivision}
                    onChange={(e) => setCustomDivision(e.target.value)}
                    placeholder="Contoh: Divisi Keamanan & Parkir..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Inisial Avatar (2 Huruf)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value.toUpperCase())}
                    placeholder="Contoh: BT"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-bold uppercase tracking-wider text-center"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Operasional
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@grahakencana.com"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Kontak / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Set as active immediately checkbox */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-2">
                <input
                  type="checkbox"
                  id="set-active-chk"
                  checked={setAsActiveImmediately}
                  onChange={(e) => setSetAsActiveImmediately(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="set-active-chk" className="font-semibold text-slate-800 cursor-pointer text-xs">
                  Langsung beralih dan gunakan pengguna ini sebagai profil aktif
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Kembali ke Daftar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Pengguna Baru</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Semua tindakan personel dicatat di Jejak Audit (Audit Trail).</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};

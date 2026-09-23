import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Calendar, 
  Boxes, 
  Package, 
  ClipboardCheck, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { 
  Asset, 
  AssetCategory, 
  AssetStatus, 
  MaintenanceSchedule, 
  ScheduleFrequency, 
  WorkOrder, 
  TicketPriority, 
  InventoryItem, 
  InventoryCategory,
  StockOpnameRecord,
  ActiveUser
} from '../types';

// ==========================================
// 1. NEW WORK ORDER (TIKET KERUSAKAN) MODAL
// ==========================================
interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  activeUser: ActiveUser;
  usersList?: ActiveUser[];
  preselectedAsset?: Asset | null;
  onSubmit: (data: Omit<WorkOrder, 'id' | 'ticketNumber' | 'actualCost'>) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  assets,
  activeUser,
  usersList,
  preselectedAsset,
  onSubmit
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState(preselectedAsset?.id || assets[0]?.id || '');
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Tinggi');
  const [location, setLocation] = useState(preselectedAsset ? `${preselectedAsset.location.building}, ${preselectedAsset.location.floor} (${preselectedAsset.location.room})` : '');
  const [assignedTechnician, setAssignedTechnician] = useState(usersList?.[1]?.name || 'Dedi Kurniawan');
  const [estimatedCost, setEstimatedCost] = useState<number>(300000);

  if (!isOpen) return null;

  const handleAssetChange = (assetId: string) => {
    setSelectedAssetId(assetId);
    const ast = assets.find(a => a.id === assetId);
    if (ast) {
      setLocation(`${ast.location.building}, ${ast.location.floor} (${ast.location.room})`);
      setAssignedTechnician(ast.picTechnician || 'Dedi Kurniawan');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ast = assets.find(a => a.id === selectedAssetId);
    if (!ast) return;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const reportedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    onSubmit({
      assetId: ast.id,
      assetName: ast.name,
      assetCode: ast.code,
      location: location || `${ast.location.building}, ${ast.location.floor}`,
      reportedBy: activeUser.name,
      reportedDate,
      issueTitle,
      issueDescription,
      priority,
      status: 'Ditugaskan',
      assignedTechnician,
      sparePartsUsed: [],
      estimatedCost: Number(estimatedCost) || 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            <h3 className="font-bold text-sm">Lapor Kerusakan & Buka Tiket Perbaikan Baru</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Aset Gedung Terkait *</label>
            <select
              value={selectedAssetId}
              onChange={(e) => handleAssetChange(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-medium"
              required
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.code}] {a.name} — {a.location.building} {a.location.floor}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tingkat Prioritas *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="Darurat / Emergency">Darurat / Emergency (Segera)</option>
                <option value="Tinggi">Tinggi (Resiko Operasional)</option>
                <option value="Sedang">Sedang (Standar)</option>
                <option value="Rendah">Rendah (Dapat Dijadwalkan)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teknisi Ditugaskan *</label>
              <select
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
              >
                {usersList && usersList.length > 0 ? (
                  <>
                    {usersList.map(u => (
                      <option key={u.name} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                    <option value="Vendor Spesialis Rekanan">Vendor Spesialis Rekanan</option>
                  </>
                ) : (
                  <>
                    <option value="Dedi Kurniawan">Dedi Kurniawan (Koordinator ME)</option>
                    <option value="Joko Prabowo">Joko Prabowo (Teknisi Elektrikal/Genset)</option>
                    <option value="Rahmat Hidayat">Rahmat Hidayat (Teknisi HVAC/Chiller)</option>
                    <option value="Hartono Suwandi, S.T.">Hartono Suwandi (GA Supervisor)</option>
                    <option value="Vendor Spesialis Rekanan">Vendor Spesialis Rekanan</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Judul Kendala / Gejala Kerusakan *</label>
            <input
              type="text"
              required
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              placeholder="Contoh: Chiller unit 1 alarm high pressure trip, elevator anjlok leveling..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Detail Masalah & Temuan *</label>
            <textarea
              required
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Jelaskan kondisi fisik, bunyi abnormal, indikator kode error, atau dampak ke penyewa..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi Kejadian Spesifik</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Gedung, lantai, ruangan..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Biaya Awal (Rp)</label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 font-bold"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800">
            Setelah tiket dibuka, sistem otomatis mengirim notifikasi darurat dan mencatat tindakan pada log audit.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Buka Tiket Perbaikan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 2. NEW SCHEDULE MODAL
// ==========================================
interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: Asset[];
  usersList?: ActiveUser[];
  onSubmit: (data: Omit<MaintenanceSchedule, 'id'>) => void;
}

export const NewScheduleModal: React.FC<NewScheduleModalProps> = ({
  isOpen,
  onClose,
  assets,
  usersList,
  onSubmit
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<ScheduleFrequency>('Bulanan');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [assignedTechnician, setAssignedTechnician] = useState(usersList?.[1]?.name || 'Dedi Kurniawan');
  const [durationHours, setDurationHours] = useState(3);
  const [checklistTasks, setChecklistTasks] = useState<string[]>([
    'Inspeksi visual fisik dan kebersihan unit',
    'Pemeriksaan tegangan & arus listrik operasional',
    'Pembersihan filter / saringan dan pelumasan bearing',
    'Uji coba running test dan pencatatan parameter standar'
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleAddChecklistTask = () => {
    if (!newTaskInput.trim()) return;
    setChecklistTasks([...checklistTasks, newTaskInput.trim()]);
    setNewTaskInput('');
  };

  const handleRemoveChecklistTask = (index: number) => {
    setChecklistTasks(checklistTasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ast = assets.find(a => a.id === selectedAssetId);
    if (!ast) return;

    onSubmit({
      title: title || `Servis Berkala ${ast.name}`,
      assetId: ast.id,
      assetName: ast.name,
      assetCode: ast.code,
      category: ast.category,
      frequency,
      scheduledDate,
      status: 'Terjadwal',
      assignedTechnician,
      estimatedDurationHours: Number(durationHours) || 2,
      checklist: checklistTasks.map((t, idx) => ({ id: `chk-${Date.now()}-${idx}`, task: t, completed: false })),
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-amber-500 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 font-bold" />
            <h3 className="font-bold text-sm">Buat Jadwal Servis & Pemeliharaan Preventif</h3>
          </div>
          <button onClick={onClose} className="text-slate-900 hover:text-black text-lg font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Aset yang Akan Diservis *</label>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              required
            >
              {assets.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.code}] {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama / Agenda Servis *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Overhaul Pompa Transfer, Servis Rutin Chiller Trane..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Frekuensi *</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as ScheduleFrequency)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="Mingguan">Mingguan</option>
                <option value="Bulanan">Bulanan</option>
                <option value="Triwulan">Triwulan (3 Bulan)</option>
                <option value="Semesteran">Semesteran (6 Bulan)</option>
                <option value="Tahunan">Tahunan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Eksekusi *</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Jam Kerja</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teknisi PIC Pelaksana *</label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            >
              {usersList && usersList.length > 0 ? (
                <>
                  {usersList.map(u => (
                    <option key={u.name} value={u.name}>{u.name} ({u.role})</option>
                  ))}
                  <option value="Vendor Spesialis Rekanan">Vendor Spesialis Rekanan</option>
                </>
              ) : (
                <>
                  <option value="Dedi Kurniawan">Dedi Kurniawan (Koordinator ME)</option>
                  <option value="Joko Prabowo">Joko Prabowo (Teknisi Elektrikal/Genset)</option>
                  <option value="Rahmat Hidayat">Rahmat Hidayat (Teknisi HVAC/Chiller)</option>
                  <option value="Hartono Suwandi, S.T.">Hartono Suwandi (GA Supervisor)</option>
                </>
              )}
            </select>
          </div>

          {/* Checklist task list */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Daftar Langkah Kerja Checklist Prosedur (SOP)</label>
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {checklistTasks.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded border border-slate-200">
                  <span className="truncate">{idx + 1}. {t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistTask(idx)}
                    className="text-red-500 hover:text-red-700 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Tambahkan item prosedur inspeksi..."
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistTask}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg font-bold"
              >
                + Tambah
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Instruksi Khusus / Izin Kerja (PTW)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Matikan breaker utama, gunakan APD lengkap, koordinasikan dengan security..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Simpan Jadwal Servis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 3. NEW ASSET MODAL
// ==========================================
interface NewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersList?: ActiveUser[];
  onSubmit: (data: Omit<Asset, 'id'>) => void;
}

export const NewAssetModal: React.FC<NewAssetModalProps> = ({
  isOpen,
  onClose,
  usersList,
  onSubmit
}) => {
  const [code, setCode] = useState(`AST-NEW-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('HVAC & Pendingin');
  const [building, setBuilding] = useState('Tower A');
  const [floor, setFloor] = useState('Lantai 3');
  const [room, setRoom] = useState('Ruang AHU');
  const [brandModel, setBrandModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installDate, setInstallDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<AssetStatus>('Kondisi Baik');
  const [picTechnician, setPicTechnician] = useState(usersList?.[1]?.name || 'Dedi Kurniawan');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      code,
      name,
      category,
      location: { building, floor, room },
      brandModel: brandModel || '-',
      serialNumber: serialNumber || '-',
      installDate,
      status,
      lastServiceDate: installDate,
      nextServiceDate: '',
      picTechnician,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Registrasi Aset Mesin & Utilitas Gedung Baru</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Aset / Tag *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Fasilitas *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              >
                <option value="HVAC & Pendingin">HVAC & Pendingin</option>
                <option value="Kelistrikan & Panel">Kelistrikan & Panel</option>
                <option value="Plumbing & Pompa">Plumbing & Pompa</option>
                <option value="Mekanikal & Lift">Mekanikal & Lift</option>
                <option value="K3 & Fire Protection">K3 & Fire Protection</option>
                <option value="Sipil & Gedung">Sipil & Gedung</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Aset *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Chiller Water Cooled 350 TR Unit 2, Sub-Panel Lantai 12..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gedung *</label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lantai *</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ruangan / Zona *</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Merk / Model Mesin</label>
              <input
                type="text"
                value={brandModel}
                onChange={(e) => setBrandModel(e.target.value)}
                placeholder="Contoh: Daikin VRV IV-S, Perkins..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Seri Pabrik (Serial Number)</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Contoh: SN-8899201"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Pasang</label>
              <input
                type="date"
                value={installDate}
                onChange={(e) => setInstallDate(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kondisi Awal</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Kondisi Baik">Kondisi Baik</option>
                <option value="Perlu Perawatan">Perlu Perawatan</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Dalam Perbaikan">Dalam Perbaikan</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teknisi PIC</label>
              <select
                value={picTechnician}
                onChange={(e) => setPicTechnician(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {usersList && usersList.length > 0 ? (
                  usersList.map(u => (
                    <option key={u.name} value={u.name}>{u.name} ({u.role})</option>
                  ))
                ) : (
                  <>
                    <option value="Dedi Kurniawan">Dedi Kurniawan</option>
                    <option value="Joko Prabowo">Joko Prabowo</option>
                    <option value="Rahmat Hidayat">Rahmat Hidayat</option>
                    <option value="Hartono Suwandi, S.T.">Hartono Suwandi</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan GA</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Spesifikasi kapasitas, cakupan area suplai, dokumen manual..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Simpan Data Aset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 4. NEW INVENTORY ITEM MODAL
// ==========================================
interface NewInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
}

export const NewInventoryItemModal: React.FC<NewInventoryItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [code, setCode] = useState(`MTR-GA-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Kelistrikan');
  const [currentStock, setCurrentStock] = useState(20);
  const [minStock, setMinStock] = useState(10);
  const [unit, setUnit] = useState('Pcs');
  const [unitPrice, setUnitPrice] = useState(75000);
  const [storageRack, setStorageRack] = useState('Rak A-01 Gudang Logistik B1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    onSubmit({
      code,
      name,
      category,
      currentStock: Number(currentStock) || 0,
      minStock: Number(minStock) || 0,
      unit,
      unitPrice: Number(unitPrice) || 0,
      storageRack,
      lastOpnameDate: now
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Registrasi Barang / Suku Cadang Baru</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kode Barang (SKU) *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Barang / Material *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Bohlam LED Philips 18W, Pipa PVC Rucika 1 inch..."
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Kelistrikan">Kelistrikan</option>
                <option value="Plumbing & Sanitasi">Plumbing & Sanitasi</option>
                <option value="HVAC & Filter">HVAC & Filter</option>
                <option value="Mekanikal & Alat">Mekanikal & Alat</option>
                <option value="K3 & Safety">K3 & Safety</option>
                <option value="Material Sipil">Material Sipil</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Satuan Unit *</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Pcs, Roll, Meter, Set, Box..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Stok Awal Fisik *</label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Batas Minimum Peringatan *</label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimasi Harga Satuan (Rp)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Lokasi Rak Penyimpanan</label>
              <input
                type="text"
                value={storageRack}
                onChange={(e) => setStorageRack(e.target.value)}
                placeholder="Rak A-02 Gudang GA B1..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer"
            >
              Daftarkan Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 5. QUICK OPNAME MODAL (STOK OPNAME FISIK)
// ==========================================
interface QuickOpnameModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  preselectedItem?: InventoryItem | null;
  onSubmit: (record: Omit<StockOpnameRecord, 'id' | 'date' | 'status' | 'conductedBy'>) => void;
}

export const QuickOpnameModal: React.FC<QuickOpnameModalProps> = ({
  isOpen,
  onClose,
  inventory,
  preselectedItem,
  onSubmit
}) => {
  const [selectedItemId, setSelectedItemId] = useState(preselectedItem?.id || inventory[0]?.id || '');
  const [physicalCount, setPhysicalCount] = useState<number>(preselectedItem ? preselectedItem.currentStock : (inventory[0]?.currentStock || 0));
  const [discrepancyReason, setDiscrepancyReason] = useState('');

  if (!isOpen) return null;

  const currentItem = inventory.find(i => i.id === selectedItemId) || inventory[0];
  const systemStock = currentItem?.currentStock || 0;
  const discrepancy = physicalCount - systemStock;

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    const itm = inventory.find(i => i.id === id);
    if (itm) {
      setPhysicalCount(itm.currentStock);
      setDiscrepancyReason('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    onSubmit({
      itemId: currentItem.id,
      itemCode: currentItem.code,
      itemName: currentItem.name,
      systemStock,
      physicalStock: physicalCount,
      discrepancy,
      reason: discrepancyReason || (discrepancy === 0 ? 'Stok cocok dan sesuai' : 'Penyesuaian stok opname fisik rutin')
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Eksekusi Stok Opname Fisik Gudang</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Barang yang Dihitung Fisik *</label>
            <select
              value={selectedItemId}
              onChange={(e) => handleItemSelect(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id}>
                  [{item.code}] {item.name} — Stok Sistem: {item.currentStock} {item.unit}
                </option>
              ))}
            </select>
          </div>

          {/* Comparison Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Stok Sistem</span>
              <p className="text-xl font-bold text-slate-800 mt-1">{systemStock} {currentItem?.unit}</p>
            </div>

            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selisih (Discrepancy)</span>
              <p className={`text-xl font-black mt-1 ${discrepancy === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {discrepancy > 0 ? `+${discrepancy}` : discrepancy} {currentItem?.unit}
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Hasil Perhitungan Fisik Aktual di Rak *</label>
            <input
              type="number"
              min="0"
              required
              value={physicalCount}
              onChange={(e) => setPhysicalCount(Number(e.target.value))}
              className="w-full p-2.5 bg-amber-50/60 border border-amber-300 rounded-lg text-lg font-black text-center text-slate-900 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1 text-center">
              Lokasi Rak: <strong>{currentItem?.storageRack}</strong>
            </p>
          </div>

          {discrepancy !== 0 && (
            <div className="space-y-1">
              <label className="block font-bold text-red-700">
                Alasan Selisih / Discrepancy (Wajib untuk Audit):
              </label>
              <textarea
                required
                rows={2}
                value={discrepancyReason}
                onChange={(e) => setDiscrepancyReason(e.target.value)}
                placeholder="Contoh: Barang rusak saat pengerjaan darurat tanpa nota cepat, terpakai servis pompa..."
                className="w-full p-2 bg-red-50/40 border border-red-200 rounded-lg text-xs"
              />
            </div>
          )}

          <div className="p-3 bg-slate-100 rounded-lg text-[11px] text-slate-600">
            Mengklik simpan akan secara otomatis menyesuaikan stok sistem ke angka fisik ({physicalCount} {currentItem?.unit}) dan mencatat Berita Acara Opname pada Jejak Audit.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg cursor-pointer"
            >
              Konfirmasi & Sesuaikan Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// 6. SPARE PART ALLOCATION MODAL (UNTUK TIKET WO)
// ==========================================
interface SparePartPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  inventory: InventoryItem[];
  onUseSparePart: (workOrderId: string, inventoryItemId: string, qty: number) => boolean;
}

export const SparePartPickerModal: React.FC<SparePartPickerModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  inventory,
  onUseSparePart
}) => {
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !workOrder) return null;

  const currentItem = inventory.find(i => i.id === selectedItemId) || inventory[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    const success = onUseSparePart(workOrder.id, currentItem.id, quantity);
    if (success) {
      onClose();
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm">Ambil Suku Cadang dari Gudang</h3>
            <p className="text-[11px] text-amber-400">Tiket #{workOrder.ticketNumber} — {workOrder.assetName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Item dari Gudang Operasional *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
            >
              {inventory.map(item => (
                <option key={item.id} value={item.id} disabled={item.currentStock <= 0}>
                  [{item.code}] {item.name} (Tersedia: {item.currentStock} {item.unit}) - {formatIDR(item.unitPrice)}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-slate-400 block text-[10px]">Stok Tersedia Saat Ini:</span>
              <strong className="text-slate-900 font-bold text-sm">{currentItem?.currentStock} {currentItem?.unit}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Harga Satuan:</span>
              <strong className="text-slate-900 font-bold">{formatIDR(currentItem?.unitPrice || 0)}</strong>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jumlah yang Digunakan *</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={currentItem?.currentStock || 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-32 p-2 bg-white border border-slate-300 rounded-lg font-bold text-center text-sm"
              />
              <span className="text-xs font-medium text-slate-600">{currentItem?.unit}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs flex justify-between items-center text-amber-900">
            <span>Total Nilai Suku Cadang:</span>
            <strong className="text-base font-black">{formatIDR((currentItem?.unitPrice || 0) * quantity)}</strong>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!currentItem || currentItem.currentStock <= 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg cursor-pointer shadow-sm"
            >
              Keluarkan & Alokasikan ke Tiket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

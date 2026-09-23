import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ClipboardCheck, 
  ArrowDownUp, 
  MapPin, 
  RotateCw, 
  FileText,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { InventoryItem, InventoryCategory, StockOpnameRecord } from '../types';

interface InventoryStockOpnameViewProps {
  inventory: InventoryItem[];
  opnameRecords: StockOpnameRecord[];
  onOpenNewItemModal: () => void;
  onAdjustStock: (id: string, delta: number, note: string) => void;
  onSubmitOpname: (record: Omit<StockOpnameRecord, 'id' | 'date' | 'status' | 'conductedBy'>) => void;
  onOpenQuickOpnameModal: (item?: InventoryItem) => void;
}

export const InventoryStockOpnameView: React.FC<InventoryStockOpnameViewProps> = ({
  inventory,
  opnameRecords,
  onOpenNewItemModal,
  onAdjustStock,
  onSubmitOpname,
  onOpenQuickOpnameModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'opname' | 'history'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Quick adjust modal state
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustNote, setAdjustNote] = useState<string>('');

  const categories: InventoryCategory[] = [
    'Kelistrikan',
    'Plumbing & Sanitasi',
    'HVAC & Filter',
    'Mekanikal & Alat',
    'K3 & Safety',
    'Material Sipil'
  ];

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.storageRack.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchLowStock = !showLowStockOnly || item.currentStock <= item.minStock;

      return matchSearch && matchCategory && matchLowStock;
    });
  }, [inventory, searchQuery, selectedCategory, showLowStockOnly]);

  const lowStockCount = inventory.filter(i => i.currentStock <= i.minStock).length;
  const totalValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.unitPrice), 0);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Manajemen Stok & Opname Barang Pendukung Operasional</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring inventaris spare part, material consumable ME, peringatan stok kritis, dan pencatatan stok opname berkala.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenQuickOpnameModal()}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <span>+ Form Stok Opname</span>
          </button>
          <button
            id="btn-add-inventory-item"
            onClick={onOpenNewItemModal}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrasi Barang</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Item Logistik</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{inventory.length} Jenis Barang</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Peringatan Stok Menipis</span>
            <p className="text-xl font-bold text-red-600 mt-0.5">{lowStockCount} Item &le; Minimum</p>
          </div>
          <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Valuasi Stok Tersedia</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{formatIDR(totalValue)}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'inventory' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Katalog Stok Gudang ({inventory.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'history' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Riwayat & Rekap Stok Opname ({opnameRecords.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: KATALOG STOK */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kode barang, nama barang, rak penyimpanan..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="w-full md:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="ALL">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-colors ${
                showLowStockOnly 
                  ? 'bg-red-50 border-red-300 text-red-700 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Hanya Stok Kritis ({lowStockCount})</span>
            </button>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">Kode & Nama Barang</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Stok Saat Ini</th>
                    <th className="p-3.5">Batas Minimum</th>
                    <th className="p-3.5">Harga Satuan</th>
                    <th className="p-3.5">Lokasi Rak</th>
                    <th className="p-3.5">Opname Terakhir</th>
                    <th className="p-3.5 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-500">
                        <div className="max-w-sm mx-auto space-y-3">
                          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
                            <Package className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">Gudang Masih Kosong</h4>
                          <p className="text-xs text-slate-500">
                            {searchQuery || selectedCategory !== 'ALL'
                              ? 'Tidak ada barang yang cocok dengan filter pencarian.'
                              : 'Belum ada stok barang pendukung operasional gedung (oli genset, freon, lampu LED, MCB, filter AHU, seal pipa).'}
                          </p>
                          <button
                            onClick={onOpenNewItemModal}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            <span>+ Tambah Barang Baru</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map(item => {
                      const isLow = item.currentStock <= item.minStock;

                      return (
                        <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                          <td className="p-3.5">
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.code}
                            </span>
                            <div className="font-bold text-slate-900 mt-0.5">{item.name}</div>
                          </td>
                          <td className="p-3.5 font-medium">{item.category}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 font-bold text-sm px-2 py-0.5 rounded ${
                              isLow ? 'bg-red-100 text-red-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isLow && (
                              <span className="block text-[10px] font-semibold text-red-600 mt-0.5">
                                Kritis (Restock!)
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-500 font-medium">
                            {item.minStock} {item.unit}
                          </td>
                          <td className="p-3.5 font-semibold text-slate-800">
                            {formatIDR(item.unitPrice)}
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.storageRack}
                            </span>
                          </td>
                          <td className="p-3.5 text-[11px] text-slate-500">
                            {item.lastOpnameDate}
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <button
                              onClick={() => {
                                setAdjustingItem(item);
                                setAdjustQty(0);
                                setAdjustNote('');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-[11px] transition-colors cursor-pointer"
                              title="Tambah/Kurang Stok Masuk/Keluar"
                            >
                              Mutasi (+/-)
                            </button>
                            <button
                              onClick={() => onOpenQuickOpnameModal(item)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
                              title="Lakukan Stok Opname Fisik Sekarang"
                            >
                              Opname
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: RIWAYAT & REKAP STOK OPNAME */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Rekap Audit Hasil Stok Opname Fisik</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Catatan perbedaan stok sistem dengan stok riil di gudang serta pertanggungjawaban alasan selisih.
              </p>
            </div>
            <button
              onClick={() => onOpenQuickOpnameModal()}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>+ Input Opname Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3">Tanggal Opname</th>
                  <th className="p-3">Kode & Nama Barang</th>
                  <th className="p-3">Stok Sistem</th>
                  <th className="p-3">Stok Fisik Aktual</th>
                  <th className="p-3">Selisih (Discrepancy)</th>
                  <th className="p-3">Alasan Selisih & Keterangan</th>
                  <th className="p-3">Pelaksana Opname</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {opnameRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400">
                      Belum ada riwayat pelaksanaan stok opname fisik.
                    </td>
                  </tr>
                ) : (
                  opnameRecords.map(rec => {
                    const isDiff = rec.discrepancy !== 0;

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-semibold text-slate-800">{rec.date}</td>
                        <td className="p-3">
                          <span className="font-mono text-[10px] text-slate-500 font-bold">{rec.itemCode}</span>
                          <div className="font-bold text-slate-900">{rec.itemName}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{rec.systemStock}</td>
                        <td className="p-3 font-bold text-slate-900">{rec.physicalStock}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            rec.discrepancy === 0 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rec.discrepancy > 0 ? `+${rec.discrepancy}` : rec.discrepancy}
                          </span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-600 max-w-xs leading-relaxed">
                          {rec.reason || 'Sesuai / Tidak ada selisih'}
                        </td>
                        <td className="p-3 font-medium text-slate-800">{rec.conductedBy}</td>
                        <td className="p-3">
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ADJUSTMENT MODAL (MUTASI STOK MASUK / KELUAR) */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Mutasi Stok Gudang (In / Out)</h3>
                <p className="text-xs text-slate-500">{adjustingItem.name} ({adjustingItem.code})</p>
              </div>
              <button onClick={() => setAdjustingItem(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs flex justify-between">
              <span>Stok Saat Ini:</span>
              <strong className="text-slate-900 font-bold">{adjustingItem.currentStock} {adjustingItem.unit}</strong>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah Penambahan (+) atau Pengurangan (-) :
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustQty(prev => prev - 1)}
                    className="w-8 h-8 rounded bg-slate-200 text-slate-700 font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                    className="flex-1 py-1.5 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustQty(prev => prev + 1)}
                    className="w-8 h-8 rounded bg-slate-200 text-slate-700 font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-500 font-medium">{adjustingItem.unit}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hasil stok baru: <strong>{Math.max(0, adjustingItem.currentStock + adjustQty)} {adjustingItem.unit}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alasan Mutasi / Catatan:
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Contoh: Penerimaan PO #PO-9921 dari supplier, retur barang..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setAdjustingItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (adjustQty !== 0) {
                    onAdjustStock(adjustingItem.id, adjustQty, adjustNote || 'Mutasi stok operasional');
                  }
                  setAdjustingItem(null);
                }}
                disabled={adjustQty === 0}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg disabled:opacity-50 cursor-pointer"
              >
                Simpan Mutasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

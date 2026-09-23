export type AssetStatus = 
  | 'Kondisi Baik' 
  | 'Perlu Perawatan' 
  | 'Rusak Ringan' 
  | 'Rusak Kritis' 
  | 'Dalam Perbaikan';

export type AssetCategory = 
  | 'HVAC & Pendingin' 
  | 'Kelistrikan & Panel' 
  | 'Plumbing & Pompa' 
  | 'Mekanikal & Lift' 
  | 'K3 & Fire Protection' 
  | 'Sipil & Gedung';

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  location: {
    building: string;
    floor: string;
    room: string;
  };
  brandModel: string;
  serialNumber: string;
  installDate: string;
  status: AssetStatus;
  lastServiceDate: string;
  nextServiceDate: string;
  picTechnician: string;
  notes: string;
}

export type ScheduleFrequency = 'Mingguan' | 'Bulanan' | 'Triwulan' | 'Semesteran' | 'Tahunan';

export type ScheduleStatus = 
  | 'Terjadwal' 
  | 'Menjelang Jatuh Tempo' 
  | 'Terlambat / Overdue' 
  | 'Sedang Dikerjakan' 
  | 'Selesai';

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface MaintenanceSchedule {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  category: AssetCategory;
  frequency: ScheduleFrequency;
  scheduledDate: string;
  completedDate?: string;
  status: ScheduleStatus;
  assignedTechnician: string;
  estimatedDurationHours: number;
  checklist: ChecklistItem[];
  notes?: string;
}

export type TicketPriority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Darurat / Emergency';

export type TicketStatus = 
  | 'Menunggu Validasi' 
  | 'Ditugaskan' 
  | 'Sedang Dikerjakan' 
  | 'Menunggu Sparepart' 
  | 'Selesai' 
  | 'Dibatalkan';

export interface SparePartUsage {
  itemId: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface WorkOrder {
  id: string;
  ticketNumber: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  location: string;
  reportedBy: string;
  reportedDate: string;
  issueTitle: string;
  issueDescription: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTechnician: string;
  completionDate?: string;
  resolutionNotes?: string;
  sparePartsUsed: SparePartUsage[];
  estimatedCost: number;
  actualCost: number;
}

export type InventoryCategory = 
  | 'Kelistrikan' 
  | 'Plumbing & Sanitasi' 
  | 'HVAC & Filter' 
  | 'Mekanikal & Alat' 
  | 'K3 & Safety' 
  | 'Material Sipil';

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: InventoryCategory;
  currentStock: number;
  minStock: number;
  unit: string;
  unitPrice: number;
  storageRack: string;
  lastOpnameDate: string;
  lastUpdated: string;
}

export interface StockOpnameRecord {
  id: string;
  date: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  systemStock: number;
  physicalStock: number;
  discrepancy: number; // physicalStock - systemStock
  reason: string;
  conductedBy: string;
  status: 'Tercatat' | 'Disesuaikan';
}

export type ActivityModule = 'Aset' | 'Jadwal Servis' | 'Perbaikan' | 'Stok Barang' | 'Stok Opname' | 'Sistem';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: ActivityModule;
  details: string;
  badgeType: 'create' | 'update' | 'delete' | 'status' | 'alert' | 'complete';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  targetTab: 'dashboard' | 'schedules' | 'repairs' | 'inventory' | 'assets' | 'logs';
  isRead: boolean;
}

export interface ActiveUser {
  id?: string;
  name: string;
  role: string;
  division: string;
  avatar: string;
  email?: string;
  phone?: string;
}

export interface FacilityProfile {
  companyName: string;
  buildingName: string;
  towerUnit: string;
  address: string;
  floorsCount: string;
  auditStandard: string;
  technicianHotline: string;
  opsOffice: string;
}


import { 
  Asset, 
  MaintenanceSchedule, 
  WorkOrder, 
  InventoryItem, 
  StockOpnameRecord, 
  ActivityLog, 
  NotificationItem,
  ActiveUser,
  FacilityProfile
} from './types';

export const INITIAL_USERS: ActiveUser[] = [
  {
    id: 'usr-rochman',
    name: 'Fatchur Rochman',
    role: 'GA & Building Maintenance Manager',
    division: 'General Affairs Department',
    avatar: 'FR',
    email: 'rochmanprof@gmail.com',
    phone: '0812-3456-7890'
  }
];

export const INITIAL_FACILITY_PROFILE: FacilityProfile = {
  companyName: 'PT Graha Solusi Propertindo',
  buildingName: 'Menara Graha Kencana',
  towerUnit: 'Tower A & B',
  address: 'Kawasan Bisnis Sudirman, Jakarta Pusat',
  floorsCount: '18 Lantai, 2 Basement',
  auditStandard: 'Standar Manajemen Fasilitas ISO 55001',
  technicianHotline: 'Ext. 2101 / 2102',
  opsOffice: 'Ruang Operasional GA & ME Lt. B1'
};

// Clean empty state data for fresh operational deployment
export const INITIAL_ASSETS: Asset[] = [];

export const INITIAL_SCHEDULES: MaintenanceSchedule[] = [];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_OPNAME_RECORDS: StockOpnameRecord[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-sys-init',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userName: 'Fatchur Rochman',
    userRole: 'GA & Building Maintenance Manager',
    action: 'Inisialisasi Sistem Bersih',
    module: 'Sistem',
    details: 'Database sistem GA & Building Maintenance diinisialisasi dalam kondisi bersih (kosongan) siap untuk input data operasional riil.',
    badgeType: 'complete'
  }
];

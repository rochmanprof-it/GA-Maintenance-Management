import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Asset,
  MaintenanceSchedule,
  WorkOrder,
  InventoryItem,
  StockOpnameRecord,
  ActivityLog,
  NotificationItem,
  ActiveUser,
  ScheduleStatus,
  TicketStatus,
  FacilityProfile
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_OPNAME_RECORDS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_FACILITY_PROFILE
} from '../mockData';

// Migrate / clear old simulation v1 keys so user gets clean empty state immediately
if (typeof window !== 'undefined') {
  try {
    const isCleaned = localStorage.getItem('ga_clean_state_v2_ready');
    if (!isCleaned) {
      [
        'ga_building_assets_v1',
        'ga_building_schedules_v1',
        'ga_building_work_orders_v1',
        'ga_building_inventory_v1',
        'ga_building_opname_v1',
        'ga_building_logs_v1',
        'ga_building_notifications_v1',
        'ga_building_user_v1',
        'ga_building_users_v1'
      ].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('ga_clean_state_v2_ready', 'true');
    }
  } catch (e) {
    console.error(e);
  }
}

const STORAGE_KEYS = {
  ASSETS: 'ga_building_assets_v2',
  SCHEDULES: 'ga_building_schedules_v2',
  WORK_ORDERS: 'ga_building_work_orders_v2',
  INVENTORY: 'ga_building_inventory_v2',
  OPNAME: 'ga_building_opname_v2',
  LOGS: 'ga_building_logs_v2',
  NOTIFICATIONS: 'ga_building_notifications_v2',
  USER: 'ga_building_user_v2',
  USERS: 'ga_building_users_v2',
  PROFILE: 'ga_building_profile_v2'
};

export type TabKey = 'dashboard' | 'schedules' | 'assets' | 'repairs' | 'inventory' | 'logs';

export function useAppState() {
  // Facility / Company Profile State
  const [facilityProfile, setFacilityProfile] = useState<FacilityProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_FACILITY_PROFILE;
  });

  // Users List State
  const [usersList, setUsersList] = useState<ActiveUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  // Active User Persona
  const [activeUser, setActiveUser] = useState<ActiveUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS[0];
  });

  // Current navigation tab
  const [currentTab, setCurrentTab] = useState<TabKey>('dashboard');

  // Selected asset ID for opening detailed history modal
  const [selectedAssetDetailId, setSelectedAssetDetailId] = useState<string | null>(null);

  // Search query across current views
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // 1. Assets State
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ASSETS;
  });

  // 2. Schedules State
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SCHEDULES;
  });

  // 3. Work Orders (Perbaikan) State
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORK_ORDERS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_WORK_ORDERS;
  });

  // 4. Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_INVENTORY;
  });

  // 5. Stock Opname Records
  const [opnameRecords, setOpnameRecords] = useState<StockOpnameRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPNAME);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_OPNAME_RECORDS;
  });

  // 6. Activity Logs (Audit Trail)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Auto-sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(activeUser));
  }, [activeUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPNAME, JSON.stringify(opnameRecords));
  }, [opnameRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersList));
  }, [usersList]);

  // Helper to format ISO timestamp to Indonesian format
  const getFormattedNow = () => {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Log Activity Helper
  const logAction = useCallback((
    action: string,
    module: ActivityLog['module'],
    details: string,
    badgeType: ActivityLog['badgeType'] = 'update'
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: getFormattedNow(),
      userName: activeUser.name,
      userRole: activeUser.role,
      action,
      module,
      details,
      badgeType
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [activeUser]);

  // Notification Generator Helper
  const pushNotification = useCallback((
    title: string,
    message: string,
    type: NotificationItem['type'],
    targetTab: NotificationItem['targetTab']
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Baru saja',
      type,
      targetTab,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // 0. User Management Methods
  const addUser = (userData: Omit<ActiveUser, 'id'> & { id?: string }) => {
    const id = userData.id || `usr-${Date.now()}`;
    const avatar = userData.avatar?.trim() || userData.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
    const newUser: ActiveUser = {
      ...userData,
      id,
      avatar
    };
    setUsersList(prev => [...prev, newUser]);
    logAction('Penambahan Pengguna Baru', 'Sistem', `Menambahkan personel operasional baru: ${newUser.name} (${newUser.role} - ${newUser.division})`, 'create');
    pushNotification(
      'Personel Baru Ditambahkan',
      `${newUser.name} berhasil didaftarkan sebagai ${newUser.role}.`,
      'success',
      'logs'
    );
    return newUser;
  };

  const deleteUser = (userIdOrName: string) => {
    const target = usersList.find(u => (u.id && u.id === userIdOrName) || u.name === userIdOrName);
    if (!target) return false;

    if (usersList.length <= 1) {
      pushNotification('Gagal Menghapus', 'Minimal harus ada 1 pengguna di dalam sistem.', 'warning', 'logs');
      return false;
    }

    const targetId = target.id;
    const targetName = target.name;
    const updatedList = usersList.filter(u => (targetId && u.id ? u.id !== targetId : u.name !== targetName));
    setUsersList(updatedList);

    // If deleting the currently active user, switch active user to first user in remaining list
    if (activeUser.name === targetName || (activeUser.id && targetId && activeUser.id === targetId)) {
      setActiveUser(updatedList[0]);
    }

    logAction('Penghapusan Pengguna', 'Sistem', `Menghapus user/personel ${targetName} (${target.role}) dari sistem operasional`, 'delete');
    pushNotification(
      'Pengguna Berhasil Dihapus',
      `${targetName} telah dihapus dari daftar akun operasional gedung.`,
      'info',
      'logs'
    );
    return true;
  };

  // 1. Asset Methods
  const addAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`
    };
    setAssets(prev => [newAsset, ...prev]);
    logAction('Penambahan Aset Baru', 'Aset', `Menambahkan aset ${newAsset.name} (${newAsset.code}) di ${newAsset.location.building} ${newAsset.location.floor}`, 'create');
  };

  const updateAsset = (id: string, assetData: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...assetData } : a));
    const target = assets.find(a => a.id === id);
    logAction('Pembaruan Data Aset', 'Aset', `Memperbarui data dan spesifikasi aset ${target?.name || id}`, 'update');
  };

  const deleteAsset = (id: string) => {
    const target = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(a => a.id !== id));
    logAction('Penghapusan Aset', 'Aset', `Menghapus aset ${target?.name || id} dari sistem registri`, 'delete');
  };

  // 2. Schedule Methods
  const addSchedule = (scheduleData: Omit<MaintenanceSchedule, 'id'>) => {
    const newSchedule: MaintenanceSchedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`
    };
    setSchedules(prev => [newSchedule, ...prev]);
    logAction('Penyusunan Jadwal Servis', 'Jadwal Servis', `Membuat jadwal pemeliharaan baru: "${newSchedule.title}" untuk aset ${newSchedule.assetName} pada ${newSchedule.scheduledDate}`, 'create');
    
    // Check if scheduled date is upcoming (within 3 days)
    pushNotification(
      'Jadwal Servis Didaftarkan',
      `Jadwal pemeliharaan "${newSchedule.title}" dijadwalkan pada ${newSchedule.scheduledDate}.`,
      'info',
      'schedules'
    );
  };

  const updateSchedule = (id: string, updates: Partial<MaintenanceSchedule>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    const target = schedules.find(s => s.id === id);
    logAction('Perubahan Jadwal Servis', 'Jadwal Servis', `Memperbarui detail jadwal servis ${target?.title}`, 'update');
  };

  const toggleChecklistItem = (scheduleId: string, checklistId: string) => {
    setSchedules(prev => prev.map(s => {
      if (s.id !== scheduleId) return s;
      const updatedChecklist = s.checklist.map(item => 
        item.id === checklistId ? { ...item, completed: !item.completed } : item
      );
      return { ...s, checklist: updatedChecklist };
    }));
  };

  const completeSchedule = (id: string, notes?: string) => {
    const now = getFormattedNow().split(' ')[0];
    setSchedules(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'Selesai',
        completedDate: now,
        notes: notes ? `${s.notes || ''} [Selesai: ${notes}]` : s.notes,
        checklist: s.checklist.map(c => ({ ...c, completed: true }))
      };
    }));

    const target = schedules.find(s => s.id === id);
    if (target) {
      // Update asset's lastServiceDate and calculate next service date
      setAssets(prev => prev.map(a => {
        if (a.id === target.assetId) {
          return {
            ...a,
            status: 'Kondisi Baik',
            lastServiceDate: now
          };
        }
        return a;
      }));

      logAction('Penyelesaian Servis Pemeliharaan', 'Jadwal Servis', `Menyelesaikan seluruh checklist inspeksi untuk "${target.title}" pada aset ${target.assetName}`, 'complete');
      pushNotification('Servis Pemeliharaan Berhasil Selesai', `Servis untuk ${target.assetName} telah diselesaikan oleh ${activeUser.name}.`, 'success', 'schedules');
    }
  };

  // 3. Work Order (Perbaikan) Methods
  const addWorkOrder = (woData: Omit<WorkOrder, 'id' | 'ticketNumber' | 'actualCost'>) => {
    const ticketNumber = `WO-2026-${String(workOrders.length + 91).padStart(3, '0')}`;
    const newWO: WorkOrder = {
      ...woData,
      id: `wo-${Date.now()}`,
      ticketNumber,
      actualCost: 0
    };
    setWorkOrders(prev => [newWO, ...prev]);

    // Update asset condition to 'Dalam Perbaikan' or 'Rusak Kritis'
    setAssets(prev => prev.map(a => {
      if (a.id === newWO.assetId) {
        return {
          ...a,
          status: newWO.priority === 'Darurat / Emergency' ? 'Rusak Kritis' : 'Dalam Perbaikan'
        };
      }
      return a;
    }));

    logAction('Pelaporan Kerusakan Baru', 'Perbaikan', `Membuka tiket perbaikan #${newWO.ticketNumber}: "${newWO.issueTitle}" [Prioritas: ${newWO.priority}] di ${newWO.location}`, 'create');

    if (newWO.priority === 'Darurat / Emergency' || newWO.priority === 'Tinggi') {
      pushNotification(
        `Tiket Kerusakan ${newWO.priority}!`,
        `Tiket #${newWO.ticketNumber} (${newWO.assetName}): "${newWO.issueTitle}". Segera tugaskan teknisi!`,
        'urgent',
        'repairs'
      );
    } else {
      pushNotification(
        `Tiket Kerusakan #${newWO.ticketNumber}`,
        `Keluhan baru dilaporkan untuk ${newWO.assetName}: ${newWO.issueTitle}`,
        'info',
        'repairs'
      );
    }
  };

  const updateWorkOrderStatus = (id: string, newStatus: TicketStatus, resolutionNotes?: string) => {
    const now = getFormattedNow();
    let completedDate: string | undefined = undefined;

    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== id) return wo;
      if (newStatus === 'Selesai') {
        completedDate = now;
      }
      return {
        ...wo,
        status: newStatus,
        resolutionNotes: resolutionNotes || wo.resolutionNotes,
        completionDate: newStatus === 'Selesai' ? now : wo.completionDate
      };
    }));

    const target = workOrders.find(wo => wo.id === id);
    if (target) {
      if (newStatus === 'Selesai') {
        // Return asset to good condition
        setAssets(prev => prev.map(a => a.id === target.assetId ? { ...a, status: 'Kondisi Baik', lastServiceDate: now.split(' ')[0] } : a));
        logAction('Penyelesaian Perbaikan (Tiket Ditutup)', 'Perbaikan', `Tiket #${target.ticketNumber} diselesaikan oleh ${activeUser.name}. Catatan: ${resolutionNotes || 'Perbaikan sukses'}`, 'complete');
        pushNotification(`Tiket #${target.ticketNumber} Selesai`, `Perbaikan ${target.assetName} telah diselesaikan dan terverifikasi aman.`, 'success', 'repairs');
      } else {
        logAction('Update Status Perbaikan', 'Perbaikan', `Status tiket #${target.ticketNumber} diperbarui menjadi: "${newStatus}"`, 'status');
      }
    }
  };

  // Consume spare part for a work order and deduct stock from inventory
  const useSparePartInWorkOrder = (workOrderId: string, inventoryItemId: string, qty: number) => {
    const item = inventory.find(i => i.id === inventoryItemId);
    if (!item) return false;
    if (item.currentStock < qty) {
      alert(`Stok ${item.name} tidak mencukupi (Tersedia: ${item.currentStock} ${item.unit})`);
      return false;
    }

    // Deduct inventory
    const newStock = item.currentStock - qty;
    setInventory(prev => prev.map(i => i.id === inventoryItemId ? { ...i, currentStock: newStock, lastUpdated: getFormattedNow().split(' ')[0] } : i));

    // Add to work order
    setWorkOrders(prev => prev.map(wo => {
      if (wo.id !== workOrderId) return wo;
      const existingPart = wo.sparePartsUsed.find(p => p.itemId === inventoryItemId);
      let updatedParts = [...wo.sparePartsUsed];
      if (existingPart) {
        updatedParts = updatedParts.map(p => p.itemId === inventoryItemId ? { ...p, quantity: p.quantity + qty } : p);
      } else {
        updatedParts.push({
          itemId: item.id,
          itemCode: item.code,
          itemName: item.name,
          quantity: qty,
          unit: item.unit,
          unitPrice: item.unitPrice
        });
      }
      const addedCost = qty * item.unitPrice;
      return {
        ...wo,
        sparePartsUsed: updatedParts,
        actualCost: wo.actualCost + addedCost
      };
    }));

    const targetWo = workOrders.find(wo => wo.id === workOrderId);
    logAction(
      'Pengeluaran Suku Cadang Gudang',
      'Stok Barang',
      `Mengeluarkan ${qty} ${item.unit} "${item.name}" untuk pengerjaan perbaikan #${targetWo?.ticketNumber || workOrderId}. Sisa stok gudang: ${newStock} ${item.unit}.`,
      'update'
    );

    // If newStock drops to or below minStock, trigger low stock alert
    if (newStock <= item.minStock) {
      pushNotification(
        'Peringatan Stok Menipis!',
        `Stok "${item.name}" tersisa ${newStock} ${item.unit} (Di bawah batas minimum ${item.minStock} ${item.unit}).`,
        'warning',
        'inventory'
      );
    }

    return true;
  };

  // 4. Inventory Methods
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      lastUpdated: getFormattedNow().split(' ')[0]
    };
    setInventory(prev => [newItem, ...prev]);
    logAction('Registrasi Barang Baru', 'Stok Barang', `Mendaftarkan item pendukung operasional baru: ${newItem.name} (${newItem.code}) di ${newItem.storageRack}`, 'create');
  };

  const adjustInventoryStock = (id: string, deltaQty: number, note: string) => {
    const target = inventory.find(i => i.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.currentStock + deltaQty);
    setInventory(prev => prev.map(i => i.id === id ? { ...i, currentStock: newStock, lastUpdated: getFormattedNow().split(' ')[0] } : i));

    logAction(
      deltaQty > 0 ? 'Penerimaan Stok Masuk' : 'Pengurangan Stok Keluar',
      'Stok Barang',
      `${deltaQty > 0 ? 'Menambah' : 'Mengurangi'} ${Math.abs(deltaQty)} ${target.unit} ${target.name}. Keterangan: ${note}. Stok sekarang: ${newStock} ${target.unit}.`,
      'update'
    );

    if (newStock <= target.minStock) {
      pushNotification(
        'Peringatan Stok Menipis!',
        `Stok ${target.name} tersisa ${newStock} ${target.unit} (Batas minimum: ${target.minStock} ${target.unit}).`,
        'warning',
        'inventory'
      );
    }
  };

  // 5. Stock Opname Submission
  const submitStockOpname = (record: Omit<StockOpnameRecord, 'id' | 'date' | 'status' | 'conductedBy'>) => {
    const now = getFormattedNow().split(' ')[0];
    const newRecord: StockOpnameRecord = {
      ...record,
      id: `opn-${Date.now()}`,
      date: now,
      conductedBy: activeUser.name,
      status: 'Disesuaikan'
    };

    // Auto-update inventory current stock to the verified physical stock
    setInventory(prev => prev.map(i => {
      if (i.id === record.itemId) {
        return {
          ...i,
          currentStock: record.physicalStock,
          lastOpnameDate: now,
          lastUpdated: now
        };
      }
      return i;
    }));

    setOpnameRecords(prev => [newRecord, ...prev]);

    logAction(
      'Eksekusi Stok Opname Fisik',
      'Stok Opname',
      `Stok opname barang "${record.itemName}": Sistem = ${record.systemStock}, Fisik = ${record.physicalStock}, Selisih = ${record.discrepancy > 0 ? '+' : ''}${record.discrepancy}. Alasan: ${record.reason || 'Penyesuaian rutin'}`,
      record.discrepancy !== 0 ? 'alert' : 'complete'
    );

    if (record.discrepancy !== 0) {
      pushNotification(
        'Discrepancy Stok Opname Terdeteksi',
        `Ditemukan selisih ${record.discrepancy} unit pada ${record.itemName}. Stok sistem telah disinkronkan ke fisik (${record.physicalStock}).`,
        'warning',
        'inventory'
      );
    } else {
      pushNotification(
        'Stok Opname Selesai & Cocok',
        `Stok opname ${record.itemName} 100% akurat dan cocok dengan data fisik.`,
        'success',
        'inventory'
      );
    }
  };

  // Notifications handler
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Facility / Company Profile Updater
  const updateFacilityProfile = (updated: Partial<FacilityProfile>) => {
    setFacilityProfile(prev => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    logAction(
      'Pembaruan Profil Gedung & Perusahaan',
      'Sistem',
      `Memperbarui identitas fasilitas: ${updated.buildingName || facilityProfile.buildingName} / ${updated.companyName || facilityProfile.companyName}`,
      'update'
    );

    pushNotification(
      'Profil Gedung Diperbarui',
      `Informasi fasilitas "${updated.buildingName || facilityProfile.buildingName}" berhasil disimpan.`,
      'success',
      'dashboard'
    );
  };

  // Reset to default initial state (called after user confirmation in UI modal)
  const resetToDefaultData = () => {
    // Clear all storage keys
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (e) {
        console.error(e);
      }
    });

    // Reset all states to initial clean empty datasets
    setAssets(INITIAL_ASSETS);
    setSchedules(INITIAL_SCHEDULES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setInventory(INITIAL_INVENTORY);
    setOpnameRecords(INITIAL_OPNAME_RECORDS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUsersList(INITIAL_USERS);
    setActiveUser(INITIAL_USERS[0]);
    setFacilityProfile(INITIAL_FACILITY_PROFILE);

    // Explicitly write fresh initial data to localStorage for persistence
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
      localStorage.setItem(STORAGE_KEYS.WORK_ORDERS, JSON.stringify(INITIAL_WORK_ORDERS));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      localStorage.setItem(STORAGE_KEYS.OPNAME, JSON.stringify(INITIAL_OPNAME_RECORDS));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USERS[0]));
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_FACILITY_PROFILE));
    } catch (e) {
      console.error(e);
    }

    const resetLog: ActivityLog = {
      id: `log-reset-${Date.now()}`,
      timestamp: getFormattedNow(),
      userName: INITIAL_USERS[0].name,
      userRole: INITIAL_USERS[0].role,
      action: 'Pengosongan Data Sistem',
      module: 'Sistem',
      details: 'Seluruh database operasional gedung berhasil dikosongkan. Pengguna aktif diatur hanya untuk Fatchur Rochman.',
      badgeType: 'alert'
    };
    setActivityLogs([resetLog, ...INITIAL_ACTIVITY_LOGS]);

    pushNotification(
      'Sistem Berhasil Dikosongkan',
      'Seluruh data operasional gedung telah dibersihkan menjadi kosongan siap digunakan.',
      'success',
      'dashboard'
    );
  };

  // Export data as JSON file for backup
  const exportDataToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      facilityProfile,
      users: usersList,
      assets,
      schedules,
      workOrders,
      inventory,
      opnameRecords,
      activityLogs
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup-${(facilityProfile.buildingName || 'GA-Building').replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    logAction('Ekspor Cadangan Data', 'Sistem', 'Melakukan backup seluruh data sistem ke format JSON', 'update');
  };

  // Executive KPI Metrics Calculation
  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const healthyAssets = assets.filter(a => a.status === 'Kondisi Baik').length;
    const criticalAssets = assets.filter(a => a.status === 'Rusak Kritis' || a.status === 'Dalam Perbaikan').length;
    const assetHealthPercent = totalAssets > 0 ? Math.round((healthyAssets / totalAssets) * 100) : 100;

    const totalSchedules = schedules.length;
    const overdueSchedules = schedules.filter(s => s.status === 'Terlambat / Overdue').length;
    const dueSoonSchedules = schedules.filter(s => s.status === 'Menjelang Jatuh Tempo').length;
    const completedSchedules = schedules.filter(s => s.status === 'Selesai').length;

    const totalWorkOrders = workOrders.length;
    const activeWorkOrders = workOrders.filter(w => w.status !== 'Selesai' && w.status !== 'Dibatalkan').length;
    const emergencyWorkOrders = workOrders.filter(w => (w.priority === 'Darurat / Emergency' || w.priority === 'Tinggi') && w.status !== 'Selesai').length;
    const completedWorkOrders = workOrders.filter(w => w.status === 'Selesai').length;

    const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);
    const totalInventoryValue = inventory.reduce((acc, i) => acc + (i.currentStock * i.unitPrice), 0);

    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    return {
      totalAssets,
      healthyAssets,
      criticalAssets,
      assetHealthPercent,
      totalSchedules,
      overdueSchedules,
      dueSoonSchedules,
      completedSchedules,
      totalWorkOrders,
      activeWorkOrders,
      emergencyWorkOrders,
      completedWorkOrders,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      totalInventoryValue,
      unreadNotificationsCount
    };
  }, [assets, schedules, workOrders, inventory, notifications]);

  return {
    // Current Navigation & Search
    currentTab,
    setCurrentTab,
    globalSearch,
    setGlobalSearch,
    selectedAssetDetailId,
    setSelectedAssetDetailId,

    // User Persona & Management
    activeUser,
    setActiveUser,
    usersList,
    addUser,
    deleteUser,

    // Facility & Company Profile
    facilityProfile,
    updateFacilityProfile,

    // Entities & Operations
    assets,
    addAsset,
    updateAsset,
    deleteAsset,

    schedules,
    addSchedule,
    updateSchedule,
    toggleChecklistItem,
    completeSchedule,

    workOrders,
    addWorkOrder,
    updateWorkOrderStatus,
    useSparePartInWorkOrder,

    inventory,
    addInventoryItem,
    adjustInventoryStock,

    opnameRecords,
    submitStockOpname,

    activityLogs,
    logAction,

    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    pushNotification,

    // Utilities
    stats,
    resetToDefaultData,
    exportDataToJSON
  };
}

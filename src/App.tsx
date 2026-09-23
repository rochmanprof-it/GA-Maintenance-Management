import React, { useState } from 'react';
import { useAppState, TabKey } from './state/useAppState';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { MaintenanceScheduleView } from './components/MaintenanceScheduleView';
import { AssetManagementView } from './components/AssetManagementView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { InventoryStockOpnameView } from './components/InventoryStockOpnameView';
import { ActivityLogView } from './components/ActivityLogView';
import { 
  NewTicketModal, 
  NewScheduleModal, 
  NewAssetModal, 
  NewInventoryItemModal, 
  QuickOpnameModal, 
  SparePartPickerModal 
} from './components/Modals';
import { UserManagementModal } from './components/UserManagementModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { EditFacilityProfileModal } from './components/EditFacilityProfileModal';
import { Asset, InventoryItem, WorkOrder } from './types';
import { Building, ShieldCheck, PhoneCall, Info, Users, RotateCcw, Edit3 } from 'lucide-react';

export default function App() {
  const {
    currentTab,
    setCurrentTab,
    globalSearch,
    setGlobalSearch,
    selectedAssetDetailId,
    setSelectedAssetDetailId,
    activeUser,
    setActiveUser,
    usersList,
    addUser,
    deleteUser,
    facilityProfile,
    updateFacilityProfile,
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
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    stats,
    resetToDefaultData,
    exportDataToJSON
  } = useAppState();

  // Modal Control States
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketModalPreselectedAsset, setTicketModalPreselectedAsset] = useState<Asset | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [opnamePreselectedItem, setOpnamePreselectedItem] = useState<InventoryItem | null>(null);

  const [selectedWorkOrderForSparePart, setSelectedWorkOrderForSparePart] = useState<WorkOrder | null>(null);

  // User Management, Reset, & Facility Profile Modals
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);
  const [isEditFacilityModalOpen, setIsEditFacilityModalOpen] = useState(false);

  // Quick Handlers
  const handleOpenNewTicket = (asset?: Asset | null) => {
    setTicketModalPreselectedAsset(asset || null);
    setIsTicketModalOpen(true);
  };

  const handleOpenQuickOpname = (item?: InventoryItem | null) => {
    setOpnamePreselectedItem(item || null);
    setIsOpnameModalOpen(true);
  };

  const handleSelectAssetDetail = (assetId: string) => {
    setSelectedAssetDetailId(assetId);
    setCurrentTab('assets');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        usersList={usersList}
        facilityProfile={facilityProfile}
        notifications={notifications}
        markNotificationRead={markNotificationRead}
        markAllNotificationsRead={markAllNotificationsRead}
        unreadNotificationsCount={stats.unreadNotificationsCount}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        onOpenNewTicketModal={() => handleOpenNewTicket()}
        onOpenNewScheduleModal={() => setIsScheduleModalOpen(true)}
        onOpenUserManagementModal={() => setIsUserManagementModalOpen(true)}
        onOpenEditFacilityModal={() => setIsEditFacilityModalOpen(true)}
        onExportBackup={exportDataToJSON}
        onResetData={() => setIsResetConfirmModalOpen(true)}
      />

      {/* Breadcrumb / Facility Context Strip */}
      <div className="bg-slate-800/90 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-200">Sistem Berjalan Aktif</span>
            <span className="text-slate-400">
              • Lokasi: <strong>{facilityProfile.buildingName}</strong> {facilityProfile.floorsCount ? `(${facilityProfile.floorsCount})` : ''}
            </span>
            <button
              onClick={() => setIsEditFacilityModalOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 cursor-pointer transition-colors"
              title="Edit Data Perusahaan & Gedung"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>Edit Data Gedung</span>
            </button>
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-slate-300 flex-wrap">
            <span>Aktor Aktif: <strong className="text-amber-400">{activeUser.name}</strong> ({activeUser.role})</span>
            <button
              id="btn-shortcut-user-management"
              onClick={() => setIsUserManagementModalOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-700 hover:bg-slate-600 text-amber-300 px-2 py-0.5 rounded border border-slate-600 cursor-pointer transition-colors"
              title="Kelola Tim & Akun Pengguna (Tambah / Hapus)"
            >
              <Users className="w-3 h-3" />
              <span>Kelola Tim ({usersList.length})</span>
            </button>
            <button
              id="btn-shortcut-reset-data"
              onClick={() => setIsResetConfirmModalOpen(true)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 px-2 py-0.5 rounded border border-red-800/50 cursor-pointer transition-colors"
              title="Kosongkan & Reset Data Sistem"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Kosongkan Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            schedules={schedules}
            workOrders={workOrders}
            assets={assets}
            activityLogs={activityLogs}
            notifications={notifications}
            setCurrentTab={setCurrentTab}
            onOpenNewTicketModal={() => handleOpenNewTicket()}
            onOpenNewScheduleModal={() => setIsScheduleModalOpen(true)}
            onOpenNewAssetModal={() => setIsAssetModalOpen(true)}
            onOpenQuickOpnameModal={handleOpenQuickOpname}
            onSelectAssetDetail={handleSelectAssetDetail}
            onCompleteSchedule={completeSchedule}
          />
        )}

        {currentTab === 'schedules' && (
          <MaintenanceScheduleView
            schedules={schedules}
            assets={assets}
            onOpenNewScheduleModal={() => setIsScheduleModalOpen(true)}
            toggleChecklistItem={toggleChecklistItem}
            onCompleteSchedule={completeSchedule}
            onSelectAssetDetail={handleSelectAssetDetail}
          />
        )}

        {currentTab === 'assets' && (
          <AssetManagementView
            assets={assets}
            workOrders={workOrders}
            schedules={schedules}
            onOpenNewAssetModal={() => setIsAssetModalOpen(true)}
            onOpenNewTicketForAsset={(asset) => handleOpenNewTicket(asset)}
            selectedAssetDetailId={selectedAssetDetailId}
            setSelectedAssetDetailId={setSelectedAssetDetailId}
          />
        )}

        {currentTab === 'repairs' && (
          <WorkOrdersView
            workOrders={workOrders}
            assets={assets}
            inventory={inventory}
            onOpenNewTicketModal={() => handleOpenNewTicket()}
            onUpdateWorkOrderStatus={updateWorkOrderStatus}
            onOpenSparePartModal={(wo) => setSelectedWorkOrderForSparePart(wo)}
            onSelectAssetDetail={handleSelectAssetDetail}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryStockOpnameView
            inventory={inventory}
            opnameRecords={opnameRecords}
            onOpenNewItemModal={() => setIsInventoryModalOpen(true)}
            onAdjustStock={adjustInventoryStock}
            onSubmitOpname={submitStockOpname}
            onOpenQuickOpnameModal={handleOpenQuickOpname}
          />
        )}

        {currentTab === 'logs' && (
          <ActivityLogView
            activityLogs={activityLogs}
          />
        )}

      </main>

      {/* Global Modals */}
      <NewTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        assets={assets}
        activeUser={activeUser}
        usersList={usersList}
        preselectedAsset={ticketModalPreselectedAsset}
        onSubmit={addWorkOrder}
      />

      <NewScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        assets={assets}
        usersList={usersList}
        onSubmit={addSchedule}
      />

      <NewAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        usersList={usersList}
        onSubmit={addAsset}
      />

      <NewInventoryItemModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onSubmit={addInventoryItem}
      />

      <QuickOpnameModal
        isOpen={isOpnameModalOpen}
        onClose={() => setIsOpnameModalOpen(false)}
        inventory={inventory}
        preselectedItem={opnamePreselectedItem}
        onSubmit={submitStockOpname}
      />

      <SparePartPickerModal
        isOpen={selectedWorkOrderForSparePart !== null}
        onClose={() => setSelectedWorkOrderForSparePart(null)}
        workOrder={selectedWorkOrderForSparePart}
        inventory={inventory}
        onUseSparePart={useSparePartInWorkOrder}
      />

      {/* User Management (Add / Delete Users) Modal */}
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        users={usersList}
        activeUser={activeUser}
        onSetActiveUser={setActiveUser}
        onAddUser={addUser}
        onDeleteUser={deleteUser}
      />

      {/* Safe In-App Reset Confirmation Modal (No window.confirm) */}
      <ResetConfirmModal
        isOpen={isResetConfirmModalOpen}
        onClose={() => setIsResetConfirmModalOpen(false)}
        onConfirmReset={resetToDefaultData}
      />

      {/* Edit Facility & Company Profile Modal */}
      <EditFacilityProfileModal
        isOpen={isEditFacilityModalOpen}
        onClose={() => setIsEditFacilityModalOpen(false)}
        profile={facilityProfile}
        onSave={updateFacilityProfile}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span className="font-bold text-slate-200">{facilityProfile.companyName || 'Building GA System'}</span>
            <span>• {facilityProfile.buildingName}</span>
            {facilityProfile.auditStandard && (
              <span className="hidden lg:inline text-slate-500">• {facilityProfile.auditStandard}</span>
            )}
          </div>
          <div className="flex items-center gap-3.5 text-[11px] flex-wrap justify-center">
            <button
              onClick={() => setIsEditFacilityModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Profil Gedung</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsUserManagementModalOpen(true)}
              className="text-slate-300 hover:text-white font-medium cursor-pointer"
            >
              Kelola Pengguna ({usersList.length})
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsResetConfirmModalOpen(true)}
              className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
            >
              Kosongkan Data
            </button>
            <span className="text-slate-600">•</span>
            <span>Hotline: {facilityProfile.technicianHotline || 'Ext. 2101'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

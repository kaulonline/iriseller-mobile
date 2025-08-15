/**
 * Offline Service
 * Manages offline data storage and synchronization
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { EventEmitter } from 'events';

// Storage keys
const STORAGE_KEYS = {
  OFFLINE_DATA: '@IRISeller:offlineData',
  SYNC_STATUS: '@IRISeller:syncStatus',
  LAST_SYNC: '@IRISeller:lastSync',
};

// Sync status interface
export interface SyncStatus {
  inProgress: boolean;
  lastSync: Date | null;
  pendingChanges: number;
  errors: string[];
}

// Offline data item interface
export interface OfflineDataItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  synced: boolean;
  attempts: number;
}

class OfflineService extends EventEmitter {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private offlineData: Map<string, OfflineDataItem> = new Map();
  private syncCallbacks: Map<string, (item: OfflineDataItem) => Promise<void>> = new Map();

  constructor() {
    super();
    this.initializeService();
  }

  // Initialize the service
  private async initializeService() {
    await this.loadOfflineData();
    this.monitorNetworkStatus();
    
    // Check if we have pending changes and are online
    if (this.isOnline && this.offlineData.size > 0) {
      this.syncOfflineData();
    }
  }

  // Monitor network status
  private monitorNetworkStatus() {
    NetInfo.addEventListener((state: NetInfoState) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      console.log(`[Offline] Network status: ${this.isOnline ? 'Online' : 'Offline'}`);

      // Emit network status change event
      this.emit('networkStatusChange', this.isOnline);

      // If we're back online and have pending changes, sync them
      if (wasOffline && this.isOnline && this.offlineData.size > 0) {
        console.log('[Offline] Back online, starting sync...');
        this.syncOfflineData();
      }
    });
  }

  // Load offline data from storage
  private async loadOfflineData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_DATA);
      if (data) {
        const items = JSON.parse(data) as OfflineDataItem[];
        items.forEach(item => {
          this.offlineData.set(item.id, item);
        });
        console.log(`[Offline] Loaded ${items.length} offline items`);
      }
    } catch (error) {
      console.error('[Offline] Error loading offline data:', error);
    }
  }

  // Save offline data to storage
  private async saveOfflineData() {
    try {
      const items = Array.from(this.offlineData.values());
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(items));
    } catch (error) {
      console.error('[Offline] Error saving offline data:', error);
    }
  }

  // Add data to offline storage
  public async addOfflineData(
    type: OfflineDataItem['type'],
    entity: string,
    data: any
  ): Promise<string> {
    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const item: OfflineDataItem = {
      id,
      type,
      entity,
      data,
      timestamp: Date.now(),
      synced: false,
      attempts: 0,
    };

    this.offlineData.set(id, item);
    await this.saveOfflineData();

    console.log(`[Offline] Added ${type} operation for ${entity}`);
    
    // Emit event for UI updates
    this.emit('offlineDataAdded', item);

    // Try to sync immediately if online
    if (this.isOnline && !this.syncInProgress) {
      this.syncOfflineData();
    }

    return id;
  }

  // Register sync callback for an entity type
  public registerSyncCallback(
    entity: string,
    callback: (item: OfflineDataItem) => Promise<void>
  ) {
    this.syncCallbacks.set(entity, callback);
    console.log(`[Offline] Registered sync callback for ${entity}`);
  }

  // Sync offline data
  public async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    this.emit('syncStarted');

    const errors: string[] = [];
    const syncedItems: string[] = [];

    console.log(`[Offline] Starting sync of ${this.offlineData.size} items...`);

    for (const [id, item] of this.offlineData) {
      if (item.synced) continue;

      try {
        const callback = this.syncCallbacks.get(item.entity);
        if (callback) {
          await callback(item);
          item.synced = true;
          syncedItems.push(id);
          console.log(`[Offline] Synced ${item.entity} (${item.type})`);
        } else {
          console.warn(`[Offline] No sync callback for entity: ${item.entity}`);
        }
      } catch (error) {
        item.attempts++;
        const errorMessage = `Failed to sync ${item.entity}: ${error}`;
        errors.push(errorMessage);
        console.error(`[Offline] ${errorMessage}`);

        // Remove item after 3 failed attempts
        if (item.attempts >= 3) {
          syncedItems.push(id);
          console.error(`[Offline] Removing item after 3 failed attempts: ${id}`);
        }
      }
    }

    // Remove synced items
    syncedItems.forEach(id => this.offlineData.delete(id));
    await this.saveOfflineData();

    // Update sync status
    const syncStatus: SyncStatus = {
      inProgress: false,
      lastSync: new Date(),
      pendingChanges: this.offlineData.size,
      errors,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify(syncStatus));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    this.syncInProgress = false;
    this.emit('syncCompleted', syncStatus);

    console.log(`[Offline] Sync completed. Synced: ${syncedItems.length}, Pending: ${this.offlineData.size}`);
  }

  // Get sync status
  public async getSyncStatus(): Promise<SyncStatus> {
    try {
      const status = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
      if (status) {
        return JSON.parse(status);
      }
    } catch (error) {
      console.error('[Offline] Error getting sync status:', error);
    }

    return {
      inProgress: this.syncInProgress,
      lastSync: null,
      pendingChanges: this.offlineData.size,
      errors: [],
    };
  }

  // Get pending changes count
  public getPendingChangesCount(): number {
    return Array.from(this.offlineData.values()).filter(item => !item.synced).length;
  }

  // Clear all offline data
  public async clearOfflineData() {
    this.offlineData.clear();
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_DATA);
    await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_STATUS);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    console.log('[Offline] Cleared all offline data');
  }

  // Check if online
  public getIsOnline(): boolean {
    return this.isOnline;
  }

  // Get offline data for debugging
  public getOfflineData(): OfflineDataItem[] {
    return Array.from(this.offlineData.values());
  }
}

// Export singleton instance
export const offlineService = new OfflineService();












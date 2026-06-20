/**
 * Sync & Backup utilities for Cadi Store
 * Handles export/import of store data and cloud sync via JSONBin.io
 */

export interface StoreData {
  products: any[];
  categories: any[];
  settings: any;
  heroSettings: any;
  features: any[];
  testimonials: any[];
  adminPassword: string;
  _version: number;
  _exportedAt: string;
  _storeName: string;
}

export interface CloudSyncConfig {
  apiKey: string;
  binId: string;
}

const JSONBIN_API = 'https://api.jsonbin.io/v3';

export function gatherStoreData(state: {
  products: any[]; categories: any[]; settings: any;
  heroSettings: any; features: any[]; testimonials: any[]; adminPassword: string;
}): StoreData {
  return {
    products: state.products,
    categories: state.categories,
    settings: state.settings,
    heroSettings: state.heroSettings,
    features: state.features,
    testimonials: state.testimonials,
    adminPassword: state.adminPassword,
    _version: 2,
    _exportedAt: new Date().toISOString(),
    _storeName: state.settings.storeName || 'قادي شوب',
  };
}

export function exportToFile(data: StoreData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `cadistore-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importFromFile(): Promise<StoreData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) { reject(new Error('لم يتم اختيار ملف')); return; }
      try {
        const text = await file.text();
        const data = JSON.parse(text) as StoreData;
        if (!data._version || !data.products) {
          reject(new Error('ملف غير صالح'));
          return;
        }
        resolve(data);
      } catch (err) {
        reject(new Error('فشل في قراءة الملف'));
      }
    };
    input.click();
  });
}

export async function cloudSave(config: CloudSyncConfig, data: StoreData): Promise<void> {
  const response = await fetch(`${JSONBIN_API}/b/${config.binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': config.apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`فشل الحفظ السحابي: ${response.status}`);
  }
}

export async function cloudLoad(config: CloudSyncConfig): Promise<StoreData> {
  const response = await fetch(`${JSONBIN_API}/b/${config.binId}/latest`, {
    method: 'GET',
    headers: {
      'X-Master-Key': config.apiKey,
    },
  });
  if (!response.ok) {
    throw new Error(`فشل التحميل السحابي: ${response.status}`);
  }
  const result = await response.json();
  return result.record as StoreData;
}

export async function cloudCreate(apiKey: string, data: StoreData): Promise<CloudSyncConfig> {
  const response = await fetch(`${JSONBIN_API}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Name': `CadiStore-${data._storeName}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`فشل إنشاء النسخة السحابية: ${response.status}`);
  }
  const result = await response.json();
  return { apiKey, binId: result.metadata.id };
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${JSONBIN_API}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
        'X-Bin-Private': 'true',
      },
      body: JSON.stringify({ test: true }),
    });
    if (!response.ok) return false;
    const result = await response.json();
    await fetch(`${JSONBIN_API}/b/${result.metadata.id}`, {
      method: 'DELETE',
      headers: { 'X-Master-Key': apiKey },
    });
    return true;
  } catch (_err) {
    return false;
  }
}

export async function validateCloudConfig(config: CloudSyncConfig): Promise<boolean> {
  try {
    const response = await fetch(`${JSONBIN_API}/b/${config.binId}/latest`, {
      headers: { 'X-Master-Key': config.apiKey },
    });
    return response.ok;
  } catch (_err) {
    return false;
  }
}

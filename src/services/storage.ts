import { FocusSettings } from "../types";

const DEFAULT_SETTINGS: FocusSettings = {
  timeSlots: [],
  allowedSites: [],
  isEnabled: false,
};

export const StorageService = {
  async getSettings(): Promise<FocusSettings> {
    const result = await chrome.storage.sync.get("focusSettings");
    return {
      ...DEFAULT_SETTINGS,
      ...(result.focusSettings || {}),
    };
  },

  async saveSettings(settings: FocusSettings): Promise<void> {
    await chrome.storage.sync.set({ focusSettings: settings });
  },

  async updateSettings(partialSettings: Partial<FocusSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    await this.saveSettings({ ...currentSettings, ...partialSettings });
  },
};

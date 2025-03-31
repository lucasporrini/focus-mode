export interface FocusTimeSlot {
  id: string;
  startTime: string; // Format HH:mm
  endTime: string; // Format HH:mm
  days: number[]; // 0-6 (Dimanche-Samedi)
  isActive: boolean;
}

export interface AllowedSite {
  id: string;
  url: string;
  name: string;
}

export interface FocusSettings {
  timeSlots: FocusTimeSlot[];
  allowedSites: AllowedSite[];
  isEnabled: boolean;
}

import { StorageService } from "./services/storage";

const isChromePage = (url: string) => {
  return (
    url.startsWith("chrome://") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("about:")
  );
};

const isGoogleSite = (url: string) => {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes("google.com") ||
      urlObj.hostname.includes("google.fr")
    );
  } catch {
    return false;
  }
};

const isUrlAllowed = (url: string, allowedSites: { url: string }[]) => {
  if (isChromePage(url)) return true;
  if (isGoogleSite(url)) return true;

  try {
    const urlObj = new URL(url);
    return allowedSites.some((site) => {
      try {
        const siteUrl = new URL(site.url);
        return urlObj.hostname.includes(siteUrl.hostname);
      } catch {
        return urlObj.hostname.includes(site.url);
      }
    });
  } catch {
    return false;
  }
};

const isInTimeSlot = (
  currentTime: string,
  startTime: string,
  endTime: string
) => {
  const [currentHour, currentMinute] = currentTime.split(":").map(Number);
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const currentMinutes = currentHour * 60 + currentMinute;
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

const isFocusTime = async () => {
  const settings = await StorageService.getSettings();
  console.log("settings", settings);
  if (!settings.isEnabled) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toLocaleTimeString("fr-FR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return settings.timeSlots.some((slot) => {
    return (
      slot.isActive &&
      slot.days.includes(currentDay) &&
      isInTimeSlot(currentTime, slot.startTime, slot.endTime)
    );
  });
};

// Écouter les événements de navigation
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Ne vérifier que les navigations principales (pas les iframes, etc.)
  if (details.frameId !== 0) return;

  const isInFocus = await isFocusTime();
  if (!isInFocus) return;

  const settings = await StorageService.getSettings();
  const isAllowed = isUrlAllowed(details.url, settings.allowedSites);

  if (!isAllowed) {
    console.log("Blocking URL:", details.url);
    try {
      await chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL(
          `blocked.html?url=${encodeURIComponent(details.url)}`
        ),
      });
    } catch (error) {
      console.error("Error blocking URL:", error);
    }
  }
});

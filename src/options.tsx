import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { StorageService } from "./services/storage";
import { AllowedSite, FocusSettings, FocusTimeSlot } from "./types";

const Options: React.FC = () => {
  const [settings, setSettings] = useState<FocusSettings>({
    timeSlots: [],
    allowedSites: [],
    isEnabled: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSettings = await StorageService.getSettings();
    setSettings(savedSettings);
  };

  const addTimeSlot = () => {
    const newSlot: FocusTimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "17:00",
      days: [1, 2, 3, 4, 5], // Lundi-Vendredi par défaut
      isActive: true,
    };
    setSettings((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot],
    }));
  };

  const updateTimeSlot = (id: string, updates: Partial<FocusTimeSlot>) => {
    setSettings((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      ),
    }));
  };

  const removeTimeSlot = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((slot) => slot.id !== id),
    }));
  };

  const addAllowedSite = () => {
    const newSite: AllowedSite = {
      id: Date.now().toString(),
      url: "",
      name: "",
    };
    setSettings((prev) => ({
      ...prev,
      allowedSites: [...prev.allowedSites, newSite],
    }));
  };

  const updateAllowedSite = (id: string, updates: Partial<AllowedSite>) => {
    setSettings((prev) => ({
      ...prev,
      allowedSites: prev.allowedSites.map((site) =>
        site.id === id ? { ...site, ...updates } : site
      ),
    }));
  };

  const removeAllowedSite = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      allowedSites: prev.allowedSites.filter((site) => site.id !== id),
    }));
  };

  const saveSettings = async () => {
    await StorageService.saveSettings(settings);
  };

  return (
    <div className="container">
      <h1>Paramètres Focus Mode</h1>

      <div className="section">
        <h2>Activation</h2>
        <label>
          <input
            type="checkbox"
            checked={settings.isEnabled}
            onChange={(e) => {
              setSettings((prev) => ({ ...prev, isEnabled: e.target.checked }));
            }}
          />
          Activer le mode focus
        </label>
      </div>

      <div className="section">
        <h2>Plages horaires</h2>
        <button onClick={addTimeSlot}>Ajouter une plage horaire</button>
        {settings.timeSlots.map((slot) => (
          <div key={slot.id} className="time-slot">
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) =>
                updateTimeSlot(slot.id, { startTime: e.target.value })
              }
            />
            <span>à</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) =>
                updateTimeSlot(slot.id, { endTime: e.target.value })
              }
            />
            <select
              multiple
              value={slot.days.map(String)}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => Number(option.value)
                );
                updateTimeSlot(slot.id, { days: selected });
              }}
            >
              <option value="0">Dimanche</option>
              <option value="1">Lundi</option>
              <option value="2">Mardi</option>
              <option value="3">Mercredi</option>
              <option value="4">Jeudi</option>
              <option value="5">Vendredi</option>
              <option value="6">Samedi</option>
            </select>
            <button onClick={() => removeTimeSlot(slot.id)}>Supprimer</button>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Sites autorisés</h2>
        <button onClick={addAllowedSite}>Ajouter un site</button>
        {settings.allowedSites.map((site) => (
          <div key={site.id} className="allowed-site">
            <input
              type="text"
              placeholder="Nom du site"
              value={site.name}
              onChange={(e) =>
                updateAllowedSite(site.id, { name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="URL (ex: google.com)"
              value={site.url}
              onChange={(e) =>
                updateAllowedSite(site.id, { url: e.target.value })
              }
            />
            <button onClick={() => removeAllowedSite(site.id)}>
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <button onClick={saveSettings}>Sauvegarder les paramètres</button>

      <style>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        .time-slot, .allowed-site {
          display: flex;
          gap: 10px;
          margin: 10px 0;
          align-items: center;
        }
        input[type="text"], input[type="time"], select {
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

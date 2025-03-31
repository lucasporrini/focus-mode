import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { StorageService } from "./services/storage";

const Popup = () => {
  const [currentURL, setCurrentURL] = useState<string>();
  const [siteName, setSiteName] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url);
      // Récupérer le nom du site à partir de l'URL
      try {
        const url = new URL(tabs[0].url!);
        const urlParams = new URLSearchParams(url.search);
        const urlParameter = urlParams.get("url");
        setCurrentURL(urlParameter || url.hostname);
      } catch {
        setCurrentURL("");
      }
    });
  }, []);

  const addToAllowedSites = useCallback(async () => {
    if (!currentURL || !siteName) return;

    try {
      const settings = await StorageService.getSettings();
      console.log("settings", settings);
      console.log("new url", new URL(currentURL).hostname);
      console.log("siteName", siteName);
      const newSite = {
        id: Date.now().toString(),
        url: new URL(currentURL).hostname,
        name: siteName,
      };

      await StorageService.updateSettings({
        allowedSites: [...settings.allowedSites, newSite],
      });

      setStatus("Site ajouté avec succès !");
      setTimeout(() => setStatus(""), 2000);
    } catch (error) {
      setStatus("Erreur lors de l'ajout du site");
      setTimeout(() => setStatus(""), 2000);
    }
  }, [currentURL, siteName]);

  return (
    <div style={{ padding: "16px", width: "300px" }}>
      <h2 style={{ marginBottom: "16px" }}>Focus Mode</h2>

      <div style={{ marginBottom: "16px" }}>
        <p style={{ marginBottom: "8px" }}>Site actuel :</p>
        <p
          style={{
            wordBreak: "break-all",
            fontSize: "12px",
            color: "#666",
            marginBottom: "16px",
          }}
        >
          {currentURL}
        </p>

        <div style={{ marginBottom: "8px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Nom du site :
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          onClick={addToAllowedSites}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Ajouter aux sites autorisés
        </button>

        {status && (
          <p
            style={{
              marginTop: "8px",
              color: status.includes("Erreur") ? "#e74c3c" : "#2ecc71",
              fontSize: "12px",
            }}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

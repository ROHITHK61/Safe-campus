import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "Administrator";

  // Default settings
  const defaultSettings = {
    notifications: true,
    aiDetection: true,
    autoDispatch: false,
    soundAlerts: true,
    campusName: "Bannari Amman Institute of Technology",
    campusCode: "BIT-SATHY",
    emergencyContact: "+91 XXXXX XXXXX",
    securityRoom: "Main Security Office",
  };

  const [notifications, setNotifications] = useState(
    defaultSettings.notifications
  );

  const [aiDetection, setAiDetection] = useState(
    defaultSettings.aiDetection
  );

  const [autoDispatch, setAutoDispatch] = useState(
    defaultSettings.autoDispatch
  );

  const [soundAlerts, setSoundAlerts] = useState(
    defaultSettings.soundAlerts
  );

  const [campusName, setCampusName] = useState(
    defaultSettings.campusName
  );

  const [campusCode, setCampusCode] = useState(
    defaultSettings.campusCode
  );

  const [emergencyContact, setEmergencyContact] = useState(
    defaultSettings.emergencyContact
  );

  const [securityRoom, setSecurityRoom] = useState(
    defaultSettings.securityRoom
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD SETTINGS FROM FIREBASE
  // ==========================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "system");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const data = settingsSnap.data();

          setNotifications(
            data.notifications ?? defaultSettings.notifications
          );

          setAiDetection(
            data.aiDetection ?? defaultSettings.aiDetection
          );

          setAutoDispatch(
            data.autoDispatch ?? defaultSettings.autoDispatch
          );

          setSoundAlerts(
            data.soundAlerts ?? defaultSettings.soundAlerts
          );

          setCampusName(
            data.campusName ?? defaultSettings.campusName
          );

          setCampusCode(
            data.campusCode ?? defaultSettings.campusCode
          );

          setEmergencyContact(
            data.emergencyContact ??
              defaultSettings.emergencyContact
          );

          setSecurityRoom(
            data.securityRoom ?? defaultSettings.securityRoom
          );
        } else {
          // Create default settings in Firebase
          await setDoc(settingsRef, defaultSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        alert("Failed to load settings from Firebase.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ==========================================
  // SAVE SETTINGS TO FIREBASE
  // ==========================================

  const saveSettings = async () => {
    if (!isAdmin) {
      alert("Only administrators can save settings.");
      return;
    }

    setSaving(true);

    try {
      const settings = {
        notifications,
        aiDetection,
        autoDispatch,
        soundAlerts,
        campusName,
        campusCode,
        emergencyContact,
        securityRoom,
      };

      const settingsRef = doc(db, "settings", "system");

      await setDoc(settingsRef, settings, {
        merge: true,
      });

      alert("Settings saved successfully to Firebase!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings to Firebase.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <div>
            <h1>System Settings</h1>
            <p>Loading settings from Firebase...</p>
          </div>

          <div className="system-online">
            ● CONNECTING
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <h1>System Settings</h1>

          <p>
            Configure SafeCampus AI system preferences
          </p>
        </div>

        <div className="system-online">
          ● SYSTEM ONLINE
        </div>

      </div>


      {/* CAMPUS SETTINGS */}

      <div className="settings-section">

        <div className="settings-section-title">

          <span>🏫</span>

          <div>
            <h2>Campus Information</h2>

            <p>
              Basic information about your campus
            </p>
          </div>

        </div>


        <div className="settings-form">

          <div className="setting-field">

            <label>Campus Name</label>

            <input
              type="text"
              value={campusName}
              onChange={(e) =>
                setCampusName(e.target.value)
              }
              disabled={!isAdmin}
            />

          </div>


          <div className="setting-field">

            <label>Campus Code</label>

            <input
              type="text"
              value={campusCode}
              onChange={(e) =>
                setCampusCode(e.target.value)
              }
              disabled={!isAdmin}
            />

          </div>


          <div className="setting-field">

            <label>Emergency Contact</label>

            <input
              type="text"
              value={emergencyContact}
              onChange={(e) =>
                setEmergencyContact(e.target.value)
              }
              disabled={!isAdmin}
            />

          </div>


          <div className="setting-field">

            <label>Security Control Room</label>

            <input
              type="text"
              value={securityRoom}
              onChange={(e) =>
                setSecurityRoom(e.target.value)
              }
              disabled={!isAdmin}
            />

          </div>

        </div>

      </div>


      {/* NOTIFICATIONS */}

      <div className="settings-section">

        <div className="settings-section-title">

          <span>🔔</span>

          <div>

            <h2>Notifications</h2>

            <p>
              Manage incident and system notifications
            </p>

          </div>

        </div>


        <div className="settings-options">

          <SettingToggle
            title="Incident Notifications"
            description="Receive notifications when a new incident is reported"
            enabled={notifications}
            setEnabled={setNotifications}
            disabled={!isAdmin}
          />


          <SettingToggle
            title="Emergency Sound Alerts"
            description="Play sound alerts for critical incidents"
            enabled={soundAlerts}
            setEnabled={setSoundAlerts}
            disabled={!isAdmin}
          />

        </div>

      </div>


      {/* AI SETTINGS */}

      <div className="settings-section">

        <div className="settings-section-title">

          <span>🤖</span>

          <div>

            <h2>AI Intelligence</h2>

            <p>
              Configure AI-powered campus safety features
            </p>

          </div>

        </div>


        <div className="settings-options">

          <SettingToggle
            title="AI Incident Detection"
            description="Automatically analyze incidents and identify severity"
            enabled={aiDetection}
            setEnabled={setAiDetection}
            disabled={!isAdmin}
          />


          <SettingToggle
            title="Automatic Responder Dispatch"
            description="Allow AI to recommend the nearest available responder"
            enabled={autoDispatch}
            setEnabled={setAutoDispatch}
            disabled={!isAdmin}
          />

        </div>

      </div>


      {/* SYSTEM STATUS */}

      <div className="settings-section">

        <div className="settings-section-title">

          <span>⚙️</span>

          <div>

            <h2>System Information</h2>

            <p>
              SafeCampus AI platform information
            </p>

          </div>

        </div>


        <div className="system-info-grid">

          <div className="system-info">

            <small>
              Application
            </small>

            <strong>
              SafeCampus AI
            </strong>

          </div>


          <div className="system-info">

            <small>
              Version
            </small>

            <strong>
              1.0.0
            </strong>

          </div>


          <div className="system-info">

            <small>
              AI Engine
            </small>

            <strong>
              Active
            </strong>

          </div>


          <div className="system-info">

            <small>
              Database
            </small>

            <strong className="database-online">
              ● Connected
            </strong>

          </div>

        </div>

      </div>


      {/* SAVE */}

      <div className="settings-footer">

        <span>
          Changes are saved to Firebase.
        </span>


        {isAdmin && (
          <button
            className="save-settings-btn"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "✓ Save Settings"}
          </button>
        )}

      </div>

    </div>
  );
}


/* ==========================================
   TOGGLE COMPONENT
========================================== */

function SettingToggle({
  title,
  description,
  enabled,
  setEnabled,
  disabled = false,
}) {
  return (
    <div className="setting-toggle-row">

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>


      <button
        disabled={disabled}
        className={
          enabled
            ? "toggle active"
            : "toggle"
        }
        onClick={() =>
          setEnabled(!enabled)
        }
      >
        <span></span>
      </button>

    </div>
  );
}


export default Settings;
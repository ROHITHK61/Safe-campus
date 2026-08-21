import { useEffect, useState } from "react";

import {
  getAlerts,
  deleteAllAlerts,
} from "../firebase/firestore";

function Alerts() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [filter, setFilter] = useState("All");

  // Load alerts from localStorage
  const [alertList, setAlertList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const firebaseAlerts = await getAlerts();

        setAlertList(
          firebaseAlerts
        );
      } catch (error) {
        console.error(
          "Error loading alerts:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  // Load read alerts from localStorage
  const [readAlerts, setReadAlerts] = useState(() => {
    const savedReadAlerts = localStorage.getItem("readAlerts");

    return savedReadAlerts
      ? JSON.parse(savedReadAlerts)
      : [];
  });

  // Save read status
  useEffect(() => {
    localStorage.setItem(
      "readAlerts",
      JSON.stringify(readAlerts)
    );
  }, [readAlerts]);

  // Filter alerts
  const filteredAlerts =
    filter === "All"
      ? alertList
      : alertList.filter(
        (alert) => alert.type === filter
      );

  // Mark one alert as read
  const markAsRead = (id) => {
    setReadAlerts((previous) => {
      if (previous.includes(id)) {
        return previous;
      }

      return [...previous, id];
    });
  };

  // Mark all alerts as read
  const markAllAsRead = () => {
    setReadAlerts(
      alertList.map((alert) => alert.id)
    );
  };

  // Clear all alerts
  const clearAllAlerts = async () => {
    if (alertList.length === 0) {
      return;
    }

    const confirmClear = window.confirm(
      "Are you sure you want to clear all alerts?"
    );

    if (!confirmClear) {
      return;
    }

    try {
      await deleteAllAlerts();

      setAlertList([]);
      setReadAlerts([]);

      alert("All alerts cleared!");
    } catch (error) {
      console.error(
        "Error clearing alerts:",
        error
      );

      alert("Failed to clear alerts.");
    }
  };

  const criticalCount = alertList.filter(
    (alert) => alert.type === "Critical"
  ).length;

  const unreadCount = alertList.filter(
    (alert) => !readAlerts.includes(alert.id)
  ).length;

  return (
    <div className="alerts-page">

      {/* HEADER */}

      <div className="alerts-header">

        <div>
          <h1>Alerts & Notifications</h1>

          <p>
            Real-time campus safety alerts and notifications
          </p>
        </div>

        <div className="alert-header-actions">

          <button
            type="button"
            className="mark-all-btn"
            onClick={markAllAsRead}
          >
            ✓ Mark All as Read
          </button>

          {isAdmin && (
            <button
              type="button"
              className="clear-all-btn"
              onClick={clearAllAlerts}
            >
              🗑 Clear All
            </button>
          )}

        </div>

      </div>


      {/* SUMMARY */}

      <div className="alert-summary">

        <div className="alert-summary-card">

          <span>🔔</span>

          <div>
            <small>Total Alerts</small>

            <strong>
              {alertList.length}
            </strong>
          </div>

        </div>


        <div className="alert-summary-card critical-alert">

          <span>🔴</span>

          <div>
            <small>Critical</small>

            <strong>
              {criticalCount}
            </strong>
          </div>

        </div>


        <div className="alert-summary-card unread-alert">

          <span>📩</span>

          <div>
            <small>Unread</small>

            <strong>
              {unreadCount}
            </strong>
          </div>

        </div>

      </div>


      {/* FILTERS */}

      <div className="alert-filters">

        {[
          "All",
          "Critical",
          "High",
          "Medium",
          "Low",
        ].map((item) => (

          <button
            key={item}
            className={
              filter === item
                ? "alert-filter active"
                : "alert-filter"
            }
            onClick={() => setFilter(item)}
          >
            {item}
          </button>

        ))}

      </div>


      {/* ALERT PANEL */}

      <div className="alerts-panel">

        <div className="alerts-panel-header">

          <div>
            <h2>Recent Alerts</h2>

            <p>
              {filteredAlerts.length} alerts
            </p>
          </div>

          <span className="live-indicator">
            ● LIVE
          </span>

        </div>


        {/* ALERT LIST */}

        <div className="alert-list">

          {filteredAlerts.length === 0 ? (
            <div className="no-alerts">
              <div className="no-alerts-icon">🔕</div>
              <h3>No Alerts</h3>
              <p>There are no alerts to display.</p>
            </div>
          ) : (

            filteredAlerts.map((alert) => {

              const isRead =
                readAlerts.includes(alert.id);

              return (

                <div
                  key={alert.id}
                  className={
                    isRead
                      ? "alert-item read"
                      : "alert-item unread"
                  }
                >

                  {/* ICON */}

                  <div
                    className={`alert-icon ${alert.type.toLowerCase()}`}
                  >
                    {alert.icon}
                  </div>


                  {/* CONTENT */}

                  <div className="alert-content">

                    <div className="alert-title-row">

                      <h3>
                        {alert.title}
                      </h3>

                      {!isRead && (
                        <span className="new-badge">
                          NEW
                        </span>
                      )}

                    </div>


                    <p>
                      {alert.message}
                    </p>


                    <div className="alert-meta">

                      <span>
                        📍 {alert.location}
                      </span>

                      <span>
                        🕒 {alert.time}
                      </span>

                    </div>

                  </div>


                  {/* RIGHT SIDE */}

                  <div className="alert-right">

                    <span
                      className={`alert-type ${alert.type.toLowerCase()}`}
                    >
                      {alert.type}
                    </span>


                    {!isRead && (

                      <button
                        className="read-btn"
                        onClick={() =>
                          markAsRead(alert.id)
                        }
                      >
                        Mark Read
                      </button>

                    )}

                  </div>

                </div>

              );
            })

          )}

        </div>

      </div>

    </div>
  );
}

export default Alerts;
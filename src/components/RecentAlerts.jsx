import { useEffect, useState } from "react";
import { getAlerts } from "../firebase/firestore";

function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const firebaseAlerts = await getAlerts();

        setAlerts(firebaseAlerts);
      } catch (error) {
        console.error(
          "Error loading dashboard alerts:",
          error
        );
      }
    };

    loadAlerts();
  }, []);

  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="panel alerts-panel">

      <div className="panel-header">
        <h2>🔔 RECENT ALERTS</h2>
        <span>View All</span>
      </div>

      <div className="alerts-list">

        {recentAlerts.map((alert) => (

          <div
            className="alert-item"
            key={alert.id}
          >

            <div className="alert-icon">
              {alert.icon || "!"}
            </div>

            <div className="alert-info">

              <strong>
                {alert.title}
              </strong>

              <p>
                {alert.message}
              </p>

            </div>

            <span className="alert-time">
              {alert.time}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentAlerts;
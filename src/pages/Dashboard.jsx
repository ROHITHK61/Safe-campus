import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import StatCard from "../components/Statcard";
import ResponderStatus from "../components/ResponderStatus";
import ResponseTime from "../components/ResponseTime";
import IncidentAnalytics from "../components/IncidentAnalytics";
import RecentAlerts from "../components/RecentAlerts";
import QuickActions from "../components/QuickActions";

import { getIncidents } from "../firebase/firestore";

function Dashboard() {

  const [incidents, setIncidents] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadIncidents = async () => {
    try {
      const firebaseIncidents = await getIncidents();

      setIncidents(firebaseIncidents);
    } catch (error) {
      console.error(
        "Error loading dashboard incidents:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadIncidents();
}, []);

  const criticalCount = incidents.filter(
    incident => incident.severity === "Critical"
  ).length;

  const highCount = incidents.filter(
    incident => incident.severity === "High"
  ).length;

  const mediumCount = incidents.filter(
    incident => incident.severity === "Medium"
  ).length;

  const lowCount = incidents.filter(
    incident => incident.severity === "Low"
  ).length;

  const activeIncidents = incidents
    .filter((incident) => incident.status !== "Resolved")
    .slice(0, 4);

  return (
    <div className="dashboard">

      {/* PAGE TITLE */}
      <div className="page-title">
        <div>
          <h1>Campus Dashboard</h1>
          <p>Real-time campus safety intelligence</p>
        </div>
      </div>


      {/* STAT CARDS */}
      <div className="stats-grid">

        <StatCard
          title="CRITICAL"
          number={criticalCount}
          color="critical"
          icon="⚠️"
        />

        <StatCard
          title="HIGH"
          number={highCount}
          color="high"
          icon="🚨"
        />

        <StatCard
          title="MEDIUM"
          number={mediumCount}
          color="medium"
          icon="📋"
        />

        <StatCard
          title="LOW"
          number={lowCount}
          color="low"
          icon="🔔"
        />

      </div>


      {/* MAP + ACTIVE INCIDENTS */}
      <div className="dashboard-grid">

        {/* CAMPUS MAP */}
        <div className="panel campus-map">

          <h2>🗺️ LIVE CAMPUS MAP</h2>

          <div className="map-placeholder">

            <div className="map-marker fire">
              🔥
            </div>

            <div className="map-marker medical">
              ✚
            </div>

            <div className="map-marker responder">
              🏃
            </div>

            <div className="map-label label-a">
              Block A
            </div>

            <div className="map-label label-b">
              Medical Center
            </div>

            <div className="map-label label-c">
              Sports Complex
            </div>

            <div className="map-center">
              Campus Map
            </div>

          </div>

        </div>


        {/* ACTIVE INCIDENTS */}
        <div className="panel active-incidents">

          <div className="panel-header">

            <h2>ACTIVE INCIDENTS</h2>

            <Link to="/incidents" className="view-all-link">
              View All →
            </Link>

          </div>


          {/* DYNAMIC INCIDENTS */}
          {activeIncidents.map((incident, index) => (

            <div className="incident" key={incident.id}>

              <div
                className={`incident-icon ${incident.type === "Fire"
                  ? "fire-bg"
                  : incident.type === "Medical Emergency"
                    ? "medical-bg"
                    : incident.type === "Security Threat"
                      ? "security-bg"
                      : "accident-bg"
                  }`}
              >

                {incident.type === "Fire" && "🔥"}
                {incident.type === "Medical Emergency" && "🚑"}
                {incident.type === "Security Threat" && "🛡️"}
                {incident.type === "Accident" && "🏃"}

              </div>


              <div className="incident-info">

                <strong>
                  {incident.type.toUpperCase()}
                </strong>

                <p>
                  {incident.location}
                </p>

                <small>
                  {incident.time} • {incident.affected}{" "}
                  {incident.affected === 1
                    ? "person"
                    : "people"} affected
                </small>

              </div>


              <div
                className={`priority ${incident.severity.toLowerCase()}-text`}
              >

                {incident.severity.toUpperCase()}

                <strong>
                  P{index + 1}
                </strong>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* RESPONDER + RESPONSE TIME + ANALYTICS */}
      <div className="bottom-grid">

        <ResponderStatus />

        <ResponseTime />

        <IncidentAnalytics />

      </div>


      {/* ALERTS + QUICK ACTIONS */}
      <div className="final-grid">

        <RecentAlerts />

        <QuickActions />

      </div>

    </div>
  );
}

export default Dashboard;
import { useEffect, useState } from "react";

import {
  getIncidents,
  addIncident,
  updateIncident,
  addAlert,
} from "../firebase/firestore";

function Incidents() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // INCIDENT DATA
  const [incidentList, setIncidentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Save incidents
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const firebaseIncidents = await getIncidents();
        console.log("FIREBASE INCIDENTS:", firebaseIncidents);

        setIncidentList(firebaseIncidents);
      } catch (error) {
        console.error(
          "Error loading incidents:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  // NEW INCIDENT FORM
  const [newIncident, setNewIncident] = useState({
    type: "Fire",
    location: "",
    severity: "Critical",
    affected: 0,
    description: "",
  });

  // STATISTICS
  const totalIncidents = incidentList.length;

  const criticalIncidents = incidentList.filter(
    (incident) => incident.severity === "Critical"
  ).length;

  const activeIncidents = incidentList.filter(
    (incident) => incident.status !== "Resolved"
  ).length;

  const resolvedIncidents = incidentList.filter(
    (incident) => incident.status === "Resolved"
  ).length;

  // FILTER
  const filteredIncidents = incidentList.filter((incident) => {
    const matchesSearch =
      incident.type
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      incident.location
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      incident.id
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSeverity =
      severity === "All" ||
      incident.severity === severity;

    const matchesStatus =
      status === "All" ||
      incident.status === status;

    const matchesDate =
      selectedDate === "" ||
      incident.date === selectedDate;

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesStatus &&
      matchesDate
    );
  });

  // =====================================================
  // REPORT NEW INCIDENT
  // =====================================================

  const handleSubmitIncident = async (e) => {
    e.preventDefault();

    const now = new Date();

    const existingNumbers = incidentList
      .map((incident) => {
        const match = incident.id?.match(/^INC-(\d+)$/);
        return match ? Number(match[1]) : 0;
      });

    const nextNumber =
      existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1
        : 1;

    const newIncidentData = {
      id: `INC-${String(nextNumber).padStart(3, "0")}`,

      type: newIncident.type,

      location: newIncident.location,

      severity: newIncident.severity,

      status: "Active",

      responseTime:
        Math.floor(Math.random() * 421) + 60,

      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      affected: Number(newIncident.affected),

      description: newIncident.description,
    };

    // =================================================
    // SAVE INCIDENT
    // =================================================

    try {
      const savedIncident =
        await addIncident(newIncidentData);

      setIncidentList((prev) => [
        savedIncident,
        ...prev,
      ]);
    } catch (error) {
      console.error(
        "Error saving incident:",
        error
      );

      alert("Failed to save incident.");
      return;
    }
    // =================================================
    // CREATE ALERT AUTOMATICALLY
    // =================================================

    const newAlert = {
      id: `ALERT-${Date.now()}`,

      type: newIncidentData.severity,

      icon:
        newIncidentData.type === "Fire"
          ? "🔥"
          : newIncidentData.type ===
            "Medical Emergency"
            ? "🚑"
            : newIncidentData.type ===
              "Security Threat"
              ? "🛡️"
              : newIncidentData.type ===
                "Accident"
                ? "🏃"
                : "🚪",

      title: `New ${newIncidentData.severity.toLowerCase()} incident reported`,

      message: `${newIncidentData.type} in ${newIncidentData.location}`,

      location: newIncidentData.location,

      time: newIncidentData.time,
    };

    try {
      await addAlert(newAlert);

      console.log(
        "✅ Alert added to Firebase"
      );
    } catch (error) {
      console.error(
        "❌ Error creating alert:",
        error
      );
    }

    // SUCCESS
    alert(
      "Incident reported successfully!"
    );

    // Close modal
    setShowReportModal(false);

    // Reset form
    setNewIncident({
      type: "Fire",
      location: "",
      severity: "Critical",
      affected: 0,
      description: "",
    });
  };

  // =====================================================
  // UPDATE INCIDENT STATUS
  // =====================================================

  const handleStatusUpdate = async () => {
    if (!selectedIncident?.firebaseId) {
      alert("Firebase ID not found.");
      return;
    }

    try {
      await updateIncident(
        selectedIncident.firebaseId,
        {
          status: newStatus,
        }
      );

      setIncidentList((prev) =>
        prev.map((incident) =>
          incident.firebaseId ===
            selectedIncident.firebaseId
            ? {
              ...incident,
              status: newStatus,
            }
            : incident
        )
      );

      setSelectedIncident(null);

      alert("Incident status updated!");
    } catch (error) {
      console.error(
        "Error updating incident:",
        error
      );

      alert("Failed to update incident.");
    }
  };

  return (
    <div className="incidents-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="incidents-header">

        <div>
          <h1>
            Incident Management
          </h1>

          <p>
            Monitor and manage campus safety incidents
          </p>
        </div>

        <button
          className="report-incident-btn"
          onClick={() =>
            setShowReportModal(true)
          }
        >
          🚨 Report Incident
        </button>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="incident-stats">

        <div className="incident-stat">

          <span>🚨</span>

          <div>
            <small>
              Total Incidents
            </small>

            <strong>
              {totalIncidents}
            </strong>
          </div>

        </div>


        <div className="incident-stat critical-stat">

          <span>⚠️</span>

          <div>
            <small>
              Critical
            </small>

            <strong>
              {criticalIncidents}
            </strong>
          </div>

        </div>


        <div className="incident-stat active-stat">

          <span>🔴</span>

          <div>
            <small>
              Active
            </small>

            <strong>
              {activeIncidents}
            </strong>
          </div>

        </div>


        <div className="incident-stat resolved-stat">

          <span>✅</span>

          <div>
            <small>
              Resolved
            </small>

            <strong>
              {resolvedIncidents}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="incident-controls">

        <div className="search-box">

          🔍

          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={severity}
          onChange={(e) =>
            setSeverity(e.target.value)
          }
        >

          <option value="All">
            All Severity
          </option>

          <option value="Critical">
            Critical
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>

        </select>


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Responding">
            Responding
          </option>

          <option value="Investigating">
            Investigating
          </option>

          <option value="Resolved">
            Resolved
          </option>

        </select>


        <input
          type="text"
          placeholder="Filter by date (e.g. 19 Aug 2026)"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />

      </div>


      {/* =================================================
          INCIDENT TABLE
      ================================================= */}

      <div className="incidents-table-panel">

        <div className="table-header">

          <div>

            <h2>
              All Incidents
            </h2>

            <p>
              {filteredIncidents.length} incidents found
            </p>

          </div>

        </div>


        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>INCIDENT</th>

                <th>LOCATION</th>

                <th>SEVERITY</th>

                <th>STATUS</th>

                <th>TIME</th>

                <th>AFFECTED</th>

                <th>ACTION</th>

              </tr>

            </thead>


            <tbody>

              {filteredIncidents.map(
                (incident) => (

                  <tr key={incident.firebaseId}>

                    <td>
                      <strong>
                        {incident.id}
                      </strong>
                    </td>


                    <td>

                      <div className="incident-name">

                        <span>

                          {incident.type ===
                            "Fire"
                            ? "🔥"
                            : incident.type ===
                              "Medical Emergency"
                              ? "🚑"
                              : incident.type ===
                                "Security Threat"
                                ? "🛡️"
                                : incident.type ===
                                  "Accident"
                                  ? "🏃"
                                  : "🚪"}

                        </span>

                        <strong>
                          {incident.type}
                        </strong>

                      </div>

                    </td>


                    <td>
                      {incident.location}
                    </td>


                    <td>

                      <span
                        className={`severity-badge ${incident.severity.toLowerCase()}`}
                      >
                        {incident.severity}
                      </span>

                    </td>


                    <td>

                      <span
                        className={`status-badge ${incident.status
                          .toLowerCase()
                          .replace(
                            " ",
                            "-"
                          )}`}
                      >
                        {incident.status}
                      </span>

                    </td>


                    <td>
                      {incident.time}
                    </td>


                    <td>
                      {incident.affected}
                    </td>


                    <td>

                      <button
                        className="view-btn"
                        onClick={() => {

                          setSelectedIncident(
                            incident
                          );

                          setNewStatus(
                            incident.status
                          );

                        }}
                      >
                        View
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =================================================
          INCIDENT DETAILS MODAL
      ================================================= */}

      {selectedIncident && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Incident Details
                </h2>

                <p>
                  Detailed information about this incident
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedIncident(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="incident-details">

              <div>

                <small>
                  Incident ID
                </small>

                <strong>
                  {selectedIncident.id}
                </strong>

              </div>


              <div>

                <small>
                  Incident Type
                </small>

                <strong>
                  {selectedIncident.type}
                </strong>

              </div>


              <div>

                <small>
                  Location
                </small>

                <strong>
                  {selectedIncident.location}
                </strong>

              </div>


              <div>

                <small>
                  Severity
                </small>

                <strong>
                  {selectedIncident.severity}
                </strong>

              </div>


              <div>

                <small>
                  Status
                </small>

                {isAdmin ? (
                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value)
                    }
                  >
                    <option>Active</option>
                    <option>Responding</option>
                    <option>Investigating</option>
                    <option>Resolved</option>
                  </select>
                ) : (
                  <strong>
                    {selectedIncident.status}
                  </strong>
                )}

              </div>


              <div>

                <small>
                  Time
                </small>

                <strong>
                  {selectedIncident.time}
                </strong>

              </div>


              <div>

                <small>
                  People Affected
                </small>

                <strong>
                  {selectedIncident.affected}
                </strong>

              </div>

            </div>


            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setSelectedIncident(null)
                }
              >
                Close
              </button>


              {isAdmin && (
                <button
                  className="submit-incident-btn"
                  onClick={handleStatusUpdate}
                >
                  ✓ Update Status
                </button>
              )}

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          REPORT INCIDENT MODAL
      ================================================= */}

      {showReportModal && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Report New Incident
                </h2>

                <p>
                  Provide details about the campus incident
                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowReportModal(false)
                }
              >
                ✕
              </button>

            </div>


            <form
              className="report-form"
              onSubmit={
                handleSubmitIncident
              }
            >

              {/* TYPE */}

              <label>

                Incident Type

                <select
                  value={newIncident.type}
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      type: e.target.value,
                    })
                  }
                >

                  <option>
                    Fire
                  </option>

                  <option>
                    Medical Emergency
                  </option>

                  <option>
                    Security Threat
                  </option>

                  <option>
                    Accident
                  </option>

                  <option>
                    Unauthorized Entry
                  </option>

                </select>

              </label>


              {/* LOCATION */}

              <label>

                Location

                <input
                  type="text"
                  placeholder="Enter incident location"
                  value={
                    newIncident.location
                  }
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      location:
                        e.target.value,
                    })
                  }
                  required
                />

              </label>


              {/* SEVERITY */}

              <label>

                Severity

                <select
                  value={
                    newIncident.severity
                  }
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      severity:
                        e.target.value,
                    })
                  }
                >

                  <option>
                    Critical
                  </option>

                  <option>
                    High
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    Low
                  </option>

                </select>

              </label>


              {/* AFFECTED */}

              <label>

                People Affected

                <input
                  type="number"
                  min="0"
                  value={
                    newIncident.affected
                  }
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      affected:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                />

              </label>


              {/* DESCRIPTION */}

              <label>

                Description

                <textarea
                  placeholder="Describe what happened..."
                  rows="4"
                  value={
                    newIncident.description
                  }
                  onChange={(e) =>
                    setNewIncident({
                      ...newIncident,
                      description:
                        e.target.value,
                    })
                  }
                  required
                />

              </label>


              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowReportModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="submit-incident-btn"
                >
                  🚨 Submit Incident
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Incidents;
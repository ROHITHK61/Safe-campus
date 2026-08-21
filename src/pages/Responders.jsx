import { useEffect, useState } from "react";

import {
  getResponders,
  addResponder,
  updateResponder,
  deleteResponder,
  getIncidents,
  updateIncident,
} from "../firebase/firestore";

function Responders() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResponder, setSelectedResponder] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState("");

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const firebaseIncidents = await getIncidents();

        setIncidents(firebaseIncidents);
      } catch (error) {
        console.error(
          "Error loading incidents:",
          error
        );
      }
    };

    loadIncidents();
  }, []);

  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResponders = async () => {
      try {
        const firebaseResponders = await getResponders();

        setResponders(firebaseResponders);
      } catch (error) {
        console.error(
          "Error loading responders:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadResponders();
  }, []);

  const [newResponder, setNewResponder] = useState({
    name: "",
    team: "Emergency Response",
    location: "",
    status: "Available",
    phone: "",
  });

  // COUNTS
  const totalResponders = responders.length;

  const availableCount = responders.filter(
    (r) => r.status === "Available"
  ).length;

  const busyCount = responders.filter(
    (r) => r.status === "Busy"
  ).length;

  const offlineCount = responders.filter(
    (r) => r.status === "Offline"
  ).length;

  // SEARCH + FILTER
  const filteredResponders = responders.filter((responder) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      responder.name.toLowerCase().includes(searchText) ||
      responder.team.toLowerCase().includes(searchText) ||
      responder.location.toLowerCase().includes(searchText) ||
      responder.id.toLowerCase().includes(searchText);

    const matchesStatus =
      status === "All" ||
      responder.status === status;

    return matchesSearch && matchesStatus;
  });

  // ADD RESPONDER
  const handleAddResponder = async (e) => {
    e.preventDefault();

    const newResponderData = {
      id: `R-${String(
        Math.max(
          0,
          ...responders.map((r) =>
            Number(r.id.replace("R-", ""))
          )
        ) + 1
      ).padStart(3, "0")}`,

      name: newResponder.name,
      team: newResponder.team,
      location: newResponder.location,
      status: newResponder.status,
      incidents: 0,
      phone: newResponder.phone,
    };

    try {
      const savedResponder =
        await addResponder(newResponderData);

      setResponders((prev) => [
        ...prev,
        savedResponder,
      ]);

      setNewResponder({
        name: "",
        team: "Emergency Response",
        location: "",
        status: "Available",
        phone: "",
      });

      setShowAddModal(false);

      alert("Responder added successfully!");
    } catch (error) {
      console.error(
        "Error adding responder:",
        error
      );

      alert("Failed to add responder.");
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (firebaseId, newStatus) => {
    try {
      await updateResponder(firebaseId, {
        status: newStatus,
      });

      setResponders((prev) =>
        prev.map((responder) =>
          responder.firebaseId === firebaseId
            ? {
              ...responder,
              status: newStatus,
            }
            : responder
        )
      );
    } catch (error) {
      console.error(
        "Error updating responder:",
        error
      );

      alert("Failed to update responder status.");
    }
  };

  // DELETE RESPONDER
  const handleDelete = async (firebaseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this responder?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResponder(firebaseId);

      setResponders((prev) =>
        prev.filter(
          (responder) =>
            responder.firebaseId !== firebaseId
        )
      );

      setSelectedResponder(null);

      alert("Responder deleted!");
    } catch (error) {
      console.error(
        "Error deleting responder:",
        error
      );

      alert("Failed to delete responder.");
    }
  };

  return (
    <div className="responders-page">

      {/* HEADER */}

      <div className="responders-header">

        <div>
          <h1>Responder Management</h1>

          <p>
            Monitor and manage campus emergency responders
          </p>
        </div>

        {isAdmin && (
          <button
            className="add-responder-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Responder
          </button>
        )}

      </div>


      {/* STATS */}

      <div className="responder-stats">

        <div className="responder-stat">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <small>Total Responders</small>
            <strong>{totalResponders}</strong>
          </div>

        </div>


        <div className="responder-stat available">

          <div className="stat-icon">
            🟢
          </div>

          <div>
            <small>Available</small>
            <strong>{availableCount}</strong>
          </div>

        </div>


        <div className="responder-stat busy">

          <div className="stat-icon">
            🟠
          </div>

          <div>
            <small>Busy</small>
            <strong>{busyCount}</strong>
          </div>

        </div>


        <div className="responder-stat offline">

          <div className="stat-icon">
            🔴
          </div>

          <div>
            <small>Offline</small>
            <strong>{offlineCount}</strong>
          </div>

        </div>

      </div>


      {/* FILTERS */}

      <div className="responder-controls">

        <div className="responder-search">

          🔍

          <input
            type="text"
            placeholder="Search responders..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Available">
            Available
          </option>

          <option value="Busy">
            Busy
          </option>

          <option value="Offline">
            Offline
          </option>

        </select>

      </div>


      {/* RESPONDER CARDS */}

      <div className="responders-grid">

        {filteredResponders.length === 0 ? (

          <div className="no-responders">
            No responders found.
          </div>

        ) : (

          filteredResponders.map((responder) => (

            <div
              className="responder-card"
              key={responder.id}
            >

              <div className="responder-card-top">

                <div className="responder-avatar">
                  {responder.name.charAt(0)}
                </div>


                <span
                  className={`responder-status ${responder.status.toLowerCase()}`}
                >
                  ● {responder.status}
                </span>

              </div>


              <h3>
                {responder.name}
              </h3>


              <p className="responder-team">
                {responder.team}
              </p>


              <div className="responder-details">

                <div>
                  <span>🆔 ID</span>
                  <strong>
                    {responder.id}
                  </strong>
                </div>


                <div>
                  <span>📍 Location</span>
                  <strong>
                    {responder.location}
                  </strong>
                </div>


                <div>
                  <span>🚨 Incidents</span>
                  <strong>
                    {responder.incidents}
                  </strong>
                </div>

                {responder.assignedIncident && (
                  <div>
                    <span>📋 Assigned Incident</span>
                    <strong>
                      {incidents.find(
                        (incident) =>
                          incident.firebaseId ===
                          responder.assignedIncident
                      )?.id || "Assigned"}
                    </strong>
                  </div>
                )}


                <div>
                  <span>📞 Contact</span>
                  <strong>
                    {responder.phone}
                  </strong>
                </div>

              </div>


              {/* STATUS */}

              {isAdmin ? (
                <select
                  className={`responder-status-select ${responder.status.toLowerCase()}`}
                  value={responder.status}
                  onChange={(e) =>
                    handleStatusChange(
                      responder.firebaseId,
                      e.target.value
                    )
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Offline">Offline</option>
                </select>
              ) : (
                <div
                  className={`responder-status-select ${responder.status.toLowerCase()}`}
                >
                  {responder.status}
                </div>
              )}

              {isAdmin && (
                <div className="responder-card-actions">

                  <button
                    className="assign-btn"
                    onClick={() =>
                      setSelectedResponder(responder)
                    }
                  >
                    Assign Incident
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(responder.firebaseId)
                    }
                  >
                    🗑️ Delete Responder
                  </button>

                </div>
              )}

            </div>

          ))

        )}

      </div>


      {/* ADD RESPONDER MODAL */}

      {showAddModal && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Add New Responder
                </h2>

                <p>
                  Add a campus emergency responder
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ✕
              </button>

            </div>


            <form
              className="report-form"
              onSubmit={handleAddResponder}
            >

              <label>

                Name

                <input
                  type="text"
                  placeholder="Enter responder name"
                  value={newResponder.name}
                  onChange={(e) =>
                    setNewResponder({
                      ...newResponder,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </label>


              <label>

                Team

                <select
                  value={newResponder.team}
                  onChange={(e) =>
                    setNewResponder({
                      ...newResponder,
                      team: e.target.value,
                    })
                  }
                >

                  <option>
                    Emergency Response
                  </option>

                  <option>
                    Medical Team
                  </option>

                  <option>
                    Security Team
                  </option>

                </select>

              </label>


              <label>

                Location

                <input
                  type="text"
                  placeholder="Enter current location"
                  value={newResponder.location}
                  onChange={(e) =>
                    setNewResponder({
                      ...newResponder,
                      location: e.target.value,
                    })
                  }
                  required
                />

              </label>


              <label>

                Status

                <select
                  value={newResponder.status}
                  onChange={(e) =>
                    setNewResponder({
                      ...newResponder,
                      status: e.target.value,
                    })
                  }
                >

                  <option>
                    Available
                  </option>

                  <option>
                    Busy
                  </option>

                  <option>
                    Offline
                  </option>

                </select>

              </label>


              <label>

                Phone

                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newResponder.phone}
                  onChange={(e) =>
                    setNewResponder({
                      ...newResponder,
                      phone: e.target.value,
                    })
                  }
                  required
                />

              </label>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="submit-incident-btn"
                >
                  + Add Responder
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ASSIGN INCIDENT MODAL */}

      {selectedResponder && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Assign Incident
                </h2>

                <p>
                  Assign an incident to{" "}
                  <strong>
                    {selectedResponder.name}
                  </strong>
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedResponder(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="report-form">

              <label>

                Select Incident

                <select
                  value={selectedIncidentId}
                  onChange={(e) =>
                    setSelectedIncidentId(e.target.value)
                  }
                >
                  <option value="">
                    Select an incident
                  </option>

                  {incidents.map((incident) => (
                    <option
                      key={incident.firebaseId}
                      value={incident.firebaseId}
                    >
                      {incident.id} - {incident.type} -{" "}
                      {incident.location}
                    </option>
                  ))}
                </select>

              </label>


              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setSelectedResponder(null)
                  }
                >
                  Cancel
                </button>


                <button
                  className="submit-incident-btn"
                  onClick={async () => {
                    if (!selectedIncidentId) {
                      alert("Please select an incident.");
                      return;
                    }

                    try {
                      await updateResponder(
                        selectedResponder.firebaseId,
                        {
                          assignedIncident: selectedIncidentId,
                          status: "Busy",
                        }
                      );
                      await updateIncident(
                        selectedIncidentId,
                        {
                          status: "Responding",
                        }
                      );

                      setResponders((prev) =>
                        prev.map((responder) =>
                          responder.firebaseId ===
                            selectedResponder.firebaseId
                            ? {
                              ...responder,
                              assignedIncident: selectedIncidentId,
                              status: "Busy",
                            }
                            : responder
                        )
                      );

                      alert(
                        `Incident assigned to ${selectedResponder.name}`
                      );

                      setSelectedIncidentId("");
                      setSelectedResponder(null);

                    } catch (error) {
                      console.error(
                        "Error assigning incident:",
                        error
                      );

                      alert("Failed to assign incident.");
                    }
                  }}
                >
                  ✓ Assign Incident
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Responders;
import { useEffect, useState } from "react";
import campusMap from "../assets/campus-map.png";

function Map() {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedResponder, setSelectedResponder] = useState(null);

  const [mapFilter, setMapFilter] = useState("all");

  /* ================================
     INCIDENTS
  ================================= */

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem("incidents");

    return saved ? JSON.parse(saved) : [];
  });


  /* ================================
     RESPONDERS
  ================================= */

  const [responders, setResponders] = useState(() => {
    const saved = localStorage.getItem("responders");

    return saved ? JSON.parse(saved) : [];
  });

  const buildings = [
    {
      id: "B001",
      name: "Block A",
      x: "48%",
      y: "56%",
    },
    {
      id: "B002",
      name: "Block B",
      x: "40%",
      y: "56%",
    },
    {
      id: "B003",
      name: "Block C",
      x: "34%",
      y: "56%",
    },
    {
      id: "B004",
      name: "Medical Center",
      x: "65%",
      y: "39%",
    },
    {
      id: "B005",
      name: "Hostel 2",
      x: "84%",
      y: "68%",
    },
    {
      id: "B006",
      name: "Sports Complex",
      x: "18%",
      y: "47%",
    },
    {
      id: "B007",
      name: "Main Gate",
      x: "57%",
      y: "5%",
    },
  ];

  /* ================================
     LOAD LOCAL STORAGE DATA
  ================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const firebaseResponders = await getResponders();
        const firebaseIncidents = await getIncidents();

        setResponders(firebaseResponders);
        setIncidents(firebaseIncidents);

      } catch (error) {
        console.error(
          "Error loading responders/incidents:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();

    window.addEventListener(
      "incidentsUpdated",
      loadData
    );

    window.addEventListener(
      "respondersUpdated",
      loadData
    );

    window.addEventListener(
      "storage",
      loadData
    );

    return () => {
      window.removeEventListener(
        "incidentsUpdated",
        loadData
      );

      window.removeEventListener(
        "respondersUpdated",
        loadData
      );

      window.removeEventListener(
        "storage",
        loadData
      );
    };
  }, []);


  /* ================================
     CAMPUS POSITIONS
  ================================= */

  const getPosition = (location) => {
    const positions = {
      /* ================================
         MAIN BUILDINGS
      ================================= */

      "Block A": {
        x: "48%",
        y: "56%",
      },

      "Block B": {
        x: "40%",
        y: "56%",
      },

      "Block C": {
        x: "34%",
        y: "56%",
      },

      "Medical Center": {
        x: "65%",
        y: "39%",
      },

      /* ================================
         HOSTELS
      ================================= */

      "Hostel 2": {
        x: "84%",
        y: "68%",
      },

      "Boys Hostel": {
        x: "84%",
        y: "76%",
      },

      /* ================================
         SPORTS
      ================================= */

      "Sports Complex": {
        x: "18%",
        y: "47%",
      },

      /* ================================
         MAIN GATE
      ================================= */

      "Main Gate": {
        x: "57%",
        y: "5%",
      },

      /* ================================
         LABS / BLOCKS
      ================================= */

      "Servo Lab": {
        x: "52%",
        y: "48%",
      },

      "SF S1": {
        x: "65%",
        y: "53%",
      },

      "main auditorium": {
        x: "43%",
        y: "57%",
      },

      /* ================================
         MESS
      ================================= */

      "Mess": {
        x: "38%",
        y: "38%",
      },
    };

    return (
      positions[location] || {
        x: "50%",
        y: "50%",
      }
    );
  };


  /* ================================
     INCIDENT ICON
  ================================= */

  const getIcon = (type) => {

    if (type === "Fire") {
      return "🔥";
    }

    if (type === "Medical Emergency") {
      return "🚑";
    }

    if (type === "Security Threat") {
      return "🛡️";
    }

    if (type === "Accident") {
      return "🏃";
    }

    return "🚨";
  };


  /* ================================
     FILTER
  ================================= */

  const handleFilter = (filter) => {
    setMapFilter(filter);

    setSelectedIncident(null);

    setSelectedResponder(null);
  };


  /* ================================
     RESPONDER STATUS CLASS
  ================================= */

  const getResponderStatusClass = (status) => {

    if (status === "Available") {
      return "available";
    }

    if (status === "Busy") {
      return "busy";
    }

    if (status === "Offline") {
      return "offline";
    }

    return "";
  };


  return (
    <div className="map-page">


      {/* ================================
          HEADER
      ================================= */}

      <div className="map-page-header">

        <div>

          <h1>
            Campus Map
          </h1>

          <p>
            Real-time incident and responder locations
          </p>

        </div>


        <div className="map-live">

          <span>●</span>

          LIVE

        </div>

      </div>


      {/* ================================
          CONTROLS
      ================================= */}

      <div className="map-controls">

        <button
          className={`map-control ${mapFilter === "all"
            ? "active"
            : ""
            }`}
          onClick={() => handleFilter("all")}
        >
          🗺️ All
        </button>


        <button
          className={`map-control ${mapFilter === "incidents"
            ? "active"
            : ""
            }`}
          onClick={() =>
            handleFilter("incidents")
          }
        >
          🚨 Incidents
        </button>


        <button
          className={`map-control ${mapFilter === "responders"
            ? "active"
            : ""
            }`}
          onClick={() =>
            handleFilter("responders")
          }
        >
          👮 Responders
        </button>


        <button
          className={`map-control ${mapFilter === "buildings"
            ? "active"
            : ""
            }`}
          onClick={() =>
            handleFilter("buildings")
          }
        >
          🏢 Buildings
        </button>

      </div>


      {/* ================================
          CAMPUS MAP
      ================================= */}

      <div className="campus-map-panel">

        <div className="campus-image-wrapper">


          {/* SATELLITE IMAGE */}

          <img
            src={campusMap}
            alt="Bannari Amman Institute of Technology campus"
            className="campus-map-image"
          />


          {/* ================================
              INCIDENT MARKERS
          ================================= */}

          {(mapFilter === "all" ||
            mapFilter === "incidents") &&

            incidents.map((incident) => {

              const position =
                getPosition(
                  incident.location
                );

              return (

                <button
                  key={incident.id}

                  className={`campus-incident-marker ${incident.severity.toLowerCase()
                    }`}

                  style={{
                    left: position.x,
                    top: position.y,
                  }}

                  onClick={() => {
                    setSelectedIncident(
                      incident
                    );

                    setSelectedResponder(
                      null
                    );
                  }}

                  title={`${incident.type} - ${incident.location}`}
                >

                  {getIcon(incident.type)}

                </button>

              );
            })
          }


          {/* ================================
              RESPONDER MARKERS
          ================================= */}

          {(mapFilter === "all" ||
            mapFilter === "responders") &&

            responders.map((responder) => {

              const position =
                getPosition(
                  responder.location
                );

              return (

                <button
                  key={responder.id}

                  className={`campus-responder-marker ${getResponderStatusClass(
                    responder.status
                  )}`}

                  style={{
                    left: position.x,
                    top: position.y,
                  }}

                  onClick={() => {

                    setSelectedResponder(
                      responder
                    );

                    setSelectedIncident(
                      null
                    );

                  }}

                  title={`${responder.name} - ${responder.status}`}
                >

                  👮

                </button>

              );
            })
          }

          {/* ================================
    BUILDING MARKERS
================================ */}

          {mapFilter === "buildings" &&
            buildings.map((building) => (
              <div
                key={building.id}
                className="campus-building-marker"
                style={{
                  left: building.x,
                  top: building.y,
                }}
              >
                <span className="building-dot">
                  🏢
                </span>

                <span className="building-name">
                  {building.name}
                </span>
              </div>
            ))}

          {/* ================================
              LIVE LABEL
          ================================= */}

          <div className="campus-live-label">

            ● LIVE CAMPUS MONITOR

          </div>


          {/* ================================
              BUILDING MESSAGE
          ================================= */}

          {mapFilter === "buildings" && (

            <div className="map-empty-message">

              🏢 Campus Buildings

              <span>
                Building locations will be added here.
              </span>

            </div>

          )}

        </div>


        {/* ================================
            INCIDENT PANEL
        ================================= */}

        {selectedIncident && (

          <div className="map-incident-panel">

            <button
              className="close-map-panel"

              onClick={() =>
                setSelectedIncident(null)
              }
            >
              ×
            </button>


            <div className="selected-icon">

              {getIcon(
                selectedIncident.type
              )}

            </div>


            <h2>
              {selectedIncident.type}
            </h2>


            <p>
              {selectedIncident.location}
            </p>


            <div
              className={`selected-severity ${selectedIncident.severity.toLowerCase()
                }`}
            >
              {selectedIncident.severity}
            </div>


            <hr />


            <small>
              Incident ID
            </small>

            <strong>
              {selectedIncident.id}
            </strong>


            <small>
              Status
            </small>

            <strong>
              {selectedIncident.status}
            </strong>


            <small>
              Time
            </small>

            <strong>
              {selectedIncident.time}
            </strong>


            <small>
              People Affected
            </small>

            <strong>
              {selectedIncident.affected}
            </strong>


            <button
              className="map-action-btn"
            >
              Incident Details
            </button>

          </div>

        )}


        {/* ================================
            RESPONDER PANEL
        ================================= */}

        {selectedResponder && (

          <div className="map-incident-panel">

            <button
              className="close-map-panel"

              onClick={() =>
                setSelectedResponder(null)
              }
            >
              ×
            </button>


            <div className="selected-icon">
              👮
            </div>


            <h2>
              {selectedResponder.name}
            </h2>


            <p>
              {selectedResponder.team}
            </p>


            <div
              className={`selected-responder-status ${getResponderStatusClass(
                selectedResponder.status
              )}`}
            >
              {selectedResponder.status}
            </div>


            <hr />


            <small>
              Responder ID
            </small>

            <strong>
              {selectedResponder.id}
            </strong>


            <small>
              Location
            </small>

            <strong>
              {selectedResponder.location}
            </strong>


            <small>
              Incidents Handled
            </small>

            <strong>
              {selectedResponder.incidents}
            </strong>


            <small>
              Phone
            </small>

            <strong>
              {selectedResponder.phone}
            </strong>


            <button
              className="map-action-btn"
            >
              Responder Details
            </button>

          </div>

        )}

      </div>


      {/* ================================
          LEGEND
      ================================= */}

      <div className="map-legend">

        <div>

          <span className="legend-marker">
            🔥
          </span>

          Critical

        </div>


        <div>

          <span className="legend-marker">
            🚑
          </span>

          High

        </div>


        <div>

          <span className="legend-marker">
            🛡️
          </span>

          Medium

        </div>


        <div>

          <span className="legend-marker">
            🏃
          </span>

          Low

        </div>


        <div>

          <span className="legend-marker">
            👮
          </span>

          Responder

        </div>

      </div>

    </div>
  );
}

export default Map;
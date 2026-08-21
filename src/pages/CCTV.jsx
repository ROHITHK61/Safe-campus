import { useState } from "react";

function CCTV() {
  const [selectedCamera, setSelectedCamera] = useState(null);

  const cameras = [
    {
      id: "CAM-001",
      name: "Main Gate",
      location: "Main Entrance",
      status: "Online",
      people: 12,
    },
    {
      id: "CAM-002",
      name: "Block A Entrance",
      location: "Academic Block A",
      status: "Online",
      people: 8,
    },
    {
      id: "CAM-003",
      name: "Hostel 2",
      location: "Hostel Area",
      status: "Online",
      people: 21,
    },
    {
      id: "CAM-004",
      name: "Sports Complex",
      location: "Sports Area",
      status: "Offline",
      people: 0,
    },
    {
      id: "CAM-005",
      name: "Block C",
      location: "Academic Block C",
      status: "Online",
      people: 6,
    },
    {
      id: "CAM-006",
      name: "Parking Area",
      location: "North Parking",
      status: "Online",
      people: 15,
    },
  ];

  return (
    <div className="cctv-page">

      {/* HEADER */}

      <div className="cctv-header">

        <div>
          <h1>CCTV Monitoring</h1>
          <p>Real-time campus surveillance and AI monitoring</p>
        </div>

        <div className="cctv-status">
          <span>●</span> SYSTEM ONLINE
        </div>

      </div>


      {/* TOP STATS */}

      <div className="cctv-stats">

        <div className="cctv-stat">
          <span>📹</span>
          <div>
            <small>Total Cameras</small>
            <strong>{cameras.length}</strong>
          </div>
        </div>

        <div className="cctv-stat online">
          <span>🟢</span>
          <div>
            <small>Online</small>
            <strong>
              {cameras.filter((camera) => camera.status === "Online").length}
            </strong>
          </div>
        </div>

        <div className="cctv-stat offline">
          <span>🔴</span>
          <div>
            <small>Offline</small>
            <strong>
              {cameras.filter((camera) => camera.status === "Offline").length}
            </strong>
          </div>
        </div>

        <div className="cctv-stat">
          <span>👥</span>
          <div>
            <small>People Detected</small>
            <strong>
              {cameras.reduce((total, camera) => total + camera.people, 0)}
            </strong>
          </div>
        </div>

      </div>


      {/* CAMERA GRID */}

      <div className="cctv-section-header">

        <div>
          <h2>Live Camera Feeds</h2>
          <p>Select a camera to view details</p>
        </div>

        <button className="fullscreen-btn">
          ⛶ Fullscreen
        </button>

      </div>


      <div className="camera-grid">

        {cameras.map((camera) => (

          <div
            key={camera.id}
            className="camera-card"
            onClick={() => setSelectedCamera(camera)}
          >

            {/* VIDEO AREA */}

            <div className="camera-feed">

              <div className="camera-noise">
                <span>LIVE FEED</span>
              </div>

              <div className="camera-building">
                {camera.name}
              </div>

              <div className="camera-scan-line"></div>

              <div className="camera-timestamp">
                19 AUG 2026 • 10:42:18
              </div>

              {camera.status === "Offline" && (
                <div className="camera-offline">
                  <span>⚠️</span>
                  CAMERA OFFLINE
                </div>
              )}

              {camera.status === "Online" && (
                <div className="camera-live-dot">
                  ● LIVE
                </div>
              )}

            </div>


            {/* CAMERA INFO */}

            <div className="camera-info">

              <div>
                <h3>{camera.name}</h3>
                <p>{camera.location}</p>
              </div>

              <div className="camera-info-right">

                <span
                  className={
                    camera.status === "Online"
                      ? "camera-online"
                      : "camera-offline-status"
                  }
                >
                  ● {camera.status}
                </span>

                {camera.status === "Online" && (
                  <span className="people-count">
                    👥 {camera.people}
                  </span>
                )}

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* AI DETECTION */}

      <div className="cctv-ai-panel">

        <div className="cctv-ai-icon">
          🤖
        </div>

        <div className="cctv-ai-content">

          <h2>AI Video Intelligence</h2>

          <p>
            AI monitoring is active across all online cameras.
            The system can detect unusual activity, crowd
            formation and potential safety incidents.
          </p>

        </div>

        <div className="ai-active">
          ● AI ACTIVE
        </div>

      </div>


      {/* CAMERA DETAILS */}

      {selectedCamera && (

        <div className="camera-modal-overlay">

          <div className="camera-modal">

            <button
              className="camera-modal-close"
              onClick={() => setSelectedCamera(null)}
            >
              ×
            </button>

            <div className="modal-feed">

              {selectedCamera.status === "Online" ? (
                <>
                  <span className="modal-live">● LIVE</span>
                  <div className="modal-feed-name">
                    {selectedCamera.name}
                  </div>
                </>
              ) : (
                <div className="modal-offline">
                  ⚠️
                  <strong>Camera Offline</strong>
                  <small>
                    This camera is currently unavailable.
                  </small>
                </div>
              )}

            </div>

            <div className="modal-details">

              <h2>{selectedCamera.name}</h2>

              <p>{selectedCamera.location}</p>

              <div className="modal-detail-grid">

                <div>
                  <small>Camera ID</small>
                  <strong>{selectedCamera.id}</strong>
                </div>

                <div>
                  <small>Status</small>
                  <strong>{selectedCamera.status}</strong>
                </div>

                <div>
                  <small>People Detected</small>
                  <strong>{selectedCamera.people}</strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default CCTV;
import { useEffect, useState } from "react";
import { subscribeToResponders } from "../firebase/firestore";

function ResponderStatus() {
  const [responders, setResponders] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToResponders(
      (firebaseResponders) => {
        setResponders(firebaseResponders);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const total = responders.length;

  const available = responders.filter(
    (r) => r.status === "Available"
  ).length;

  const busy = responders.filter(
    (r) => r.status === "Busy"
  ).length;

  const offline = responders.filter(
    (r) => r.status === "Offline"
  ).length;

  return (
    <div className="panel responder-panel">

      <div className="panel-header">
        <h2>👥 RESPONDER STATUS</h2>
        <span>View All</span>
      </div>

      <div className="responder-content">

        <div className="donut">
          <div className="donut-center">
            <strong>{total}</strong>

            <small>
              Total
              <br />
              Responders
            </small>
          </div>
        </div>

        <div className="responder-legend">

          <div>
            <span className="legend-dot available"></span>
            <p>Available</p>
            <strong>{available}</strong>
          </div>

          <div>
            <span className="legend-dot busy"></span>
            <p>Busy</p>
            <strong>{busy}</strong>
          </div>

          <div>
            <span className="legend-dot offline"></span>
            <p>Offline</p>
            <strong>{offline}</strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ResponderStatus;
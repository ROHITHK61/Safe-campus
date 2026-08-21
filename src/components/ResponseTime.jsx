import { useEffect, useState } from "react";
import { getIncidents } from "../firebase/firestore";

function ResponseTime() {

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const firebaseIncidents = await getIncidents();
        setIncidents(firebaseIncidents);
      } catch (error) {
        console.error("Error loading incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  // Get response times
  const responseTimes = incidents
    .map((incident) => Number(incident.responseTime))
    .filter((time) => time > 0);


  // Average
  const average =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) /
      responseTimes.length
      : 0;


  // Fastest
  const fastest =
    responseTimes.length > 0
      ? Math.min(...responseTimes)
      : 0;


  // Slowest
  const slowest =
    responseTimes.length > 0
      ? Math.max(...responseTimes)
      : 0;


  // Convert seconds → MM:SS
  const formatTime = (seconds) => {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;

  };


  return (
    <div className="panel response-panel">

      <h2>
        ⏱️ RESPONSE TIME{" "}
        <span className="today">(Today)</span>
      </h2>


      <div className="response-main">

        <div>

          <small>
            Average Response Time
          </small>

          <strong>
            {formatTime(average)}
          </strong>

        </div>

      </div>


      <div className="response-stats">

        <div>

          <small>
            Fastest Response
          </small>

          <strong>
            {formatTime(fastest)}
          </strong>

        </div>


        <div>

          <small>
            Slowest Response
          </small>

          <strong>
            {formatTime(slowest)}
          </strong>

        </div>

      </div>


      {/* RESPONSE TIME GRAPH */}

      <div className="line-chart">

        {responseTimes.length > 0 ? (

          responseTimes.map((time, index) => {

            const maxTime =
              Math.max(...responseTimes);

            const height =
              maxTime > 0
                ? (time / maxTime) * 80
                : 0;

            return (
              <div
                key={index}
                className="chart-point"
                style={{
                  bottom: `${height}%`,
                }}
                title={formatTime(time)}
              ></div>
            );

          })

        ) : (

          <p className="no-response-data">
            No response data
          </p>

        )}

      </div>


      <div className="chart-labels">

        <span>12 AM</span>
        <span>4 AM</span>
        <span>8 AM</span>
        <span>12 PM</span>
        <span>4 PM</span>
        <span>8 PM</span>
        <span>12 AM</span>

      </div>

    </div>
  );
}

export default ResponseTime;
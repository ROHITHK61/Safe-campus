import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getIncidents } from "../firebase/firestore";

function IncidentAnalytics() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const firebaseIncidents = await getIncidents();
        setIncidents(firebaseIncidents);
      } catch (error) {
        console.error("Error loading incidents:", error);
      }
    };

    loadIncidents();
  }, []);

  const data = [
    {
      name: "Fire",
      value: incidents.filter(
        (incident) => incident.type === "Fire"
      ).length,
    },
    {
      name: "Medical",
      value: incidents.filter(
        (incident) => incident.type === "Medical Emergency"
      ).length,
    },
    {
      name: "Accident",
      value: incidents.filter(
        (incident) => incident.type === "Accident"
      ).length,
    },
    {
      name: "Security",
      value: incidents.filter(
        (incident) => incident.type === "Security Threat"
      ).length,
    },
    {
      name: "Other",
      value: incidents.filter(
        (incident) =>
          ![
            "Fire",
            "Medical Emergency",
            "Accident",
            "Security Threat",
          ].includes(incident.type)
      ).length,
    },
  ];

  return (
    <div className="panel analytics-panel">
      <div className="panel-header">
        <h2>
          📊 INCIDENT ANALYTICS{" "}
          <span className="today">(Today)</span>
        </h2>

        <span>View Report</span>
      </div>

      <div className="bar-chart">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 15,
              left: 0,
              bottom: 10,
            }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="name"
              stroke="#8292a6"
              interval={0}
              tick={{ fontSize: 14 }}
              tickMargin={8}
            />

            <YAxis
              stroke="#8292a6"
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#2684ff"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncidentAnalytics;
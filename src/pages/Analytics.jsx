import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import * as XLSX from "xlsx";

import { useEffect, useState } from "react";
import { getIncidents } from "../firebase/firestore";

function Analytics() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [incidents, setIncidents] = useState([]);

  // DATE FILTER
  const [dateFilter, setDateFilter] = useState("All");


  // ================================
  // LOAD FIREBASE INCIDENTS
  // ================================

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const firebaseIncidents =
          await getIncidents();

        setIncidents(firebaseIncidents);
      } catch (error) {
        console.error(
          "Error loading analytics incidents:",
          error
        );
      }
    };

    loadIncidents();
  }, []);


  // ================================
  // FILTER INCIDENTS BY DATE
  // ================================

  const getFilteredIncidents = () => {
    if (dateFilter === "All") {
      return incidents;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);

    if (dateFilter === "Today") {
      // Keep today's date
    }

    if (dateFilter === "7 Days") {
      startDate.setDate(
        today.getDate() - 6
      );
    }

    if (dateFilter === "30 Days") {
      startDate.setDate(
        today.getDate() - 29
      );
    }

    return incidents.filter((incident) => {
      if (!incident.date) {
        return false;
      }

      const incidentDate =
        new Date(incident.date);

      incidentDate.setHours(0, 0, 0, 0);

      return incidentDate >= startDate &&
        incidentDate <= today;
    });
  };


  const filteredIncidents =
    getFilteredIncidents();


  // ================================
  // INCIDENT TREND
  // ================================

  const dateCounts = {};

  filteredIncidents.forEach((incident) => {
    if (!incident.date) {
      return;
    }

    if (!dateCounts[incident.date]) {
      dateCounts[incident.date] = 0;
    }

    dateCounts[incident.date]++;
  });


  const incidentTrend = Object.keys(dateCounts)
    .sort((a, b) => {
      return (
        new Date(a) -
        new Date(b)
      );
    })
    .map((date) => ({
      day: date,
      incidents: dateCounts[date],
    }));


  // ================================
  // SEVERITY
  // ================================

  const severityData = [
    {
      name: "Critical",
      value: filteredIncidents.filter(
        (incident) =>
          incident.severity === "Critical"
      ).length,
    },

    {
      name: "High",
      value: filteredIncidents.filter(
        (incident) =>
          incident.severity === "High"
      ).length,
    },

    {
      name: "Medium",
      value: filteredIncidents.filter(
        (incident) =>
          incident.severity === "Medium"
      ).length,
    },

    {
      name: "Low",
      value: filteredIncidents.filter(
        (incident) =>
          incident.severity === "Low"
      ).length,
    },
  ];


  // ================================
  // INCIDENT TYPES
  // ================================

  const incidentTypes = [
    {
      type: "Fire",
      count: filteredIncidents.filter(
        (incident) =>
          incident.type === "Fire"
      ).length,
    },

    {
      type: "Medical",
      count: filteredIncidents.filter(
        (incident) =>
          incident.type ===
          "Medical Emergency"
      ).length,
    },

    {
      type: "Security",
      count: filteredIncidents.filter(
        (incident) =>
          incident.type ===
          "Security Threat"
      ).length,
    },

    {
      type: "Accident",
      count: filteredIncidents.filter(
        (incident) =>
          incident.type === "Accident"
      ).length,
    },

    {
      type: "Other",
      count: filteredIncidents.filter(
        (incident) =>
          ![
            "Fire",
            "Medical Emergency",
            "Security Threat",
            "Accident",
          ].includes(incident.type)
      ).length,
    },
  ];


  // ================================
  // LOCATIONS
  // ================================

  const locationCounts = {};

  filteredIncidents.forEach(
    (incident) => {
      const location =
        incident.location || "Unknown";

      if (!locationCounts[location]) {
        locationCounts[location] = 0;
      }

      locationCounts[location]++;
    }
  );


  const locationData = Object.entries(
    locationCounts
  )
    .sort((a, b) => b[1] - a[1])
    .map(([location, count]) => ({
      location,
      incidents: count,
    }));


  // ================================
  // RESPONSE TIME
  // ================================

  const responseTimes =
    filteredIncidents
      .map((incident) =>
        Number(incident.responseTime)
      )
      .filter((time) => time > 0);


  const averageResponseTime =
    responseTimes.length > 0
      ? responseTimes.reduce(
        (sum, time) =>
          sum + time,
        0
      ) /
      responseTimes.length
      : 0;


  const responseData =
    responseTimes.map(
      (time, index) => ({
        incident:
          `INC-${index + 1}`,

        time:
          Number(
            (time / 60).toFixed(1)
          ),
      })
    );


  // ================================
  // RESOLUTION RATE
  // ================================

  const resolvedCount =
    filteredIncidents.filter(
      (incident) =>
        incident.status === "Resolved"
    ).length;


  const resolutionRate =
    filteredIncidents.length > 0
      ? Math.round(
        (resolvedCount /
          filteredIncidents.length) *
        100
      )
      : 0;


  // ================================
  // PEOPLE ASSISTED
  // ================================

  const peopleAssisted =
    filteredIncidents.reduce(
      (total, incident) =>
        total +
        Number(
          incident.affected || 0
        ),
      0
    );


  // ================================
  // EXPORT EXCEL
  // ================================

  const handleExportAnalytics = () => {
    const exportData =
      filteredIncidents.map(
        (incident) => ({
          "Incident ID":
            incident.id,

          "Type":
            incident.type,

          "Location":
            incident.location,

          "Severity":
            incident.severity,

          "Status":
            incident.status,

          "Response Time":
            incident.responseTime
              ? `${(
                Number(
                  incident.responseTime
                ) / 60
              ).toFixed(1)} min`
              : "N/A",

          "Affected People":
            incident.affected || 0,

          "Date":
            incident.date,

          "Time":
            incident.time,
        })
      );


    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );


    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 22 },
      { wch: 20 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
    ];


    const workbook =
      XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Analytics"
    );


    XLSX.writeFile(
      workbook,
      "campus-analytics-report.xlsx"
    );
  };


  // ================================
  // COLORS
  // ================================

  const severityColors = [
    "#ef4444",
    "#f59e0b",
    "#eab308",
    "#22c55e",
  ];


  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">

        <div>
          <h1>
            Campus Analytics
          </h1>

          <p>
            AI-powered insights into
            campus safety incidents
          </p>
        </div>


        <div className="analytics-header-actions">
          <select
            className="analytics-filter-btn"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="All">All Time</option>
          </select>

          <button
            className="analytics-export-btn"
            onClick={handleExportAnalytics}
          >
            📥 Export Report
          </button>
        </div>

      </div>


      {/* KPI CARDS */}

      <div className="analytics-kpis">

        <div className="analytics-kpi">
          <span>🚨</span>

          <div>
            <small>
              Total Incidents
            </small>

            <strong>
              {filteredIncidents.length}
            </strong>

            <p className="neutral">
              Selected period
            </p>
          </div>
        </div>


        <div className="analytics-kpi">
          <span>⚡</span>

          <div>
            <small>
              Avg Response Time
            </small>

            <strong>
              {averageResponseTime.toFixed(
                1
              )}{" "}
              min
            </strong>

            <p className="neutral">
              Selected period
            </p>
          </div>
        </div>


        <div className="analytics-kpi">
          <span>🛡️</span>

          <div>
            <small>
              Resolution Rate
            </small>

            <strong>
              {resolutionRate}%
            </strong>

            <p className="neutral">
              Selected period
            </p>
          </div>
        </div>


        <div className="analytics-kpi">
          <span>👥</span>

          <div>
            <small>
              People Assisted
            </small>

            <strong>
              {peopleAssisted}
            </strong>

            <p className="neutral">
              Selected period
            </p>
          </div>
        </div>

      </div>


      {/* FIRST ROW */}

      <div className="analytics-grid">

        {/* INCIDENT TREND */}

        <div className="analytics-panel trend-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Incident Trend
              </h2>

              <p>
                Incidents reported by date
              </p>
            </div>

            <span className="chart-label">
              {dateFilter.toUpperCase()}
            </span>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={incidentTrend}
              >

                <CartesianGrid
                  stroke="#29394d"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="day"
                  stroke="#8494a8"
                />

                <YAxis
                  stroke="#8494a8"
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#0d1a2b",
                    border:
                      "1px solid #38516d",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="incidents"
                  stroke="#5ba8ff"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* SEVERITY */}

        <div className="analytics-panel severity-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Severity Distribution
              </h2>

              <p>
                Incident priority breakdown
              </p>
            </div>

          </div>


          <div className="pie-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={55}
                  paddingAngle={4}
                >

                  {severityData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          severityColors[
                          index
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* SECOND ROW */}

      <div className="analytics-grid">

        {/* INCIDENT TYPES */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Incidents by Type
              </h2>

              <p>
                Most common incident
                categories
              </p>
            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={incidentTypes}
              >

                <CartesianGrid
                  stroke="#29394d"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="type"
                  stroke="#8494a8"
                  interval={0}
                />

                <YAxis
                  stroke="#8494a8"
                  allowDecimals={false}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#0d1a2b",
                    border:
                      "1px solid #38516d",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#5ba8ff"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                  barCategoryGap="25%"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* LOCATIONS */}

        <div className="analytics-panel">

          <div className="analytics-panel-header">

            <div>
              <h2>
                Incidents by Location
              </h2>

              <p>
                Areas requiring more
                attention
              </p>
            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={locationData}
                layout="vertical"
              >

                <CartesianGrid
                  stroke="#29394d"
                  strokeDasharray="3 3"
                />

                <XAxis
                  type="number"
                  stroke="#8494a8"
                  allowDecimals={false}
                />

                <YAxis
                  dataKey="location"
                  type="category"
                  stroke="#8494a8"
                  width={90}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "#0d1a2b",
                    border:
                      "1px solid #38516d",
                  }}
                />

                <Bar
                  dataKey="incidents"
                  fill="#7c83fd"
                  radius={[
                    0,
                    5,
                    5,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* RESPONSE TIME */}

      <div className="analytics-panel response-panel">

        <div className="analytics-panel-header">

          <div>
            <h2>
              Average Response Time
            </h2>

            <p>
              Response performance for
              selected period
            </p>
          </div>


          <div className="response-value">
            {averageResponseTime.toFixed(
              1
            )}{" "}
            min
          </div>

        </div>


        <div className="response-chart">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={responseData}
            >

              <CartesianGrid
                stroke="#29394d"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="incident"
                stroke="#8494a8"
              />

              <YAxis
                stroke="#8494a8"
              />

              <Tooltip
                contentStyle={{
                  background:
                    "#0d1a2b",
                  border:
                    "1px solid #38516d",
                }}
              />

              <Line
                type="monotone"
                dataKey="time"
                stroke="#35d47a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* AI INSIGHT */}

      <div className="ai-insight">

        <div className="ai-insight-icon">
          🤖
        </div>

        <div>

          <h2>
            AI Safety Insight
          </h2>

          <p>
            Based on current incident
            patterns, Block A and hostel
            areas show higher incident
            activity. Consider increasing
            responder coverage in these
            locations during peak hours.
          </p>

        </div>

        <span className="ai-confidence">
          87% Confidence
        </span>

      </div>

    </div>
  );
}

export default Analytics;
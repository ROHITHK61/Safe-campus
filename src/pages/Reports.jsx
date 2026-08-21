import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

function Reports() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  const [filter, setFilter] = useState("All");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Generate report form
  const [reportType, setReportType] = useState("Incident Summary");
  const [dateRange, setDateRange] = useState("Today");
  const [reportDescription, setReportDescription] = useState("");

  // Incidents
  const [incidents, setIncidents] = useState([]);

  // Generated reports
  const [generatedReports, setGeneratedReports] = useState([]);

  // Listen for incident changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "incidents"),
      (snapshot) => {
        const incidentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIncidents(incidentData);
      },
      (error) => {
        console.error("Error loading incidents:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save generated reports
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {
        const reportData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setGeneratedReports(reportData);
      },
      (error) => {
        console.error("Error loading reports:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Create reports from incidents
  const incidentReports = incidents.map((incident, index) => ({
    id: `REP-${String(index + 1).padStart(3, "0")}`,

    title: `${incident.location} ${incident.type} Incident`,

    type: incident.type,

    location: incident.location,

    date: incident.date || "19 Aug 2026",

    status:
      incident.status === "Resolved"
        ? "Completed"
        : incident.status === "Responding"
          ? "Under Review"
          : "Pending",

    description: incident.description || "",
  }));

  // Combine generated reports + incident reports
  const reports = [
    ...generatedReports,
    ...incidentReports,
  ];

  // Filter
  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter(
        (report) => report.status === filter
      );

  // Generate report
  const handleGenerateReport = async () => {
    try {
      const newReport = {
        title: `${reportType} Report`,
        type: reportType,
        location: "Campus",
        date: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        status: "Pending",
        description: reportDescription,
        dateRange: dateRange,
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "reports"),
        newReport
      );

      alert("Report generated successfully!");

      setShowGenerateModal(false);
      setReportDescription("");
      setReportType("Incident Summary");
      setDateRange("Today");

    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };

  // Export Excel
  const handleExport = () => {
    const exportData = reports.map((report) => ({
      "Report ID": report.id,
      "Incident": report.title,
      "Type": report.type,
      "Location": report.location,
      "Date": report.date,
      "Status": report.status,
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 18 },
      { wch: 40 },
      { wch: 22 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    XLSX.writeFile(
      workbook,
      "campus-incident-reports.xlsx"
    );
  };

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>
          <h1>Incident Reports</h1>

          <p>
            Generate and manage campus safety reports
          </p>
        </div>

        {isAdmin && (
          <button
            className="generate-report-btn"
            onClick={() =>
              setShowGenerateModal(true)
            }
          >
            + Generate Report
          </button>
        )}

      </div>


      {/* SUMMARY */}

      <div className="reports-summary">

        <div className="report-summary-card">

          <span>📄</span>

          <div>
            <small>Total Reports</small>

            <strong>
              {reports.length}
            </strong>
          </div>

        </div>


        <div className="report-summary-card completed">

          <span>✓</span>

          <div>
            <small>Completed</small>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "Completed"
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="report-summary-card review">

          <span>🔍</span>

          <div>
            <small>Under Review</small>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "Under Review"
                ).length
              }
            </strong>
          </div>

        </div>


        <div className="report-summary-card pending">

          <span>⏳</span>

          <div>
            <small>Pending</small>

            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status === "Pending"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>


      {/* FILTER */}

      <div className="reports-toolbar">

        <div className="report-filters">

          {[
            "All",
            "Completed",
            "Under Review",
            "Pending",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item
                  ? "report-filter active"
                  : "report-filter"
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>

          ))}

        </div>


        {isAdmin && (
          <button
            className="export-btn"
            onClick={handleExport}
          >
            📥 Export
          </button>
        )}

      </div>


      {/* TABLE */}

      <div className="reports-panel">

        <div className="reports-panel-header">

          <div>

            <h2>Recent Reports</h2>

            <p>
              {filteredReports.length} reports found
            </p>

          </div>

        </div>


        <div className="reports-table-wrapper">

          <table className="reports-table">

            <thead>

              <tr>
                <th>REPORT ID</th>
                <th>INCIDENT</th>
                <th>TYPE</th>
                <th>LOCATION</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>

            </thead>


            <tbody>

              {filteredReports.map((report) => (

                <tr key={report.id}>

                  <td>
                    <strong>
                      {report.id}
                    </strong>
                  </td>


                  <td>

                    <div className="report-title">
                      📄 {report.title}
                    </div>

                  </td>


                  <td>

                    <span className="report-type">
                      {report.type}
                    </span>

                  </td>


                  <td>
                    📍 {report.location}
                  </td>


                  <td>
                    {report.date}
                  </td>


                  <td>

                    <span
                      className={`report-status ${report.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {report.status}
                    </span>

                  </td>


                  <td>

                    <button
                      className="view-report-btn"
                      onClick={() =>
                        setSelectedReport(report)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* AI REPORTING */}

      <div className="ai-report-panel">

        <div className="ai-report-icon">
          🤖
        </div>

        <div className="ai-report-content">

          <h2>AI Report Generation</h2>

          <p>
            Generate intelligent incident summaries
            and safety analysis automatically using
            campus incident data.
          </p>

        </div>

        {isAdmin && (
          <button className="ai-generate-btn">
            Generate with AI
          </button>
        )}

      </div>


      {/* GENERATE REPORT MODAL */}

      {isAdmin && showGenerateModal && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>Generate Report</h2>

                <p>
                  Create a new campus safety report
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setShowGenerateModal(false)
                }
              >
                ✕
              </button>

            </div>


            <div className="report-form">

              {/* REPORT TYPE */}

              <label>

                Report Type

                <select
                  value={reportType}
                  onChange={(e) =>
                    setReportType(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Incident Summary
                  </option>

                  <option>
                    Safety Analysis
                  </option>

                  <option>
                    Daily Report
                  </option>

                  <option>
                    Weekly Report
                  </option>

                </select>

              </label>


              {/* DATE RANGE */}

              <label>

                Date Range

                <select
                  value={dateRange}
                  onChange={(e) =>
                    setDateRange(
                      e.target.value
                    )
                  }
                >

                  <option>
                    Today
                  </option>

                  <option>
                    Last 7 Days
                  </option>

                  <option>
                    Last 30 Days
                  </option>

                </select>

              </label>


              {/* DESCRIPTION */}

              <label>

                Description

                <textarea
                  rows="4"
                  placeholder="Enter report description..."
                  value={reportDescription}
                  onChange={(e) =>
                    setReportDescription(
                      e.target.value
                    )
                  }
                />

              </label>

            </div>


            {/* MODAL ACTIONS */}

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowGenerateModal(false)
                }
              >
                Cancel
              </button>


              <button
                className="submit-incident-btn"
                onClick={
                  handleGenerateReport
                }
              >
                📄 Generate Report
              </button>

            </div>

          </div>

        </div>

      )}


      {/* REPORT DETAILS MODAL */}

      {selectedReport && (

        <div className="modal-overlay">

          <div className="report-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {selectedReport.title}
                </h2>

                <p>
                  Report Details
                </p>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                ✕
              </button>

            </div>


            <div className="report-details">

              <div>
                <span>Report ID</span>

                <strong>
                  {selectedReport.id}
                </strong>
              </div>


              <div>
                <span>Incident Type</span>

                <strong>
                  {selectedReport.type}
                </strong>
              </div>


              <div>
                <span>Location</span>

                <strong>
                  📍 {selectedReport.location}
                </strong>
              </div>


              <div>
                <span>Date</span>

                <strong>
                  {selectedReport.date}
                </strong>
              </div>


              <div>
                <span>Status</span>

                <strong>
                  {selectedReport.status}
                </strong>
              </div>


              {selectedReport.dateRange && (

                <div>
                  <span>Date Range</span>

                  <strong>
                    {selectedReport.dateRange}
                  </strong>
                </div>

              )}


              {selectedReport.description && (

                <div>
                  <span>Description</span>

                  <strong>
                    {selectedReport.description}
                  </strong>
                </div>

              )}

            </div>


            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Reports;
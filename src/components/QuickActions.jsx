import { NavLink } from "react-router-dom";

function QuickActions() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "Administrator";

  return (
    <div className="panel quick-panel">

      <h2>⚡ QUICK ACTIONS</h2>

      <div className="quick-actions">

        {/* ADMIN ONLY */}
        {isAdmin && (
          <NavLink
            to="/responders"
            className="quick-action-btn"
          >
            👤
            <span>Add Responder</span>
          </NavLink>
        )}

        {/* EVERY LOGGED-IN USER */}
        <NavLink
          to="/alerts"
          className="quick-action-btn"
        >
          📢
          <span>Send Alert</span>
        </NavLink>

        <NavLink
          to="/reports"
          className="quick-action-btn"
        >
          📄
          <span>View Reports</span>
        </NavLink>

      </div>

    </div>
  );
}

export default QuickActions;
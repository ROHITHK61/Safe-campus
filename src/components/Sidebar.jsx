import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo-section">
        <div className="logo">
          🛡️
        </div>

        <div>
          <h2>SAFECAMPUS AI</h2>
          <p>Campus Intelligence System</p>
        </div>
      </div>


      {/* MENU */}
      <nav className="sidebar-menu">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🏠
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🚨
          <span>Incidents</span>
        </NavLink>

        <NavLink
          to="/responders"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          👥
          <span>Responders</span>
        </NavLink>

        <NavLink
          to="/map"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🗺️
          <span>Map</span>
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          🔔
          <span>Alerts</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📊
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/cctv"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📹
          <span>CCTV Monitor</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          📄
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          ⚙️
          <span>Settings</span>
        </NavLink>

      </nav>


      {/* LOGOUT */}
      <button
        className="logout-item"
        onClick={handleLogout}
      >
        🚪
        <span>Logout</span>
      </button>


      {/* SYSTEM STATUS */}
      <div className="system-status">

        <p>System Status</p>

        <div className="status-online">
          ● OPERATIONAL
        </div>

        <hr />

        <small>Last Updated</small>

        <strong>
          10:32:45 AM
        </strong>

      </div>

    </aside>
  );
}

export default Sidebar;
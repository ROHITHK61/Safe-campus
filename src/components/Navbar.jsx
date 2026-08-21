import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Guest",
    role: "User",
  });

  const [showMenu, setShowMenu] = useState(false);

  // Load logged-in user
  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser({
          name: "Guest",
          role: "User",
        });
      }
    };

    loadUser();

    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="navbar">

      <button
        className="report-button"
        onClick={() => navigate("/incidents")}
      >
        🔔 REPORT INCIDENT
      </button>

      <div className="navbar-right">

        {/* NOTIFICATIONS */}
        <div className="notification">
          🔔
          <span>5</span>
        </div>

        {/* USER */}
        <div
          className="admin"
          onClick={() => setShowMenu(!showMenu)}
        >

          <div className="admin-avatar">
            👤
          </div>

          <div>
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>

          <div className="dropdown-arrow">
            {showMenu ? "⌃" : "⌄"}
          </div>

          {/* LOGOUT MENU */}
          {showMenu && (
            <div className="user-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}

        </div>

      </div>

    </header>
  );
}

export default Navbar;
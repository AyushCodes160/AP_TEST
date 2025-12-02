import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CodeIcon from "./CodeIcon";
import toast from "react-hot-toast";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("authMethod");
    setIsLoggedIn(false);
    setUsername("");
    toast.success("Logged out successfully");
    navigate("/login");
    closeNavbar();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      background: "#000000",
      borderBottom: "1px solid #333333", 
      padding: "1rem 2rem"
    }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeNavbar} style={{ textDecoration: "none", gap: "0.5rem" }}>
          <CodeIcon size={28} color="#E50914" />
          <span className="fw-bold" style={{ 
            fontSize: "1.5rem", 
            color: "#ffffff",
            fontWeight: "700"
          }}>
            MeowCollab
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          style={{ border: "1px solid #0d6efd" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto" style={{ gap: "0.5rem" }}>
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-animated ${location.pathname === "/getting-started" ? "active" : ""}`}
                to="/getting-started"
                onClick={closeNavbar}
                style={{
                  fontWeight: location.pathname === "/getting-started" ? "600" : "400",
                  color: location.pathname === "/getting-started" ? "#ffffff" : "#b3b3b3",
                  fontSize: "0.95rem",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== "/getting-started") {
                    e.target.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/getting-started") {
                    e.target.style.color = "#b3b3b3";
                  }
                }}
              >
                Getting Started
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link nav-link-animated ${location.pathname === "/" ? "active" : ""}`}
                to="/"
                onClick={closeNavbar}
                style={{
                  fontWeight: location.pathname === "/" ? "600" : "400",
                  color: location.pathname === "/" ? "#ffffff" : "#b3b3b3",
                  fontSize: "0.95rem",
                  padding: "0.5rem 1rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== "/") {
                    e.target.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== "/") {
                    e.target.style.color = "#b3b3b3";
                  }
                }}
              >
                Start Coding
              </Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <button
                  className="nav-link nav-link-animated"
                  onClick={handleLogout}
                  style={{
                    fontWeight: "400",
                    color: "#b3b3b3",
                    fontSize: "0.95rem",
                    padding: "0.5rem 1rem",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    position: "relative",
                    background: "none",
                    border: "none",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#b3b3b3";
                  }}
                >
                  Logout ({username})
                </button>
              ) : (
                <Link
                  className={`nav-link nav-link-animated ${location.pathname === "/login" ? "active" : ""}`}
                  to="/login"
                  onClick={closeNavbar}
                  style={{
                    fontWeight: location.pathname === "/login" ? "600" : "400",
                    color: location.pathname === "/login" ? "#ffffff" : "#b3b3b3",
                    fontSize: "0.95rem",
                    padding: "0.5rem 1rem",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    position: "relative"
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== "/login") {
                      e.target.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== "/login") {
                      e.target.style.color = "#b3b3b3";
                    }
                  }}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


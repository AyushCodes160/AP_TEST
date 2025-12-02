import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CodeIcon from "./CodeIcon";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    const guestUsername = `Guest_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("username", guestUsername);
    localStorage.setItem("authMethod", "guest");
    toast.success(`Welcome, ${guestUsername}!`);
    navigate("/");
  };



  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("authMethod", "email");
        toast.success(`Welcome back, ${data.user.username}!`);
        navigate("/");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to server");
    }
  };

  return (
    <div className="login-container">
      <div className="container-fluid login-content">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="login-card fade-in">
              <div className="card-body text-center">
                {/* Logo */}
                <div className="logo-container mb-4">
                  <div className="logo-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
                    <CodeIcon size={48} color="#E50914" />
                  </div>
                  <h1 className="logo-text gradient-text">MeowCollab</h1>
                  <p className="tagline">Sign in to start collaborating</p>
                </div>
                <form onSubmit={handleEmailLogin} className="email-login-form mb-4">
                  <div className="form-group mb-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control professional-input"
                      placeholder="Email address"
                    />
                  </div>
                  
                  <div className="form-group mb-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control professional-input"
                      placeholder="Password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-professional w-100 mb-3"
                  >
                    Sign in with Email
                  </button>
                </form>

                <div className="divider">
                  <span>or</span>
                </div>

                {/* Guest Login */}
                <button
                  onClick={handleGuestLogin}
                  className="btn btn-outline-professional w-100 mt-3"
                >
                  Continue as Guest
                </button>

                <p className="signup-text mt-4">
                  Don't have an account? <span className="signup-link">Sign up</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

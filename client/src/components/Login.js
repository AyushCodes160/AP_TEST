import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CodeIcon from "./CodeIcon";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGuestLogin = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}/auth/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("authMethod", "guest");
        toast.success(`Welcome, ${data.user.username}!`);
        navigate("/");
      } else {
        toast.error("Failed to create guest session");
      }
    } catch (error) {
      console.error("Guest login error:", error);
      toast.error("Failed to connect to server");
    }
  };

  const validateForm = () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    
    if (isSignUp && !username) {
      toast.error("Username is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const endpoint = isSignUp ? "/auth/register" : "/auth/login";
    const payload = isSignUp ? { email, password, username } : { email, password };

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("authMethod", "email");
        toast.success(isSignUp ? "Account created successfully!" : `Welcome back, ${data.user.username}!`);
        navigate("/");
      } else {
        toast.error(data.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
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
                <div className="logo-container mb-4">
                  <div className="logo-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
                    <CodeIcon size={48} color="#E50914" />
                  </div>
                  <h1 className="logo-text gradient-text">MeowCollab</h1>
                  <p className="tagline">{isSignUp ? "Create an account to collaborate" : "Sign in to start collaborating"}</p>
                </div>
                <form onSubmit={handleAuth} className="email-login-form mb-4">
                  {isSignUp && (
                    <div className="form-group mb-3">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control professional-input"
                        placeholder="Username"
                      />
                    </div>
                  )}
                  
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
                    {isSignUp ? "Sign Up" : "Sign in with Email"}
                  </button>
                </form>

                <div className="divider">
                  <span>or</span>
                </div>

                <button
                  onClick={handleGuestLogin}
                  className="btn btn-outline-professional w-100 mt-3"
                >
                  Continue as Guest
                </button>

                <p className="signup-text mt-4">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <span 
                    className="signup-link" 
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Sign In" : "Sign up"}
                  </span>
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

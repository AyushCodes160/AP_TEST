import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CodeIcon from "./CodeIcon";
import "./Home.css";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room ID generated successfully!");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("Joining room...");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="home-container">
      <div className="container-fluid home-content">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="home-card fade-in">
              <div className="card-body text-center">
                <div className="logo-container mb-4">
                  <div className="logo-icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.5rem" }}>
                    <CodeIcon size={48} color="#E50914" />
                  </div>
                  <h1 className="logo-text gradient-text">MeowCollab</h1>
                  <p className="tagline">Real-Time Collaborative Code Editor</p>
                </div>

                <div className="form-group mb-4">
                  <label className="input-label">Room ID</label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="form-control professional-input"
                    placeholder="Enter or generate a room ID"
                    onKeyUp={handleInputEnter}
                  />
                </div>
                
                <div className="form-group mb-4">
                  <label className="input-label">Your Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control professional-input"
                    placeholder="Enter your username"
                    onKeyUp={handleInputEnter}
                  />
                </div>
                
                <button
                  onClick={joinRoom}
                  className="btn btn-professional w-100 mb-3"
                  style={{ fontSize: "1.1rem", padding: "15px" }}
                >
                  Join Room
                </button>
                
                <div className="divider">
                  <span>or</span>
                </div>
                
                <button
                  onClick={generateRoomId}
                  className="btn btn-outline-professional w-100"
                  style={{ fontSize: "1rem", padding: "12px" }}
                >
                  Create New Room
                </button>

                <div className="divider">
                  <span>or</span>
                </div>

                <button
                  onClick={() => navigate("/getting-started")}
                  className="btn btn-outline-professional w-100"
                  style={{ fontSize: "1rem", padding: "12px" }}
                >
                  Getting Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="fixed-bottom text-center py-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <small>Built with ❤️ by MeowCollab Team</small>
      </footer>
    </div>
  );
}

export default Home;

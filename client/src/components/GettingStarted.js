import React from "react";
import { Link } from "react-router-dom";
import "./GettingStarted.css";

function GettingStarted() {
  return (
    <div className="getting-started-container" style={{ background: "#141414", minHeight: "calc(100vh - 56px)", padding: "3rem 0" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-light fade-in">
              <div className="page-header mb-5">
                <h1 className="page-title" style={{ color: "#ffffff", fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
                  Getting Started with MeowCollab
                </h1>
                <p className="page-subtitle" style={{ color: "#b3b3b3", fontSize: "1.1rem" }}>
                  Learn how to collaborate on code in real-time with your team
                </p>
              </div>
              
              <div className="info-card professional-card mb-4" style={{ 
                background: "#1a1a1a", 
                border: "1px solid #333333", 
                borderRadius: "4px",
                padding: "2rem"
              }}>
                <div className="card-body p-4">
                  <h3 className="card-title" style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>What is MeowCollab?</h3>
                  <p className="card-text" style={{ color: "#b3b3b3", fontSize: "1rem", lineHeight: "1.6" }}>
                    MeowCollab is a real-time collaborative code editor that allows multiple developers to write, 
                    edit, and execute code together in real-time. Perfect for pair programming, coding interviews, 
                    and collaborative learning!
                  </p>
                </div>
              </div>

              <div className="info-card professional-card mb-4" style={{ 
                background: "#1a1a1a", 
                border: "1px solid #333333", 
                borderRadius: "4px",
                padding: "2rem"
              }}>
                <div className="card-body p-4">
                  <h3 className="card-title" style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Quick Start Guide</h3>
                  <ol className="guide-list">
                    <li>
                      <strong>Sign In or Guest Access</strong> - Log in to access full features or continue as a guest
                    </li>
                    <li>
                      <strong>Navigate to "Start Coding"</strong> - Click on "Start Coding" in the navbar
                    </li>
                    <li>
                      <strong>Create a Room</strong> - Click "New Room" to generate a unique room ID
                    </li>
                    <li>
                      <strong>Enter Your Username</strong> - Type your name to identify yourself in the room
                    </li>
                    <li>
                      <strong>Join the Room</strong> - Click "JOIN" to enter the collaborative editor
                    </li>
                    <li>
                      <strong>Share the Room ID</strong> - Copy the room ID and share it with your collaborators
                    </li>
                    <li>
                      <strong>Start Coding!</strong> - Write code together in real-time
                    </li>
                  </ol>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="feature-card professional-card h-100" style={{ 
                    background: "#1a1a1a", 
                    border: "1px solid #333333", 
                    borderRadius: "4px",
                    padding: "1.5rem"
                  }}>
                    <div className="card-body p-4">
                      <h5 className="feature-title" style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.75rem" }}>Real-Time Collaboration</h5>
                      <p className="feature-text" style={{ color: "#b3b3b3", fontSize: "0.95rem", lineHeight: "1.6", margin: "0" }}>See changes made by others instantly. Multiple users can edit simultaneously.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-card professional-card h-100" style={{ 
                    background: "#1a1a1a", 
                    border: "1px solid #333333", 
                    borderRadius: "4px",
                    padding: "1.5rem"
                  }}>
                    <div className="card-body p-4">
                      <h5 className="feature-title" style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.75rem" }}>Multi-Language Support</h5>
                      <p className="feature-text" style={{ color: "#b3b3b3", fontSize: "0.95rem", lineHeight: "1.6", margin: "0" }}>Supports 16 languages: Python, Java, C++, Node.js, C, Ruby, Go, Scala, Bash, SQL, Pascal, C#, PHP, Swift, Rust, R.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-card professional-card h-100" style={{ 
                    background: "#1a1a1a", 
                    border: "1px solid #333333", 
                    borderRadius: "4px",
                    padding: "1.5rem"
                  }}>
                    <div className="card-body p-4">
                      <h5 className="feature-title" style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.75rem" }}>Code Execution</h5>
                      <p className="feature-text" style={{ color: "#b3b3b3", fontSize: "0.95rem", lineHeight: "1.6", margin: "0" }}>Integrated compiler with output window. Run code and see results instantly.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="feature-card professional-card h-100" style={{ 
                    background: "#1a1a1a", 
                    border: "1px solid #333333", 
                    borderRadius: "4px",
                    padding: "1.5rem"
                  }}>
                    <div className="card-body p-4">
                      <h5 className="feature-title" style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.75rem" }}>Live Member List</h5>
                      <p className="feature-text" style={{ color: "#b3b3b3", fontSize: "0.95rem", lineHeight: "1.6", margin: "0" }}>See who's currently in the room and coding with you.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card professional-card mb-4" style={{ 
                background: "#1a1a1a", 
                border: "1px solid #333333", 
                borderRadius: "4px",
                padding: "2rem"
              }}>
                <div className="card-body p-4">
                  <h3 className="card-title" style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>How to Use the Editor</h3>
                  <ul className="usage-list">
                    <li>
                      <strong>Writing Code:</strong> Simply start typing in the editor. 
                      Your changes will be visible to all room members in real-time.
                    </li>
                    <li>
                      <strong>Language Selection:</strong> Use the dropdown at the top 
                      of the editor to select your programming language.
                    </li>
                    <li>
                      <strong>Running Code:</strong> Click the "Open Compiler" button at 
                      the bottom right to reveal the output window, then click "Run Code" to execute your program.
                    </li>
                    <li>
                      <strong>Copy Room ID:</strong> Click "Copy Room ID" in the 
                      sidebar to share the room with others.
                    </li>
                    <li>
                      <strong>Leave Room:</strong> Click "Leave Room" to exit and 
                      return to the home page.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="info-card professional-card mb-4" style={{ 
                background: "#1a1a1a", 
                border: "1px solid #333333", 
                borderRadius: "4px",
                padding: "2rem"
              }}>
                <div className="card-body p-4">
                  <h3 className="card-title" style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Tips & Best Practices</h3>
                  <ul className="tips-list">
                    <li>✅ Use descriptive usernames so others know who you are</li>
                    <li>✅ Share room IDs securely with only intended collaborators</li>
                    <li>✅ Communicate with your team about what you're working on</li>
                    <li>✅ Use the compiler to test code before sharing</li>
                    <li>✅ Be mindful of others editing the same code</li>
                  </ul>
                </div>
              </div>

              <div className="cta-card professional-card" style={{ 
                background: "#1a1a1a", 
                border: "1px solid #333333", 
                borderRadius: "4px",
                padding: "2rem"
              }}>
                <div className="card-body p-4 text-center">
                  <h3 className="card-title mb-3" style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: "600" }}>Ready to Start?</h3>
                  <p className="card-text mb-4" style={{ color: "#b3b3b3", fontSize: "1rem" }}>
                    Now that you know how MeowCollab works, head over to "Start Coding" to create your first room!
                  </p>
                  <Link to="/" className="btn btn-professional btn-lg" style={{ textDecoration: "none" }}>
                    Start Coding Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;

import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import CodeIcon from "./CodeIcon";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Actions";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const LANGUAGES = [
  "python3",
  "java",
  "cpp",
  "nodejs",
  "c",
  "ruby",
  "go",
  "scala",
  "bash",
  "sql",
  "pascal",
  "csharp",
  "php",
  "swift",
  "rust",
  "r",
];

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef("");
  const editorInstanceRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      try {
        socketRef.current = await initSocket();
        console.log("Socket initialized, joining room...");

        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: Location.state?.username,
        });

        socketRef.current.on("connect_error", (err) => {
          console.error("Connection error:", err);
          handleErrors(err);
        });

        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== Location.state?.username) {
              toast.success(`${username} joined the room.`);
            }
            setClients(clients);
            if (socketRef.current) {
              socketRef.current.emit(ACTIONS.SYNC_CODE, {
                code: codeRef.current,
                socketId,
              });
            }
          }
        );

        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toast.success(`${username} left the room`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        handleErrors(error);
        return;
      }
    };
    init();

    return () => {
      if (socketRef.current) {
        try {
          socketRef.current.off("connect");
          socketRef.current.off("connect_error");
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
          socketRef.current.disconnect();
        } catch (error) {
          console.error("Error cleaning up socket:", error);
        }
      }
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  const runCode = async () => {
    let currentCode = codeRef.current || "";

    if (!currentCode && editorInstanceRef.current) {
      currentCode = editorInstanceRef.current.getValue() || "";
      codeRef.current = currentCode;
    }

    if (!currentCode || currentCode.trim() === "") {
      toast.error("Please write some code before running");
      return;
    }

    setIsCompiling(true);
    setOutput("Compiling...");

    console.log("Running code:", { code: currentCode.substring(0, 50) + "...", language: selectedLanguage });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'}/compile`, {
        code: currentCode,
        language: selectedLanguage,
      }, {
        timeout: 15000,
      });

      console.log("Backend response:", response.data);

      if (response.data.output !== undefined) {
        if (response.data.output === "" && response.data.statusCode !== 200) {
          setOutput(response.data.error || "Compilation failed. Please check your code.");
        } else {
          setOutput(response.data.output || "Code executed successfully (no output)");
        }
      } else if (response.data.error) {
        setOutput(`Error: ${response.data.error}`);
      } else {
        setOutput(JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.error("Error compiling code:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (error.response?.data?.output) {
        setOutput(error.response.data.output);
      } else if (error.response?.data?.error) {
        setOutput(`Error: ${error.response.data.error}`);
      } else if (error.code === 'ECONNABORTED') {
        setOutput("Error: Request timed out. Please try again.");
        toast.error("Request timed out");
      } else if (error.message === 'Network Error' || !error.response) {
        setOutput("Error: Cannot connect to server. Please make sure the server is running on port 5001.");
        toast.error("Cannot connect to server");
      } else {
        setOutput(`Error: ${error.message || "An error occurred while compiling"}`);
      }
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

  return (
    <div className="container-fluid d-flex flex-column editor-container" style={{ height: "calc(100vh - 56px)", background: "#141414" }}>
      <div className="row flex-grow-1">
        <div className="col-md-2 text-light d-flex flex-column editor-sidebar" style={{
          background: "#000000",
          borderRight: "1px solid #333333"
        }}>
          <div className="text-center mb-3" style={{ marginTop: "15px", padding: "0 10px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "8px" }}>
              <CodeIcon size={32} color="#E50914" />
            </div>
            <h4 style={{
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1.2rem",
              margin: "0"
            }}>
              MeowCollab
            </h4>
          </div>
          <hr style={{ borderColor: "#333333", margin: "0.5rem 0" }} />

          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr style={{ borderColor: "#333333", margin: "0.5rem 0" }} />
          <div className="mt-auto mb-3" style={{ padding: "0 10px" }}>
            <button
              className="btn w-100 mb-2"
              onClick={copyRoomId}
              style={{
                fontSize: "0.9rem",
                background: "#E50914",
                border: "1px solid #E50914",
                color: "#000000",
                fontWeight: "500",
                borderRadius: "4px",
                padding: "10px",
                transition: "background-color 0.2s ease, border-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f40612";
                e.target.style.borderColor = "#f40612";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#E50914";
                e.target.style.borderColor = "#E50914";
              }}
            >
              Copy Room ID
            </button>
            <button
              className="btn w-100"
              onClick={leaveRoom}
              style={{
                background: "#E50914",
                border: "1px solid #E50914",
                color: "#000000",
                fontWeight: "500",
                borderRadius: "4px",
                padding: "10px",
                transition: "background-color 0.2s ease, border-color 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f40612";
                e.target.style.borderColor = "#f40612";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#E50914";
                e.target.style.borderColor = "#E50914";
              }}
            >
              Leave Room
            </button>
          </div>
        </div>

        <div className="col-md-10 text-light d-flex flex-column" style={{ background: "#141414" }}>
          <div className="p-3 d-flex justify-content-end" style={{
            background: "#000000",
            borderBottom: "1px solid #333333"
          }}>
            <select
              className="form-select w-auto"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                background: "#2a2a2a",
                border: "1px solid #444444",
                color: "white",
                borderRadius: "4px",
                padding: "8px 15px",
                fontWeight: "500",
                fontSize: "0.9rem"
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <Editor
            socketRef={socketRef}
            roomId={roomId}
            editorRef={editorInstanceRef}
            onCodeChange={(code) => {
              if (code !== null && code !== undefined) {
                codeRef.current = code;
              }
            }}
          />
        </div>
      </div>

      <button
        className="btn btn-professional position-fixed bottom-0 end-0 m-3"
        onClick={toggleCompileWindow}
        style={{
          zIndex: 1050,
          borderRadius: "4px",
          padding: "12px 24px",
          fontSize: "0.95rem"
        }}
      >
        {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
      </button>

      <div
        className={`text-light p-4 ${isCompileWindowOpen ? "d-block" : "d-none"}`}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isCompileWindowOpen ? "35vh" : "0",
          transition: "height 0.3s ease-in-out",
          overflowY: "auto",
          zIndex: 1040,
          background: "#000000",
          borderTop: "1px solid #333333"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Compiler Output ({selectedLanguage})</h5>
          <div>
            <button
              className="btn btn-professional me-2"
              onClick={runCode}
              disabled={isCompiling}
              style={{ minWidth: "150px" }}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button
              className="btn"
              onClick={toggleCompileWindow}
              style={{
                background: "#E50914",
                border: "1px solid #E50914",
                color: "#000000",
                borderRadius: "4px",
                padding: "8px 16px",
                transition: "background-color 0.2s ease",
                fontWeight: "500"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f40612";
                e.target.style.borderColor = "#f40612";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#E50914";
                e.target.style.borderColor = "#E50914";
              }}
            >
              Close
            </button>
          </div>
        </div>
        <pre className="output-box p-3 rounded" style={{
          background: "#1a1a1a",
          border: "1px solid #333333",
          color: "#fff",
          fontFamily: "'Courier New', monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          minHeight: "150px",
          borderRadius: "4px"
        }}>
          {output || "Output will appear here after compilation..."}
        </pre>
      </div>
    </div>
  );
}

export default EditorPage;

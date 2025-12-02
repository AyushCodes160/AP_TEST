const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const axios = require("axios");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { passport, registerUser } = require("./auth");
const server = http.createServer(app);
require("dotenv").config();

const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
  cpp: { versionIndex: "4" },
  nodejs: { versionIndex: "3" },
  c: { versionIndex: "4" },
  ruby: { versionIndex: "3" },
  go: { versionIndex: "3" },
  scala: { versionIndex: "3" },
  bash: { versionIndex: "3" },
  sql: { versionIndex: "3" },
  pascal: { versionIndex: "2" },
  csharp: { versionIndex: "3" },
  php: { versionIndex: "3" },
  swift: { versionIndex: "3" },
  rust: { versionIndex: "3" },
  r: { versionIndex: "3" },
};

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'meowcollab-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  console.log('Socket connected', socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

app.get("/", (req, res) => {
  res.json({ message: "MeowCollab Server is running", status: "ok" });
});




app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await registerUser(email, password, username);
    
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging in after registration' });
      }
      res.json({ success: true, user: { id: user.id, email: user.email, username: user.username } });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error logging in' });
      }
      res.json({ success: true, user: { id: user.id, email: user.email, username: user.username } });
    });
  })(req, res, next);
});

app.post('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized. Please log in or continue as guest." });
};

app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        username: req.user.username,
        provider: req.user.provider,
        avatar: req.user.avatar
      } 
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/auth/guest', (req, res) => {
  const guestUser = {
    id: `guest_${Date.now()}`,
    username: `Guest_${Math.floor(Math.random() * 10000)}`,
    email: null,
    provider: 'guest',
    providerId: null,
    avatar: null,
    createdAt: new Date().toISOString()
  };

  req.login(guestUser, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating guest session' });
    }
    res.json({ success: true, user: guestUser });
  });
});


app.post("/compile", ensureAuthenticated, async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ 
      error: "Code and language are required",
      output: "Error: Please provide both code and language"
    });
  }

  if (!process.env.jDoodle_clientId || !process.env.kDoodle_clientSecret) {
    console.error("JDoodle credentials not configured");
    return res.status(500).json({ 
      error: "Code execution service not configured",
      output: "Error: Code execution service is not configured. Please set up JDoodle API credentials in the server .env file.\n\nTo fix this:\n1. Sign up at https://www.jdoodle.com/\n2. Get your Client ID and Client Secret\n3. Add them to server/.env file as:\n   jDoodle_clientId=your_client_id\n   kDoodle_clientSecret=your_client_secret"
    });
  }

  if (!languageConfig[language]) {
    return res.status(400).json({ 
      error: `Unsupported language: ${language}`,
      output: `Error: Language '${language}' is not supported`
    });
  }

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: language,
      versionIndex: languageConfig[language].versionIndex,
      clientId: process.env.jDoodle_clientId,
      clientSecret: process.env.kDoodle_clientSecret,
    }, {
      timeout: 10000,
    });

    if (response.data && response.data.statusCode) {
      if (response.data.statusCode === 200) {
        res.json({
          output: response.data.output || "",
          statusCode: response.data.statusCode,
          memory: response.data.memory,
          cpuTime: response.data.cpuTime
        });
      } else {
        res.json({
          output: response.data.output || `Error: ${response.data.error || 'Compilation failed'}`,
          statusCode: response.data.statusCode,
          error: response.data.error
        });
      }
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error("Compilation error:", error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(500).json({ 
        error: "Request timeout",
        output: "Error: Code execution timed out. Please try again with a simpler program."
      });
    }
    
    if (error.response) {
      return res.status(error.response.status || 500).json({ 
        error: error.response.data?.error || "Compilation failed",
        output: error.response.data?.output || `Error: ${error.response.data?.error || 'Failed to execute code'}`
      });
    }
    
    res.status(500).json({ 
      error: "Failed to compile code",
      output: `Error: ${error.message || "Failed to connect to code execution service"}`
    });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

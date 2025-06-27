const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
const VOTES_FILE = path.join(__dirname, 'votes.json');

// Helper to read/write JSON files
function readJson(file) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Create session
app.post('/api/session', (req, res) => {
  const sessions = readJson(SESSIONS_FILE);
  const sessionId = Math.random().toString(36).substr(2, 9);
  sessions[sessionId] = { id: sessionId, ...req.body };
  writeJson(SESSIONS_FILE, sessions);
  res.json({ sessionId });
});

// Get session
app.get('/api/session/:id', (req, res) => {
  const sessions = readJson(SESSIONS_FILE);
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Save vote
app.post('/api/vote', (req, res) => {
  const votes = readJson(VOTES_FILE);
  const { sessionId, participantName, componentVotes } = req.body;
  if (!votes[sessionId]) votes[sessionId] = [];
  votes[sessionId].push({ participantName, componentVotes, timestamp: new Date().toISOString() });
  writeJson(VOTES_FILE, votes);
  res.json({ success: true });
});

// Get votes for a session
app.get('/api/votes/:sessionId', (req, res) => {
  const votes = readJson(VOTES_FILE);
  res.json(votes[req.params.sessionId] || []);
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
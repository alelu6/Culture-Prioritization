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
  try {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
    return {};
  }
}
function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing file ${file}:`, err);
  }
}

// Create session
app.post('/api/session', (req, res) => {
  try {
    const sessions = readJson(SESSIONS_FILE);
    const sessionId = Math.random().toString(36).substr(2, 9);
    sessions[sessionId] = { id: sessionId, ...req.body };
    writeJson(SESSIONS_FILE, sessions);
    console.log(`[API] Created session ${sessionId}`);
    res.json({ sessionId });
  } catch (err) {
    console.error('[API] Error creating session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session
app.get('/api/session/:id', (req, res) => {
  try {
    const sessions = readJson(SESSIONS_FILE);
    const session = sessions[req.params.id];
    if (!session) {
      console.warn(`[API] Session not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error('[API] Error getting session:', err);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Save vote
app.post('/api/vote', (req, res) => {
  try {
    const votes = readJson(VOTES_FILE);
    const { sessionId, participantName, componentVotes } = req.body;
    if (!votes[sessionId]) votes[sessionId] = [];
    votes[sessionId].push({ participantName, componentVotes, timestamp: new Date().toISOString() });
    writeJson(VOTES_FILE, votes);
    console.log(`[API] Saved vote for session ${sessionId}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[API] Error saving vote:', err);
    res.status(500).json({ error: 'Failed to save vote' });
  }
});

// Get votes for a session
app.get('/api/votes/:sessionId', (req, res) => {
  try {
    const votes = readJson(VOTES_FILE);
    res.json(votes[req.params.sessionId] || []);
  } catch (err) {
    console.error('[API] Error getting votes:', err);
    res.status(500).json({ error: 'Failed to get votes' });
  }
});

// Debug endpoint to test API connectivity
app.get('/api/session/debugtest', (req, res) => {
  try {
    const sessions = readJson(SESSIONS_FILE);
    res.json({ message: 'API is working!', sessions });
  } catch (err) {
    console.error('[API] Debug endpoint error:', err);
    res.status(500).json({ error: 'Debug endpoint failed' });
  }
});

// List all sessions
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = readJson(SESSIONS_FILE);
    res.json(sessions);
  } catch (err) {
    console.error('[API] Error listing sessions:', err);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
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
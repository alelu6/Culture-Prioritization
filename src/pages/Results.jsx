import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Alert,
  Button,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { getSession, getSessionVotes, calculateResults } from '../utils/sessionStorage'

// Add quadrant labels and colors for the matrix
const quadrantLabels = [
  ['Low Impact / Low Urgency', 'Low Impact / High Urgency'],
  ['High Impact / Low Urgency', 'High Impact / High Urgency'],
];

const quadrantColors = [
  ['#f5f5f5', '#ffe0b2'],
  ['#b2dfdb', '#c8e6c9'],
];

function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  
  // Get session data
  const sessionData = getSession(sessionId)
  const sessionVotes = getSessionVotes(sessionId)
  const componentResults = calculateResults(sessionId)

  // Show error if session doesn't exist
  if (!sessionData) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Session not found. Please check the Session ID and try again.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Box>
    )
  }

  // Build quadrant matrix: [row][col] (row: impact, col: urgency)
  const quadrantMatrix = {
    high: { high: [], low: [] },
    low: { high: [], low: [] },
  }
  
  componentResults.forEach((comp) => {
    quadrantMatrix[comp.impact][comp.urgency].push(comp)
  })

  // IBM Plex Sans font import (for global use, but here for local override)
  const fontFamily = 'IBM Plex Sans, Inter, Roboto, Arial, sans-serif';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, position: 'relative', fontFamily }}>
      {/* Header with session info */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily, fontWeight: 700, mb: 2 }}>
          {sessionData.name} - Priority Matrix Results
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Session ID: {sessionId}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Participants: {sessionVotes.length}
        </Typography>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '1', mx: 'auto', mb: 6 }}>
        {/* Impact axis label (left, vertical, further left) */}
        <Box sx={{ position: 'absolute', left: -110, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily, fontWeight: 600, fontSize: 20, color: '#222', letterSpacing: 1, textAlign: 'center', width: 120, pointerEvents: 'none' }}>
          {sessionData.xAxis}
        </Box>
        {/* Urgency axis label (bottom, horizontal, further down) */}
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: -62, fontFamily, fontWeight: 600, fontSize: 20, color: '#222', letterSpacing: 1, textAlign: 'center', pointerEvents: 'none' }}>
          {sessionData.yAxis}
        </Box>
        {/* Low/High for Impact (vertical axis, rotated, closer to matrix) */}
        <Box sx={{ position: 'absolute', left: -28, top: 28, fontFamily, fontWeight: 500, fontSize: 16, color: '#222', textAlign: 'center', pointerEvents: 'none', transform: 'rotate(-90deg)', transformOrigin: 'left top' }}>High</Box>
        <Box sx={{ position: 'absolute', left: -28, bottom: 28, fontFamily, fontWeight: 500, fontSize: 16, color: '#222', textAlign: 'center', pointerEvents: 'none', transform: 'rotate(-90deg)', transformOrigin: 'left bottom' }}>Low</Box>
        {/* Low/High for Urgency (horizontal axis, closer to matrix) */}
        <Box sx={{ position: 'absolute', left: 28, bottom: -32, fontFamily, fontWeight: 500, fontSize: 16, color: '#222', textAlign: 'center', pointerEvents: 'none' }}>Low</Box>
        <Box sx={{ position: 'absolute', right: 28, bottom: -32, fontFamily, fontWeight: 500, fontSize: 16, color: '#222', textAlign: 'center', pointerEvents: 'none' }}>High</Box>
        {/* Matrix grid, seamless (no borders) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gridTemplateColumns: '1fr 1fr',
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: 0,
            overflow: 'hidden',
            background: 'transparent',
          }}
        >
          {['high', 'low'].map((impact, rowIdx) =>
            ['low', 'high'].map((urgency, colIdx) => (
              <Box
                key={`${rowIdx}-${colIdx}`}
                sx={{
                  bgcolor: quadrantColors[rowIdx][colIdx],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  minHeight: 0,
                  minWidth: 0,
                  position: 'relative',
                  p: 0,
                  m: 0,
                  height: '100%',
                  width: '100%',
                }}
              >
                {/* Quadrant title at top center */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#222',
                    fontSize: 22,
                    textAlign: 'center',
                    fontFamily,
                    mt: 3,
                    mb: 0,
                    width: '100%',
                    userSelect: 'none',
                  }}
                >
                  {quadrantLabels[rowIdx][colIdx]}
                </Typography>
                {/* Render components in this quadrant with vote counts */}
                {quadrantMatrix[impact][urgency].map((comp) => (
                  <Box key={comp.key} sx={{ mt: 2, mb: 1, px: 2, py: 1, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, minWidth: 180 }}>
                    <Typography sx={{ fontFamily, fontWeight: 600, color: '#023365', fontSize: 18 }}>{comp.name}</Typography>
                    <Typography sx={{ fontFamily, fontWeight: 400, color: '#555', fontSize: 14 }}>
                      {sessionData.xAxis}: High {comp.highImpactVotes} / Low {comp.totalVotes - comp.highImpactVotes} <br/>
                      {sessionData.yAxis}: High {comp.highUrgencyVotes} / Low {comp.totalVotes - comp.highUrgencyVotes}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

      {/* Participants list */}
      {sessionVotes.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Participants ({sessionVotes.length})
          </Typography>
          <Grid container spacing={1}>
            {sessionVotes.map((vote, index) => (
              <Grid item xs={12} sm={6} md={4} key={vote.id}>
                <Typography variant="body2" color="text.secondary">
                  {index + 1}. {vote.participantName}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Navigation buttons */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Go to Home
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/session/${sessionId}`)}
        >
          Join Session Again
        </Button>
      </Box>
    </Box>
  )
}

export default Results 
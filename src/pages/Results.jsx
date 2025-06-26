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
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'

// Mock results data for demonstration
const mockResultsData = {
  name: 'Sample Session',
  xAxis: 'Impact',
  yAxis: 'Urgency',
  strategicPriorities: ['Low', 'High'], // For both axes
  categories: [
    { name: 'Category 1', components: [
      { name: 'Component 1', description: 'Description 1', x: 'High', y: 'High' },
      { name: 'Component 2', description: 'Description 2', x: 'Low', y: 'Mid' },
    ] },
    { name: 'Category 2', components: [
      { name: 'Component 3', description: 'Description 3', x: 'Mid', y: 'Low' },
    ] },
  ],
}

// --- SAMPLE DATA FOR PREVIEW ---
const sampleParticipants = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
  { id: 4, name: 'David' },
]
const sampleComponents = [
  { id: 1, name: 'Component A', description: 'First component' },
  { id: 2, name: 'Component B', description: 'Second component' },
  { id: 3, name: 'Component C', description: 'Third component' },
  { id: 4, name: 'Component D', description: 'Fourth component' },
]
// Each vote: { participantId, componentId, impact: 'high'|'low', urgency: 'high'|'low' }
const sampleVotes = [
  { participantId: 1, componentId: 1, impact: 'high', urgency: 'high' },
  { participantId: 2, componentId: 1, impact: 'high', urgency: 'low' },
  { participantId: 3, componentId: 1, impact: 'high', urgency: 'high' },
  { participantId: 4, componentId: 1, impact: 'low', urgency: 'high' },

  { participantId: 1, componentId: 2, impact: 'low', urgency: 'low' },
  { participantId: 2, componentId: 2, impact: 'low', urgency: 'low' },
  { participantId: 3, componentId: 2, impact: 'low', urgency: 'low' },
  { participantId: 4, componentId: 2, impact: 'low', urgency: 'low' },

  { participantId: 1, componentId: 3, impact: 'high', urgency: 'low' },
  { participantId: 2, componentId: 3, impact: 'high', urgency: 'low' },
  { participantId: 3, componentId: 3, impact: 'low', urgency: 'low' },
  { participantId: 4, componentId: 3, impact: 'high', urgency: 'low' },

  { participantId: 1, componentId: 4, impact: 'low', urgency: 'high' },
  { participantId: 2, componentId: 4, impact: 'low', urgency: 'high' },
  { participantId: 3, componentId: 4, impact: 'low', urgency: 'high' },
  { participantId: 4, componentId: 4, impact: 'low', urgency: 'high' },
]
const participantCount = sampleParticipants.length

// For each component, count high/low votes for impact and urgency
const componentResults = sampleComponents.map((comp) => {
  const votes = sampleVotes.filter((v) => v.componentId === comp.id)
  const highImpactVotes = votes.filter((v) => v.impact === 'high').length
  const highUrgencyVotes = votes.filter((v) => v.urgency === 'high').length
  const impact = highImpactVotes > participantCount / 2 ? 'high' : 'low'
  const urgency = highUrgencyVotes > participantCount / 2 ? 'high' : 'low'
  return { ...comp, impact, urgency }
})
// Build quadrant matrix: [row][col] (row: impact, col: urgency)
const quadrantMatrix = {
  high: { high: [], low: [] },
  low: { high: [], low: [] },
}
componentResults.forEach((comp) => {
  quadrantMatrix[comp.impact][comp.urgency].push(comp)
})

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
  // IBM Plex Sans font import (for global use, but here for local override)
  const fontFamily = 'IBM Plex Sans, Inter, Roboto, Arial, sans-serif';

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, position: 'relative', fontFamily }}>
      {/* Title above matrix */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontFamily, fontWeight: 700, mb: 2 }}>
        Sample Session - Priority Matrix Results
      </Typography>
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 500, aspectRatio: '1', mx: 'auto', mb: 6 }}>
        {/* Impact axis label (left, vertical, further left) */}
        <Box sx={{ position: 'absolute', left: -110, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily, fontWeight: 600, fontSize: 20, color: '#222', letterSpacing: 1, textAlign: 'center', width: 120, pointerEvents: 'none' }}>
          Impact
        </Box>
        {/* Urgency axis label (bottom, horizontal, further down) */}
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: -62, fontFamily, fontWeight: 600, fontSize: 20, color: '#222', letterSpacing: 1, textAlign: 'center', pointerEvents: 'none' }}>
          Urgency
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
                {quadrantMatrix[impact][urgency].map((comp) => {
                  const votes = sampleVotes.filter((v) => v.componentId === comp.id)
                  const highImpactVotes = votes.filter((v) => v.impact === 'high').length
                  const lowImpactVotes = votes.filter((v) => v.impact === 'low').length
                  const highUrgencyVotes = votes.filter((v) => v.urgency === 'high').length
                  const lowUrgencyVotes = votes.filter((v) => v.urgency === 'low').length
                  return (
                    <Box key={comp.id} sx={{ mt: 2, mb: 1, px: 2, py: 1, bgcolor: '#fff', borderRadius: 2, boxShadow: 1, minWidth: 180 }}>
                      <Typography sx={{ fontFamily, fontWeight: 600, color: '#023365', fontSize: 18 }}>{comp.name}</Typography>
                      <Typography sx={{ fontFamily, fontWeight: 400, color: '#555', fontSize: 14 }}>
                        Impact: High {highImpactVotes} / Low {lowImpactVotes} <br/>
                        Urgency: High {highUrgencyVotes} / Low {lowUrgencyVotes}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Results 
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Alert,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material'

// Mock session data for demonstration
const mockSessionData = {
  name: 'Sample Session',
  xAxis: 'Impact',
  yAxis: 'Urgency',
  categories: [
    { name: 'Category 1', components: [
      { name: 'Component 1', description: 'Description 1' },
      { name: 'Component 2', description: 'Description 2' },
    ] },
    { name: 'Category 2', components: [
      { name: 'Component 3', description: 'Description 3' },
    ] },
  ],
}

function VotingSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [participantName, setParticipantName] = useState('')
  // votes: { componentKey: { impact: boolean, urgency: boolean } }
  const [votes, setVotes] = useState({})
  const [error, setError] = useState('')

  // In a real app, fetch session data by sessionId
  const sessionData = mockSessionData

  // Helper to get all components with their category
  const allComponents = sessionData.categories.flatMap((cat, catIdx) =>
    cat.components.map((comp, compIdx) => ({
      ...comp,
      category: cat.name,
      key: `${catIdx}-${compIdx}`,
    }))
  )

  // Group components by category for rendering
  const componentsByCategory = sessionData.categories.map((cat, catIdx) => ({
    name: cat.name,
    components: cat.components.map((comp, compIdx) => ({
      ...comp,
      key: `${catIdx}-${compIdx}`,
    })),
  }))

  const handleVoteChange = (componentKey, axis, checked) => {
    setVotes((prev) => ({
      ...prev,
      [componentKey]: {
        ...prev[componentKey],
        [axis]: checked,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!participantName) {
      setError('Please enter your name')
      return
    }
    // Here you would typically save the votes to your backend
    navigate(`/results/${sessionId}`)
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {sessionData.name}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Vote for High Impact and High Urgency
          </Typography>

          {componentsByCategory.map((cat) => (
            <Box key={cat.name} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#00E6B2', fontWeight: 700 }}>
                {cat.name}
              </Typography>
              <Grid container spacing={2}>
                {cat.components.map((component) => (
                  <Grid item xs={12} md={6} key={component.key}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {component.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {component.description}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!votes[component.key]?.impact}
                            onChange={(e) => handleVoteChange(component.key, 'impact', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="High Impact"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!votes[component.key]?.urgency}
                            onChange={(e) => handleVoteChange(component.key, 'urgency', e.target.checked)}
                            color="secondary"
                          />
                        }
                        label="High Urgency"
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Submit Votes
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default VotingSession 
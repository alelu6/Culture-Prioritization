import React, { useState, useEffect } from 'react'
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
  CircularProgress,
} from '@mui/material'
import { getSession, saveVote } from '../utils/sessionStorage'

function VotingSession() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [participantName, setParticipantName] = useState('')
  // votes: { componentKey: { impact: boolean, urgency: boolean } }
  const [votes, setVotes] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      setFetching(true)
      const data = await getSession(sessionId)
      setSessionData(data)
      setFetching(false)
    }
    fetchSession()
  }, [sessionId])

  if (fetching) {
    return <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, textAlign: 'center' }}><CircularProgress /></Box>
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!participantName.trim()) {
      setError('Please enter your name')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Save the vote
      await saveVote(sessionId, participantName, votes)
      
      // Navigate to results
      navigate(`/results/${sessionId}`)
    } catch (err) {
      setError('Failed to submit votes. Please try again.')
      setLoading(false)
    }
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Votes'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default VotingSession 
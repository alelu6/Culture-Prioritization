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

  // Count votes used
  const maxVotes = sessionData.votesPerLevel?.High || 1
  const usedImpactVotes = Object.values(votes).filter(v => v.impact).length
  const usedUrgencyVotes = Object.values(votes).filter(v => v.urgency).length
  const impactVotesLeft = maxVotes - usedImpactVotes
  const urgencyVotesLeft = maxVotes - usedUrgencyVotes

  const handleVoteChange = (componentKey, axis, checked) => {
    // Prevent voting if max is reached
    if (axis === 'impact' && !votes[componentKey]?.impact && checked && usedImpactVotes >= maxVotes) return
    if (axis === 'urgency' && !votes[componentKey]?.urgency && checked && usedUrgencyVotes >= maxVotes) return
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

          <Box sx={{ overflowX: 'auto', mb: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 4 }}>
              <Typography color="primary" fontWeight={600}>
                Impact votes left: {impactVotesLeft} / {maxVotes}
              </Typography>
              <Typography color="secondary" fontWeight={600}>
                Urgency votes left: {urgencyVotesLeft} / {maxVotes}
              </Typography>
            </Box>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Component</th>
                  <th style={{ textAlign: 'center', padding: 8 }}>Vote</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.categories.map((cat, catIdx) => (
                  <React.Fragment key={cat.name}>
                    <tr>
                      <td colSpan={2} style={{ background: '#e0f7fa', fontWeight: 700, padding: 8 }}>
                        {cat.name}
                      </td>
                    </tr>
                    {cat.components.map((component, compIdx) => {
                      const compKey = `${catIdx}-${compIdx}`
                      return (
                        <tr key={compIdx}>
                          <td style={{ padding: 8, fontWeight: 600 }}>
                            {component.name}
                            <div style={{ fontWeight: 400, color: '#666', fontSize: 13 }}>{component.description}</div>
                          </td>
                          <td style={{ textAlign: 'center', padding: 8 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!votes[compKey]?.impact}
                                  onChange={(e) => handleVoteChange(compKey, 'impact', e.target.checked)}
                                  color="primary"
                                  disabled={(!votes[compKey]?.impact && usedImpactVotes >= maxVotes)}
                                />
                              }
                              label={<span style={{ fontSize: 13 }}>High Impact</span>}
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!votes[compKey]?.urgency}
                                  onChange={(e) => handleVoteChange(compKey, 'urgency', e.target.checked)}
                                  color="secondary"
                                  disabled={(!votes[compKey]?.urgency && usedUrgencyVotes >= maxVotes)}
                                />
                              }
                              label={<span style={{ fontSize: 13 }}>High Urgency</span>}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </Box>

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
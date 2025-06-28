import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'
import { clearAllData, listAllSessions } from '../utils/sessionStorage'

function Home() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch('/api/sessions')
        const data = await res.json()
        // Convert sessions object to array
        setSessions(Object.values(data))
      } catch (err) {
        setSessions([])
      }
    }
    fetchSessions()
  }, [])

  const handleDebugClear = () => {
    clearAllData()
    alert('All session data cleared!')
  }

  const handleDebugList = () => {
    const sessions = listAllSessions()
    alert(`Found ${sessions.length} sessions: ${sessions.map(([id, session]) => `${id}: ${session.name}`).join(', ')}`)
  }

  const handleDebugApi = async () => {
    try {
      const res = await fetch('/api/session/debugtest', { method: 'GET' })
      const data = await res.json()
      console.log('DEBUG /api/session/debugtest response:', data)
      alert('DEBUG /api/session/debugtest response: ' + JSON.stringify(data))
    } catch (err) {
      console.error('DEBUG /api/session/debugtest error:', err)
      alert('DEBUG /api/session/debugtest error: ' + err)
    }
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to Priority Matrix
      </Typography>
      <Typography variant="body1" paragraph align="center" color="text.secondary">
        Create or join a prioritization session to help your team make better decisions
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => navigate('/create')}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Create New Session
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Set up a new prioritization session with custom categories and voting rules
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: 6,
              },
            }}
            onClick={() => {
              const sessionId = prompt('Enter session ID:')
              if (sessionId) {
                navigate(`/session/${sessionId}`)
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <GroupIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Join Session
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join an existing session to participate in the prioritization process
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Session List Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#023365', fontWeight: 700 }}>
          Session List
        </Typography>
        <Paper sx={{ p: 2 }}>
          {sessions.length === 0 ? (
            <Typography color="text.secondary">No sessions found.</Typography>
          ) : (
            <List>
              {sessions.map((session) => (
                <React.Fragment key={session.id}>
                  <ListItem button onClick={() => navigate(`/session/${session.id}`)}>
                    <ListItemText
                      primary={session.name || session.id}
                      secondary={`ID: ${session.id} | Created: ${session.createdAt ? new Date(session.createdAt).toLocaleString() : ''}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Debug buttons - remove these after fixing the issue */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
          Debug Tools (Remove after fixing)
        </Typography>
        <Button onClick={handleDebugList} variant="outlined" sx={{ mr: 2 }}>
          List All Sessions
        </Button>
        <Button onClick={handleDebugClear} variant="outlined" color="error" sx={{ mr: 2 }}>
          Clear All Data
        </Button>
        <Button onClick={handleDebugApi} variant="outlined" color="secondary">
          Test API /api/session/debugtest
        </Button>
      </Box>
    </Box>
  )
}

export default Home 
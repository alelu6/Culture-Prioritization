import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import GroupIcon from '@mui/icons-material/Group'

function Home() {
  const navigate = useNavigate()

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
    </Box>
  )
}

export default Home 
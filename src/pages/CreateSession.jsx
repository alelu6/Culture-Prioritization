import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const VOTE_LEVELS = ['High', 'Low']

function CreateSession() {
  const navigate = useNavigate()
  const [sessionName, setSessionName] = useState('')
  const [xAxis, setXAxis] = useState('Impact')
  const [yAxis, setYAxis] = useState('Urgency')
  const [strategicPriorities, setStrategicPriorities] = useState(['Priority 1', 'Priority 2'])
  const [categories, setCategories] = useState([
    { name: 'Category 1', components: [{ name: '', description: '' }] },
  ])
  const [votesPerLevel, setVotesPerLevel] = useState({ High: 1 })

  // Strategic Priorities handlers
  const handleAddPriority = () => {
    setStrategicPriorities([...strategicPriorities, ''])
  }
  const handleRemovePriority = (idx) => {
    setStrategicPriorities(strategicPriorities.filter((_, i) => i !== idx))
  }
  const handlePriorityChange = (idx, value) => {
    const newPriorities = [...strategicPriorities]
    newPriorities[idx] = value
    setStrategicPriorities(newPriorities)
  }

  const handleAddCategory = () => {
    setCategories([...categories, { name: '', components: [{ name: '', description: '' }] }])
  }

  const handleRemoveCategory = (catIdx) => {
    setCategories(categories.filter((_, i) => i !== catIdx))
  }

  const handleCategoryChange = (catIdx, value) => {
    const newCategories = [...categories]
    newCategories[catIdx].name = value
    setCategories(newCategories)
  }

  const handleAddComponent = (catIdx) => {
    const newCategories = [...categories]
    newCategories[catIdx].components.push({ name: '', description: '' })
    setCategories(newCategories)
  }

  const handleRemoveComponent = (catIdx, compIdx) => {
    const newCategories = [...categories]
    newCategories[catIdx].components = newCategories[catIdx].components.filter((_, i) => i !== compIdx)
    setCategories(newCategories)
  }

  const handleComponentChange = (catIdx, compIdx, field, value) => {
    const newCategories = [...categories]
    newCategories[catIdx].components[compIdx][field] = value
    setCategories(newCategories)
  }

  const handleVotesPerLevelChange = (level, value) => {
    setVotesPerLevel({ ...votesPerLevel, [level]: Number(value) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically save the session to your backend
    const sessionId = Math.random().toString(36).substr(2, 9)
    // For now, we'll just navigate to the session page
    navigate(`/session/${sessionId}`)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Priority Session
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Session Name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="X Axis Name"
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Y Axis Name"
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              required
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Strategic Priorities
        </Typography>
        {strategicPriorities.map((priority, idx) => (
          <Grid container spacing={2} key={idx} sx={{ mb: 1 }} alignItems="center">
            <Grid item xs={11}>
              <TextField
                fullWidth
                label={`Priority ${idx + 1}`}
                value={priority}
                onChange={(e) => handlePriorityChange(idx, e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton color="error" onClick={() => handleRemovePriority(idx)} disabled={strategicPriorities.length === 1}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddPriority} sx={{ mb: 3 }}>
          Add Priority
        </Button>

        <Typography variant="h6" gutterBottom>
          Categories & Components
        </Typography>
        {categories.map((category, catIdx) => (
          <Paper key={catIdx} sx={{ p: 2, mb: 2, background: '#F7FDFD', border: '1px solid #00E6B2' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={11}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={category.name}
                  onChange={(e) => handleCategoryChange(catIdx, e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton color="error" onClick={() => handleRemoveCategory(catIdx)} disabled={categories.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Components
            </Typography>
            {category.components.map((component, compIdx) => (
              <Grid container spacing={2} key={compIdx} sx={{ mb: 1 }} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Component Name"
                    value={component.name}
                    onChange={(e) => handleComponentChange(catIdx, compIdx, 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={component.description}
                    onChange={(e) => handleComponentChange(catIdx, compIdx, 'description', e.target.value)}
                    multiline
                    rows={1}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => handleRemoveComponent(catIdx, compIdx)} disabled={category.components.length === 1}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => handleAddComponent(catIdx)} sx={{ mt: 1 }}>
              Add Component
            </Button>
          </Paper>
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddCategory} sx={{ mb: 3 }}>
          Add Category
        </Button>

        <Typography variant="h6" gutterBottom>
          Votes per Level
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6} key={'High'}>
            <TextField
              fullWidth
              label={`Votes for High`}
              type="number"
              inputProps={{ min: 0 }}
              value={votesPerLevel['High']}
              onChange={(e) => handleVotesPerLevelChange('High', e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={6} key={'Low'}>
            <TextField
              fullWidth
              label={`Votes for Low (unlimited)`}
              value={'∞'}
              InputProps={{ readOnly: true }}
              disabled
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Create Session
        </Button>
      </Paper>
    </Box>
  )
}

export default CreateSession 
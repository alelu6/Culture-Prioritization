import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateSession from './pages/CreateSession'
import VotingSession from './pages/VotingSession'
import Results from './pages/Results'

const theme = createTheme({
  palette: {
    primary: {
      main: '#00E6B2', // Kushki green
      contrastText: '#023365',
    },
    secondary: {
      main: '#023365', // Dive blue
      contrastText: '#fff',
    },
    background: {
      default: '#F7FDFD',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#023365',
    },
    h6: {
      fontWeight: 700,
      color: '#00E6B2',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateSession />} />
          <Route path="/session/:sessionId" element={<VotingSession />} />
          <Route path="/results/:sessionId" element={<Results />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App 
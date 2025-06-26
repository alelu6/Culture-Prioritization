import React from 'react'
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material'
import { Link } from 'react-router-dom'

const logoUrl = '/kushki-logo.png'

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#023365', borderBottom: '2px solid #00E6B2' }}>
        <Toolbar sx={{ minHeight: 80 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 2 }}>
            <img src={logoUrl} alt="Kushki Logo" style={{ height: 48, marginRight: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#023365', letterSpacing: 1 }}>
              Priority Matrix
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#023365',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="#fff" align="center">
            © {new Date().getFullYear()} Prioritization Tool
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout 
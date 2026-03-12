import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Avatar,
  Alert
} from '@mui/material';
import { LocalHospital as HospitalIcon } from '@mui/icons-material';

export default function HospitalLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add authentication logic here
    if (formData.email && formData.password) {
      navigate('/hospital/dashboard');
    } else {
      setError('Please enter both email and password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#4caf50',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <HospitalIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Hospital Services
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your healthcare system
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                margin="normal"
                required
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  bgcolor: '#4caf50',
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Sign In
              </Button>
            </form>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/hospital/register" 
                  style={{ color: '#4caf50', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Register here
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <Link 
                  to="/" 
                  style={{ color: '#666', textDecoration: 'none' }}
                >
                  ← Back to Service Selection
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStockAuth } from '../../context/StockAuthContext.jsx';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  TextField,
  Button,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Inventory as StockIcon } from '@mui/icons-material';

export default function StockLogin() {
  const navigate = useNavigate();
  const { login, loading } = useStockAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/stock');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
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
                  bgcolor: '#2196f3',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <StockIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Stock Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your inventory system
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
                disabled={isLoading}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  bgcolor: '#2196f3',
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link 
                  to="/stock/register" 
                  style={{ color: '#2196f3', textDecoration: 'none', fontWeight: 'bold' }}
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
import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      await api.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
      });
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.verifyOtp(formData);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign up failed');
    }
  };

  const googleSuccess = async (res: any) => {
    const { credential } = res;
    try {
      const { data } = await api.googleSignup({ token: credential });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 1, sm: 2, md: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          width: { xs: '100%', sm: '100%', md: '900px' },
          height: { xs: '100%', md: '80vh' },
          boxShadow: 3,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Left: Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            px: { xs: 2, sm: 4, md: 4 },
            py: { xs: 2, sm: 4, md: 4 },
            mt: { xs: 2, md: 3 },
            mb: { xs: 2, md: 3 },
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Sign up
          </Typography>
          <Typography variant="body2" color="textSecondary" >
            Sign up to enjoy the feature of HD
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 320 }}>
            {!otpSent ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Your Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  id="dateOfBirth"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  size="small"
                />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1, mb: 1, height: 40, fontSize: 16 }}
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="otp"
                  label="OTP"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  size="small"
                  autoComplete="one-time-code"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, height: 40, fontSize: 16 }}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Grid container sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/signin" variant="body2">
                {'Already have an account? Sign In'}
              </Link>
            </Grid>
            <Box sx={{ my: 2 }}>
              <GoogleLogin onSuccess={googleSuccess} onError={() => console.log('Login Failed')} />
            </Box>
          </Box>
        </Box>
        {/* Right: Image - hidden on mobile */}
        <Box
          sx={{
            width: '50%',
            display: { xs: 'none', md: 'block' },
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url(https://wallpaperaccess.com/full/7868571.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
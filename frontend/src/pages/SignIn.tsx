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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      await api.sendSigninOtp({ email: formData.email, password: formData.password });
      setFormData({ ...formData, otp: '' }); 
      setOtpSent(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.signin(formData);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sign in failed');
      }
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
            Sign in
          </Typography>
          <Typography variant="body2" color="textSecondary" >
            Please login to continue to your account.
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 320 }}>
            {!otpSent ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" size="small" />}
                  label="Keep me logged in"
                  sx={{ mb: 1 }}
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
                  Sign In
                </Button>
              </>
            )}
            <Grid container sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/signup" variant="body2">
                {"Need an account? Create one"}
              </Link>
            </Grid>
            <Box sx={{ my: 2 }}>
              <GoogleLogin onSuccess={googleSuccess} onError={() => console.log('Login Failed')} />
            </Box>
          </Box>
        </Box>
        {/* Right: hidden on mobile */}
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

export default SignIn;

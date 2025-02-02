import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { loginUser } from '../Datastore/authSlice';
import { useAppDispatch } from '../Datastore/hooks';
import { useNotification } from '../Components/NotificationProvider';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const {handleHttpError} = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 0) {
      // console.log('Logging in:', { email: formData.email, password: formData.password })
      dispatch(loginUser(formData.email, formData.password))
      .then(() => navigate('/spa'))
      .catch((e) => handleHttpError(e))
    }
    else {
      if (formData.password !== formData.confirmPassword) {
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 450, boxShadow: 3, borderRadius: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Sign In" />
          <Tab label="Create Account" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <Box sx={{ minHeight: 200 }}>
            {activeTab === 1 && (
              <TextField fullWidth label="Name" variant="outlined" margin="normal" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            )}
            <TextField fullWidth label="Email" variant="outlined" margin="normal" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              InputProps={{ endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </IconButton>
                </InputAdornment>
              ) }}
            />

            {activeTab === 1 && (
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </IconButton>
                  </InputAdornment>
                ) }}
              />
            )}
          </Box>

          {/* {activeTab === 0 && (
            <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
              <FormControlLabel control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} color="primary" />} label="Remember me" />
            </Box>
          )} */}

          <Button fullWidth variant="contained" size="large" type="submit">
            {activeTab === 0 ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          {activeTab === 0
            ? (
                <>
                  Don't have an account?
                  {' '}
                  <Button onClick={() => setActiveTab(1)} sx={{ textTransform: 'none', fontWeight: 500 }}>Sign up</Button>
                </>
              )
            : (
                <>
                  Already have an account?
                  {' '}
                  <Button onClick={() => setActiveTab(0)} sx={{ textTransform: 'none', fontWeight: 500 }}>Sign in</Button>
                </>
              )}
        </Typography>
      </Card>
    </Box>
  )
}

export default AuthPage

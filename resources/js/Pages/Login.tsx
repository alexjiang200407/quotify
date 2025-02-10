import {
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
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
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../Components/NotificationProvider'
import { loginUser } from '../Datastore/authSlice'
import { useAppDispatch } from '../Datastore/hooks'

function AuthPage() {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useAppDispatch()
  const { handleHttpError, addNotification } = useNotification()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const login = () => {
    dispatch(loginUser(formData.email, formData.password))
      .then(() => {
        navigate('/spa')
        addNotification({ label: 'Logged in successfully', alert: 'success' })
      })
      .catch(e => handleHttpError(e))
  }

  const register = () => {
    if (formData.password !== formData.confirmPassword) {
      addNotification({ label: 'Passwords does not match', alert: 'error' })
    }
    else {
      axios.post('/api/user/register', {
        email: formData.email,
        username: formData.name,
        password: formData.password,
      })
        .then(() => {
          addNotification({ label: 'Registration successful please login', alert: 'success' })
          setActiveTab(0)
        })
        .catch(e => handleHttpError(e))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 0) {
      login()
    }
    else {
      register()
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Card sx={{ p: 4, width: '100%', maxWidth: 450, boxShadow: 3, borderRadius: 2, backgroundColor: 'white', animation: 'fadeIn 0.3s ease-in' }}>
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

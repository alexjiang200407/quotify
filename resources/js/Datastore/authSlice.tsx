import type { Dispatch } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
      state.loading = false
      localStorage.setItem('token', action.payload)
    },
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer

export const loginUser = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginStart())
    const response = await axios.post('/api/login', {
      email,
      password,
    })
    dispatch(loginSuccess(response.data.token))
  }
}

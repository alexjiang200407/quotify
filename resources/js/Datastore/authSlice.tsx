import type { Dispatch } from '@reduxjs/toolkit'
import type { User } from '../types/httpResponseTypes'
import type { AppDispatch, RootState } from './store'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface InitialState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: null
}

const initialState: InitialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = true
      state.loading = false
      localStorage.setItem('token', action.payload)
    },
    loginFailure: (state) => {
      state.loading = false
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('token')
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser } = authSlice.actions
export default authSlice.reducer

export const getUser = () => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const token = getState().auth.token

    if (!token)
      return

    const auth = { headers: { Authorization: `Bearer ${token}` } }
    const response = await axios.get('/api/user', auth)
    dispatch(setUser(response.data))
  }
}

export const loginUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(loginStart())
    const response = await axios.post('/api/login', {
      email,
      password,
    })
    dispatch(loginSuccess(response.data.token))
    dispatch(getUser())
  }
}

export const logoutUser = (token: string) => {
  return async (dispatch: AppDispatch) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    return axios.delete('/api/logout', auth)
      .then(() => dispatch(logout()))
  }
}

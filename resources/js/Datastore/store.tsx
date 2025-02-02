import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import authReducer from './authSlice'

export default configureStore({
  reducer: { auth: authReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
})

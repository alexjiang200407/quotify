import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import authReducer from './authSlice'

const store = configureStore({
  reducer: { auth: authReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk),
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export default store;
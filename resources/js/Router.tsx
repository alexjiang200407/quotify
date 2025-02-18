import type { Theme } from '@emotion/react'

import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useNotification } from './Components/NotificationProvider'
import { logoutUser } from './Datastore/authSlice'
import { useAppDispatch, useAppSelector } from './Datastore/hooks'
import { setSearchResult } from './Datastore/searchSlice'
import Master from './Layouts/Master'
import Explore from './Pages/Explore'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import { createDefaultTheme } from './Themes/DefaultTheme'

export const App = () => {
  const token = useAppSelector(state => state.auth.token)
  const explorePageUrl = useAppSelector(state => state.search.lastSearchUrl)
  const dispatch = useAppDispatch()
  const { handleHttpError, addNotification } = useNotification()
  const [theme, setTheme] = useState<Partial<Theme>>(createDefaultTheme())

  useEffect(() => {
    const handleResize = () => {
      setTheme(createDefaultTheme())
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const tryLogOut = () => {
    if (token) {
      dispatch(logoutUser(token))
        .then(() => dispatch(setSearchResult(null)))
        .then(() => addNotification({ label: 'Successfully logged out', alert: 'success' }))
        .catch(e => handleHttpError(e, false))
    }
  }

  const headerPropsCommon = {
    pages: [
      {
        label: 'Home',
        link: '/spa/',
      },
      {
        label: 'Profile',
        link: '/spa/profile',
      },
      {
        label: 'Explore',
        link: explorePageUrl,
      },
    ],
  }

  const headerPropsLoggedIn = {
    pages: [
      ...headerPropsCommon.pages,
      {
        label: 'Logout',
        link: '/spa/login',
        onClick: tryLogOut,
      },
    ],
  }

  const headerProps = {
    pages: [
      ...headerPropsCommon.pages,
      {
        label: 'Login',
        link: '/spa/login',
      },
    ],
  }

  const [header, setHeader] = useState(headerProps)

  useEffect(() => {
    if (token) {
      setHeader(headerPropsLoggedIn)
    }
    else {
      setHeader(headerProps)
    }
  }, [token, explorePageUrl])

  return (
    <Routes>
      <Route
        path="/spa/"
        element={<Master headerProps={header} theme={theme} />}
      >
        <Route index element={<Home />} />
        <Route path="/spa/login" element={<Login />} />
        <Route path="/spa/profile" element={<Profile />} />
        <Route path="/spa/explore" element={<Explore />} />
      </Route>
    </Routes>
  )
}

export default App

import React, { useEffect, useState } from 'react'

import { Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './Datastore/hooks'
import Master from './Layouts/Master'
import Explore from './Pages/Explore'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Suggest from './Pages/Suggest'
import { createDefaultTheme } from './Themes/DefaultTheme'
import { logout } from './Datastore/authSlice'
import { useNotification } from './Components/NotificationProvider'

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
      label: 'Suggest',
      link: '/spa/suggest',
    },
    {
      label: 'Explore',
      link: '/spa/explore',
    },
  ],
}

function App() {
  const token = useAppSelector(state => state.auth.token)
  const dispatch = useAppDispatch()
  const {addNotification} = useNotification()
  const headerPropsLoggedIn = {
    pages: [
      ...headerPropsCommon.pages,
      {
        label: 'Logout',
        link: '/spa/login',
        onClick: (_: React.MouseEvent) => {
          dispatch(logout())
          addNotification({label: 'Successfully logged out', alert: 'success'})
        }
      },
    ],
  }
  
  const headerProps = {
    pages: [
      ...headerPropsCommon.pages,
      {
        label: 'Login',
        link: '/spa/login'
      },
    ],
  }


  const [header, setHeader] = useState(headerProps)

  useEffect(() => {
    // Update header whenever token changes
    if (token) {
      setHeader(headerPropsLoggedIn)
    }
    else {
      setHeader(headerProps)
    }
  }, [token])

  return (
    <Routes>
      <Route
        path="/spa/"
        element={<Master headerProps={header} theme={createDefaultTheme()} />}
      >
        <Route index element={<Home />} />
        <Route path="/spa/login" element={<Login />} />
        <Route path="/spa/profile" element={<Profile />} />
        <Route path="/spa/suggest" element={<Suggest />} />
        <Route path="/spa/explore" element={<Explore />} />
      </Route>
    </Routes>
  )
}

export default App

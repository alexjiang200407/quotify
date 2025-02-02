import React from 'react'

import { Route, Routes } from 'react-router-dom'
import Master from './Layouts/Master'
import Explore from './Pages/Explore'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Profile from './Pages/Profile'
import Suggest from './Pages/Suggest'
import { createDefaultTheme } from './Themes/DefaultTheme'

const headerProps = {
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
    {
      label: 'Login',
      link: '/spa/login',
    },
  ],
}

function App() {
  return (
    <Routes>
      <Route
        path="/spa/"
        element={<Master headerProps={headerProps} theme={createDefaultTheme()} />}
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

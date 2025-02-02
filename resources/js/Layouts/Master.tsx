import type { Theme } from '@mui/material'

import type { HeaderProps } from '../Components/Header'

import { ThemeProvider } from '@emotion/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'
import NotificationProvider from '../Components/NotificationProvider'

export interface MasterProps {
  theme: Partial<Theme>
  headerProps: HeaderProps
};

function Master(props: MasterProps) {
  return (
    <div>
      <ThemeProvider theme={props.theme}>
        <Header {...props.headerProps} />
        <main>
          <NotificationProvider>
            <section>
              <Outlet />
            </section>
          </NotificationProvider>
        </main>
      </ThemeProvider>
    </div>
  )
}

export default Master

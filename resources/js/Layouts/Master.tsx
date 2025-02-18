import type { Theme } from '@mui/material'

import type { HeaderProps } from '../Components/Header'

import { ThemeProvider } from '@emotion/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header, { HeaderProvider } from '../Components/Header'
import { SearchBarProvider } from '../Components/SearchBar'

export interface MasterProps {
  theme: Partial<Theme>
  headerProps: HeaderProps
};

export const Master = (props: MasterProps) => {
  return (
    <div>
      <ThemeProvider theme={props.theme}>
        <SearchBarProvider>
          <HeaderProvider>
            <Header {...props.headerProps} />
            <main>
              <section>
                <Outlet />
              </section>
            </main>
          </HeaderProvider>
        </SearchBarProvider>
      </ThemeProvider>
    </div>
  )
}

export default Master

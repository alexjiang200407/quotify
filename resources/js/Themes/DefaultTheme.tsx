import type { Theme } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material'
import { isMobileDevice } from '../ResponsiveUIProvider'

const defaultColorTheme = () => createTheme({
  palette: {
    primary: {
      main: '#f04720',
    },
    background: {
      default: '#BFCCB8',
      paper: '#F1EFE2',
    },
  },
  spacing: Math.max(4, Math.floor(window.innerWidth / 1920 * 8)),

})

export const createDefaultTheme = (): Theme => {
  const theme = createTheme(defaultColorTheme(), {
    typography: {
      body1: {
        fontFamily: [
          `body-font`,
        ].join(', '),
        lineHeight: isMobileDevice() ? 1.5 : 2.5,
      },
    },
    components: {
      Box: {
        styleOverrides: {
          root: {
            backgroundColor: '',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            'color': 'black',
            'transition': 'color 0.3s ease',
            'textDecoration': 'none',
            '&:hover': {
              color: defaultColorTheme().palette.primary.main,
              textDecoration: 'none',
            },
          },
        },
      },
    },
  })
  return responsiveFontSizes(theme)
}

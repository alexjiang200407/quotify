import type { Theme } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material'

const defaultColorTheme = createTheme({
  palette: {
    primary: {
      main: '#f04720',
    },
    background: {
      default: '#BFCCB8',
      paper: '#F1EFE2'
    }
  },
})

export function createDefaultTheme(colorTheme: Theme = defaultColorTheme): Theme {
  const theme = createTheme(colorTheme, {
    typography: {
      body1: {
        fontFamily: [
          `body-font`,
        ].join(', '),
      },
    },
    components: {
      Box: {
        styleOverrides: {
          root: {
            backgroundColor: ''
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
              color: defaultColorTheme.palette.primary.main,
              textDecoration: 'none',
            },
          },
        },
      },
    },
  })
  return responsiveFontSizes(theme)
}

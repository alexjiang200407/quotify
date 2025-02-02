import type { Theme } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material'

const defaultColorTheme = createTheme({
  palette: {
    primary: {
      main: 'rgb(255,0,0)',
    },
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

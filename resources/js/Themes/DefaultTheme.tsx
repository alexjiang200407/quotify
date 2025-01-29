import { createTheme, responsiveFontSizes, TextField, Theme } from "@mui/material";

const defaultColorTheme = createTheme({
    palette: {
        primary: {
            main: 'rgb(255,0,0)',
        }
    }
});

export const createDefaultTheme = (colorTheme: Theme = defaultColorTheme): Theme => {
    let theme = createTheme(colorTheme, {
        typography: {
            'body1': {
                fontFamily: [
                    `body-font`
                ].join(", ")
            }
        },
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: "black",
                        transition: "color 0.3s ease",
                        textDecoration: 'none',
                        "&:hover": {
                            color: defaultColorTheme.palette.primary.main,
                            textDecoration: "none",
                        },
                    },
                }
            },
        },
    });
    return responsiveFontSizes(theme);
}
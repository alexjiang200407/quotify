import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link, { LinkProps } from "./Link";
import { Stack, Tooltip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom"
import SearchBar from "./SearchBar";

export interface HeaderProps {
    pages: LinkProps[];
};

const Logo = () => {
    return (
        <RouterLink to="/spa/">
            <Tooltip title="Go Home" placement="right" arrow>
                <Typography
                    variant="h3"
                    id="logo"
                    sx={{
                        color: "primary.main",
                        fontFamily: "logo-font",
                        "&:hover": {
                            color: "lightgrey",
                        },
                        transition: "all 0.2s ease-in"
                    }}
                >
                    Quotify
                </Typography>
            </Tooltip>
        </RouterLink>
    );
} 

const Header = (props: HeaderProps) => {
    const [scrollPosition, setScrollPosition] = useState(window.screenY);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <AppBar
            position="fixed"
            sx={{
                top: '0',
                backgroundColor: "white",
                color: "black",
                boxShadow: "none",
                overflow: "visible",
            }}
        >
            <Container>
                <Stack
                    sx={{ padding: 4, minWidth: 0}}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={10}
                >
                    <Logo />
                    <SearchBar label="Search Quotes or Authors" />
                </Stack>
                <Toolbar>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                    >
                        {props.pages.map((page, i) => <Link key={i} {...page}/>)}
                    </Stack>
                </Toolbar>
            </Container>
            <Box
                sx={{
                    height: "4px",
                    backgroundColor: scrollPosition === 0 ? "lightgrey" : "#00000000",
                    overflow: "visible",
                    width: "100%",
                    zIndex: 10,
                    boxShadow: scrollPosition === 0 ? "none" : "0 5px 5px rgba(182, 182, 182, 0.75)",
                    transition: "box-shadow 0.8s ease"
                }}
            />
        </AppBar>
    );
}

export default Header;
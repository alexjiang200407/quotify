import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink, Typography } from "@mui/material";

export interface LinkProps {
    label: string;
    link: string;
};

const Link = (props: LinkProps) => {
    return (
        <MuiLink component={RouterLink} to={props.link}><Typography>{props.label}</Typography></MuiLink>
    );
}

export default Link;

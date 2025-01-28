import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

export interface LinkProps {
    label: string;
    link: string;
};

const Link = (props: LinkProps) => {
    return (
        <MuiLink component={RouterLink} to={props.link}>{props.label}</MuiLink>
    );
}

export default Link;

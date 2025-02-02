import { Link as MuiLink, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export interface LinkProps {
  label: string
  link: string
};

function Link(props: LinkProps) {
  return (
    <MuiLink component={RouterLink} to={props.link}><Typography>{props.label}</Typography></MuiLink>
  )
}

export default Link

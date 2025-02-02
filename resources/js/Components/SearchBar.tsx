import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Divider, IconButton, InputBase, Paper } from '@mui/material'
import React from 'react'

export interface SearchBarProps {
  label: string
};

function SearchBar(props: SearchBarProps) {
  return (
    <Paper
      component="form"
      sx={{ display: 'inline-flex', alignItems: 'center', borderRadius: 10, flex: 1 }}
    >
      <InputBase
        fullWidth
        sx={{ flex: 1, paddingInline: 2 }}
        placeholder={props.label}
        inputProps={{ 'aria-label': props.label }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ mr: 1 }}>
        <FontAwesomeIcon icon={faSearch} />
      </IconButton>
    </Paper>
  )
}

export default SearchBar

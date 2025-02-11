import type { Tag } from '../types/httpResponseTypes'
import { Chip } from '@mui/material'
import React from 'react'
import { useSearchBar } from './SearchBar'

function TagComponent({ label, id }: Tag) {
  const { goToPage } = useSearchBar()
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        goToPage([id], null, null)
      }}
    />
  )
}

export default TagComponent

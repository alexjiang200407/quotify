import type { Tag } from '../types/httpResponseTypes'
import { Chip } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useExplore } from '../Pages/Explore'

function TagComponent({ label, id }: Tag) {
  const navigate = useNavigate()
  const { goToPage } = useExplore()
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

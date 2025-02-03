import { Chip } from '@mui/material'
import React from 'react'
import { Tag } from '../types/httpResponseTypes'
import { useNavigate } from 'react-router-dom'

function TagComponent({ label, id }: Tag) {
  const navigate = useNavigate()
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
      onClick={e => {
        e.stopPropagation()
        navigate(`/spa/explore?tags=${id}`)
      }}
    />
  )
}

export default TagComponent

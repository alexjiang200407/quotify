import type { Tag } from '../types/httpResponseTypes'
import { Chip } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchBar } from './SearchBar'

function TagComponent({ label, id }: Tag) {
  const navigate = useNavigate()
  const { addTopic } = useSearchBar()
  return (
    <Chip
      label={label}
      size="small"
      sx={{ fontSize: '0.75rem', cursor: 'pointer' }}
      onClick={(e) => {
        e.stopPropagation()
        navigate(`/spa/explore?tags=${id}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        addTopic(id, 'tag', true)
      }}
    />
  )
}

export default TagComponent

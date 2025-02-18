import type { Quote } from '../types/httpResponseTypes'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import { ExpandedQuoteCard } from './ExpandedQuoteCard'

interface ExpandedQuoteModalProps {
  quote: Quote
  onClose: () => void
  updateQuote: (q: Quote) => void
}

export const ExpandedQuoteModal = ({ quote, onClose, updateQuote }: ExpandedQuoteModalProps) => {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const closeExpandedView = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setIsAnimatingOut(false)
      onClose()
    }, 300)
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        animation: `${isAnimatingOut ? 'fadeOut' : 'fadeIn'} 0.3s ease-out`,
        pointerEvents: isAnimatingOut ? 'none' : 'auto',
      }}
    >
      <Box
        onClick={closeExpandedView}
        sx={{
          'position': 'absolute',
          'top': 16,
          'left': 16,
          'cursor': 'pointer',
          'zIndex': 1,
          'padding': 1,
          '&:hover': { bgcolor: 'action.hover', borderRadius: '50%' },
        }}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </Box>

      <ExpandedQuoteCard
        quote={quote}
        updateQuote={updateQuote}
      />
    </Box>
  )
}

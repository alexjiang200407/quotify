import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import { Quote } from '../types/httpResponseTypes'

function Home() {
  const _quote : Quote = {
    id: 1,
    quote: 'All the world\'s a stage,\nAnd all the men and women merely players;\nThey have their exits and their entrances;\nAnd one man in his time plays many parts,\nHis acts being seven ages.',
    author: {
      id: 1,
      full_name: 'William Shakespeare',
      wiki_page: 'https://en.wikipedia.org/wiki/William_Shakespeare',
      description: 'English playwright, poet, and actor, widely regarded as the greatest writer in the English language.',
    },
    tags: [
      { id: 1, label: 'Philosophy' },
      { id: 2, label: 'Poetry' },
      { id: 3, label: 'Renaissance' },
    ],
    user_upvoted: false,
    user_saved: false,
    upvotes: 120,
    saves: 45,
  }

  const [quote, updateQuote] = useState(_quote)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', zIndex: 2 }}>
        Quote of the Day
      </Typography>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <ExpandedQuoteCard quote={quote} updateQuote={updateQuote} />
      </Box>
    </Box>
  )
}

export default Home

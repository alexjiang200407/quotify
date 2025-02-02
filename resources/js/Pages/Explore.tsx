import type { Quote } from '../types/httpResponseTypes'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  keyframes,
} from '@mui/material'
import React, { useState } from 'react'
import { CompactCard } from '../Components/CompactQuoteCard'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import { PaginationSystem } from '../Components/PaginationSystem'

const expandAnimation = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const collapseAnimation = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
`
const quotes: Quote[] = [
  {
    id: 1,
    quote: 'To be, or not to be, that is the question:\n Whether \'tis nobler in the mind to suffer\n the slings and arrows of outrageous fortune,\n or to take arms against a sea of troubles,\n and by opposing end them? To die—to sleep, no more;',
    author: {
      id: 1,
      fullName: 'William Shakespeare',
      wikiPage: 'https://en.wikipedia.org/wiki/William_Shakespeare',
      description: 'English playwright, poet, and actor, widely regarded as the greatest writer in the English language.',
    },
    tags: [
      { id: 1, label: 'Philosophy' },
      { id: 2, label: 'Drama' },
    ],
    upvotes: 120,
    saves: 45,
  },
  {
    id: 2,
    quote: 'The only thing we have to fear is fear itself—\na nameless, unreasoning, unjustified terror\n which paralyzes needed efforts to convert retreat into advance.\n In every dark hour of our national life,\n leadership has met with that refusal to panic,\n and with courage, we shall endure.',
    author: {
      id: 2,
      fullName: 'Franklin D. Roosevelt',
      wikiPage: 'https://en.wikipedia.org/wiki/Franklin_D._Roosevelt',
      description: '32nd president of the United States, serving from 1933 until 1945.',
    },
    tags: [
      { id: 3, label: 'Motivation' },
      { id: 4, label: 'Politics' },
    ],
    upvotes: 90,
    saves: 30,
  },
  {
    id: 3,
    quote: 'In the middle of difficulty lies opportunity. Great spirits have always encountered violent opposition from mediocre minds. Weakness of attitude becomes weakness of character. A person who never made a mistake never tried anything new.',
    author: {
      id: 3,
      fullName: 'Albert Einstein',
      wikiPage: 'https://en.wikipedia.org/wiki/Albert_Einstein',
      description: 'Theoretical physicist who developed the theory of relativity.',
    },
    tags: [
      { id: 5, label: 'Inspiration' },
      { id: 6, label: 'Science' },
    ],
    upvotes: 200,
    saves: 75,
  },
  {
    id: 4,
    quote: 'Happiness depends upon ourselves. It is not something ready-made. It comes from your own actions. We are what we repeatedly do. Excellence, then, is not an act, but a habit. The secret of happiness is freedom, and the secret of freedom is courage.',
    author: {
      id: 4,
      fullName: 'Aristotle',
      wikiPage: 'https://en.wikipedia.org/wiki/Aristotle',
      description: 'Ancient Greek philosopher and polymath during the Classical period in Greece.',
    },
    tags: [
      { id: 1, label: 'Philosophy' },
      { id: 7, label: 'Happiness' },
    ],
    upvotes: 140,
    saves: 60,
  },
  {
    id: 5,
    quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall. Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. Life is what happens when you\'re busy making other plans.',
    author: {
      id: 5,
      fullName: 'Nelson Mandela',
      wikiPage: 'https://en.wikipedia.org/wiki/Nelson_Mandela',
      description: 'South African anti-apartheid revolutionary, political leader, and philanthropist.',
    },
    tags: [
      { id: 8, label: 'Perseverance' },
      { id: 9, label: 'Leadership' },
    ],
    upvotes: 180,
    saves: 90,
  },
]

function Explore() {
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number | null>(null)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalPages = Math.ceil(quotes.length / itemsPerPage)

  const handleCardClick = (index: number) => {
    setSelectedQuoteIndex(index)
    setIsAnimatingOut(false)
  }

  const closeExpandedView = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setSelectedQuoteIndex(null)
      setIsAnimatingOut(false)
    }, 300)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '200px', padding: 2 }}>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '90%' }}>
        {quotes.map((quote, index) => (
          <CompactCard
            key={index}
            index={index}
            quote={quote}
            onClick={handleCardClick}
          />
        ))}
      </Box>

      {selectedQuoteIndex !== null && (
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
            animation: `${isAnimatingOut ? collapseAnimation : expandAnimation} 0.3s ease-out`,
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
            quote={quotes[selectedQuoteIndex]}
          />
        </Box>
      )}

      <PaginationSystem
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Box>
  )
}

export default Explore

import type { Quote, SearchResult } from '../types/httpResponseTypes'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  keyframes,
  Typography,
} from '@mui/material'
import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompactCard } from '../Components/CompactQuoteCard'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import { useNotification } from '../Components/NotificationProvider'
import { PaginationSystem } from '../Components/PaginationSystem'
import { useAppSelector } from '../Datastore/hooks'
import { useSearchBar } from '../Components/SearchBar'

const expandAnimation = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const collapseAnimation = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
`

interface ExploreContextType {
  updateQuote: (_: Quote) => void
}

const ExploreContext = createContext<ExploreContextType>({
  updateQuote: (_: Quote) => console.error('ExplorePage not setup'),
})

export const useExplore = () => useContext(ExploreContext)

function Explore() {
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number | null>(null)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState<SearchResult | null>(null)
  const { handleHttpError, addNotification } = useNotification()
  const topics = useAppSelector(state => state.search.topics)
  const {addTopic} = useSearchBar()
  const token = useAppSelector(state => state.auth.token)

  const handleCardClick = (index: number) => {
    setSelectedQuoteIndex(index)
    setIsAnimatingOut(false)
  }

  useEffect(() => {
    const tags = searchParams.get('tags')?.split(',')
    const author = searchParams.get('author')
    const keyword = searchParams.get('keyword')

    if (!tags && !author && !keyword) {
      return
    }
    tags?.forEach(t =>  {addTopic(Number(t), 'tag')})
    addTopic(Number(author), 'author')

    const auth = { headers: { Authorization: `Bearer ${token}` } }
    axios.get(
      `/api/search/${token ? 'auth/' : ''}quotes/?${
        tags?.map(tag => `tags[]=${tag}`).join('&')
      }${author ? `&author=${author}` : ''}${keyword ? `&keyword=${keyword}` : ''}`,
      auth,
    )
      .then(res => res.data as SearchResult)
      .then(res => {
        setSearch(res)
      })
      .catch((e) => {
        handleHttpError(e)
        setSearch(null)
      })
  }, [searchParams])

  const updateQuote = (quote: Quote) => {
    setSearch(search ? { ...search, data: search.data.map(q => q.id === quote.id ? quote : q) } : null)
  }

  const changePage = (page: number) => {
    const i = search?.links.find(link => Number(link.label) === page)
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    if (i && i.url) {
      axios.get(
        i.url,
        auth,
      )
        .then(res => res.data as SearchResult)
        .then(res => setSearch(res))
        .catch((e) => {
          handleHttpError(e)
          setSearch(null)
        })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    else {
      addNotification({ label: `Cannot go to page ${page}`, alert: 'error' })
    }
  }

  const closeExpandedView = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setSelectedQuoteIndex(null)
      setIsAnimatingOut(false)
    }, 300)
  }
  if (!search?.data.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '200px', padding: 2 }}>
        <Typography>Please Enter a Search Query</Typography>
      </Box>
    )
  }

  return (
    <ExploreContext.Provider value={{ updateQuote }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '200px', padding: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '90%' }}>
          {search?.data.map((quote, index) => (
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
              quote={search.data[selectedQuoteIndex]}
            />
          </Box>
        )}

        <PaginationSystem
          currentPage={search.current_page}
          totalPages={Math.ceil(search.total / search.per_page)}
          onPageChange={changePage}
        />
      </Box>
    </ExploreContext.Provider>
  )
}

export default Explore

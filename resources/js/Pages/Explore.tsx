import type { Quote, SearchResult } from '../types/httpResponseTypes'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Box,
  keyframes,
  Typography,
} from '@mui/material'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompactCard } from '../Components/CompactQuoteCard'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import { useHeader } from '../Components/Header'
import { useNotification } from '../Components/NotificationProvider'
import { PaginationSystem } from '../Components/PaginationSystem'
import { useSearchBar } from '../Components/SearchBar'
import { useAppDispatch, useAppSelector } from '../Datastore/hooks'
import { searchQuotes, searchQuotesUrl, setSearchResult } from '../Datastore/searchSlice'

const expandAnimation = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const collapseAnimation = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
`

interface ExploreContextType {
  onExplorePage: boolean
  updateQuote: (_: Quote) => void
}

const ExploreContext = createContext<ExploreContextType>({
  onExplorePage: false,
  updateQuote: (_: Quote) => console.error('ExplorePage not setup'),
})

export const useExplore = () => useContext(ExploreContext)

function Explore() {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [searchParams] = useSearchParams()
  const search = useAppSelector(state => state.search.lastSearchResult)
  const { handleHttpError, addNotification } = useNotification()
  const { addTopic, selectedQuoteIndex, setSelectedQuoteIndex } = useSearchBar()
  const token = useAppSelector(state => state.auth.token)
  const dispatch = useAppDispatch()
  const { headerRef } = useHeader()
  const [onExplorePage] = useState(true)

  const handleCardClick = (index: number | null) => {
    setSelectedQuoteIndex(index)
    setIsAnimatingOut(false)
  }

  const setSearch = (result: SearchResult | null) => {
    dispatch(setSearchResult(result))
  }

  useEffect(() => {
    setSelectedQuoteIndex(null)

    const tags = searchParams.get('tags')?.split(',')
    const topics: [number, string][] = tags?.map(t => [Number(t), 'tag']) ?? []
    const author = searchParams.get('author')
    const keyword = searchParams.get('keyword')

    if (author)
      topics.push([Number(author), 'author'])

    addTopic(topics, true)

    if (!topics.length && !keyword) {
      setSearch(null)
      return
    }

    dispatch(searchQuotes(tags, author, keyword, token))
      .catch((e) => {
        handleHttpError(e)
      })
  }, [searchParams])

  const updateQuote = (quote: Quote) => {
    setSearch(search ? { ...search, data: search.data.map(q => q.id === quote.id ? quote : q) } : null)
  }

  const changePage = (page: number) => {
    const i = search?.links.find(link => Number(link.label) === page)
    if (i && i.url) {
      dispatch(searchQuotesUrl(i.url, token))
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2, paddingTop: `${(headerRef?.current?.clientHeight ?? 0) + 20}px` }}>
        <Typography>Please Enter a Search Query</Typography>
      </Box>
    )
  }

  return (
    <ExploreContext.Provider value={{ onExplorePage, updateQuote }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, paddingTop: `${(headerRef?.current?.clientHeight ?? 0) + 20}px` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '75%', animation: 'bounce 0.4s ease-in, fadeIn 0.3s ease-in' }}>
          {search?.data.map((quote, index) => (
            <CompactCard
              key={index}
              index={index}
              quote={quote}
              onClick={handleCardClick}
              updateQuote={updateQuote}
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
              updateQuote={updateQuote}
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

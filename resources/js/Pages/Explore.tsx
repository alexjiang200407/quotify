import type { Quote, SearchResult } from '../types/httpResponseTypes'
import { Box, Typography } from '@mui/material'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CompactCard } from '../Components/CompactQuoteCard'
import { ExpandedQuoteModal } from '../Components/ExpandedQuoteModal'
import { useHeader } from '../Components/Header'
import { useNotification } from '../Components/NotificationProvider'
import { PaginationSystem } from '../Components/PaginationSystem'
import { useSearchBar } from '../Components/SearchBar'
import { useAppDispatch, useAppSelector } from '../Datastore/hooks'
import { searchQuotes, searchQuotesUrl, setSearchResult } from '../Datastore/searchSlice'
import { isMobileDevice } from '../ResponsiveUIProvider'

interface ExploreContextType {
  onExplorePage: boolean
  updateQuote: (_: Quote) => void
}

const ExploreContext = createContext<ExploreContextType>({
  onExplorePage: false,
  updateQuote: (_: Quote) => console.error('ExplorePage not setup'),
})

export const useExplore = () => useContext(ExploreContext)

export const Explore = () => {
  const [searchParams] = useSearchParams()
  const search = useAppSelector(state => state.search.lastSearchResult)
  const { handleHttpError, addNotification } = useNotification()
  const { addTopic, selectedQuoteIndex, setSelectedQuoteIndex, setInputValue, inputValue } = useSearchBar()
  const token = useAppSelector(state => state.auth.token)
  const dispatch = useAppDispatch()
  const { headerHeight } = useHeader()
  const [onExplorePage] = useState(true)
  const isMobile = isMobileDevice()

  const handleCardClick = (index: number | null) => {
    setSelectedQuoteIndex(index)
  }

  const setSearch = (res: SearchResult | null) => {
    dispatch(setSearchResult({ res }))
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
    if (keyword)
      setInputValue(keyword)

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

  if (!search?.data.length) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 2, paddingTop: `${headerHeight}px` }}>
        <Typography>Please Enter a Search Query</Typography>
      </Box>
    )
  }

  return (
    <ExploreContext.Provider value={{ onExplorePage, updateQuote }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, paddingTop: `${headerHeight}px` }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: isMobile ? '90%' : '75%', animation: 'bounce 0.4s ease-in, fadeIn 0.3s ease-in' }}>
          {search?.data.map((quote, index) => (
            <CompactCard
              key={index}
              index={index}
              quote={quote}
              onClick={handleCardClick}
              updateQuote={updateQuote}
              keyword={inputValue === '' ? undefined : inputValue}
            />
          ))}
        </Box>

        {selectedQuoteIndex !== null && (
          <ExpandedQuoteModal
            quote={search.data[selectedQuoteIndex]}
            updateQuote={updateQuote}
            onClose={() => setSelectedQuoteIndex(null)}
          />
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

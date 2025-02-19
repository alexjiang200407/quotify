import type { Quote, SearchResult } from '../types/httpResponseTypes'
import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CompactCard } from '../Components/CompactQuoteCard'
import { ExpandedQuoteModal } from '../Components/ExpandedQuoteModal'
import { useHeader } from '../Components/Header'
import { useNotification } from '../Components/NotificationProvider'
import { PaginationSystem } from '../Components/PaginationSystem'
import { makeAuthHeader } from '../Datastore/authSlice'
import { useAppSelector } from '../Datastore/hooks'

const Profile = () => {
  const user = useAppSelector(state => state.auth.user)
  const { headerHeight } = useHeader()

  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<null | number>(null)
  const token = useAppSelector(state => state.auth.token)
  const [saved, setUserSaved] = useState<SearchResult | null>(null)
  const { handleHttpError, addNotification } = useNotification()

  useEffect(() => {
    if (!token) {
      setUserSaved(null)
      return
    }

    axios.get('/api/user/saved', makeAuthHeader(token))
      .then(res => setUserSaved(res.data))
      .catch(e => handleHttpError(e))
  }, [token])

  const updateQuote = (quote: Quote) => {
    setUserSaved(saved ? { ...saved, data: saved.data.map(q => q.id === quote.id ? quote : q) } : null)
  }

  const changePage = (page: number) => {
    if (!token)
      return

    const i = saved?.links.find(link => Number(link.label) === page)
    if (i && i.url) {
      axios.get(i.url, makeAuthHeader(token))
        .then(res => setUserSaved(res.data))
        .catch((e) => {
          handleHttpError(e)
        })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    else {
      addNotification({ label: `Cannot go to page ${page}`, alert: 'error' })
    }
  }

  if (!saved || !user) {
    return (
      <Box sx={{ paddingTop: `${(headerHeight ?? 0) + 20}px`, textAlign: 'center' }}>
        <Typography>Please Login</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{
      paddingBottom: 2,
    }}
    >
      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          boxShadow: 3,
          paddingTop: `${(headerHeight ?? 0) + 20}px`,
          bgcolor: 'background.default',
          animation: 'fadeIn 0.3s ease-in',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h5">
            Welcome
            { user.name }
          </Typography>
          <Typography color="text.secondary">{ user.email }</Typography>
        </Stack>
      </Card>
      <Divider sx={{ margin: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '75%', animation: 'bounce 0.4s ease-in, fadeIn 0.3s ease-in' }}>
          {saved?.data.map((quote, index) => (
            <CompactCard
              key={index}
              index={index}
              quote={quote}
              onClick={() => setSelectedQuoteIndex(index)}
              updateQuote={updateQuote}
            />
          ))}
        </Box>
        {selectedQuoteIndex !== null && (
          <ExpandedQuoteModal
            quote={saved.data[selectedQuoteIndex]}
            updateQuote={updateQuote}
            onClose={() => { setSelectedQuoteIndex(null) }}
          />
        )}
        <PaginationSystem
          currentPage={saved.current_page}
          totalPages={Math.ceil(saved.total / saved.per_page)}
          onPageChange={changePage}
        />
      </Box>
    </Box>
  )
}

export default Profile

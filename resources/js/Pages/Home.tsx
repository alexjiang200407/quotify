import type { Quote } from '../types/httpResponseTypes'
import { Box } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import { useNotification } from '../Components/NotificationProvider'
import { useAppSelector } from '../Datastore/hooks'

export const Home = () => {
  const { handleHttpError } = useNotification()
  const [quote, setQuote] = useState<Quote | null>(null)
  const token = useAppSelector(state => state.auth.token)

  useState(() => {
    let req
    if (token) {
      const auth = { headers: { Authorization: `Bearer ${token}` } }
      req = axios.get(`/api/quotes/auth/daily`, auth)
    }
    else {
      req = axios.get(`/api/quotes/daily`)
    }

    req.then(res => setQuote(res.data))
      .catch(e => handleHttpError(e))
  })

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
      {/* Add a container with 800px width */}
      {quote && (
        <ExpandedQuoteCard quote={quote} updateQuote={setQuote} />
      )}
    </Box>
  )
}

export default Home

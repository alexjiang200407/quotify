import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ExpandedQuoteCard } from '../Components/ExpandedQuoteCard'
import axios from 'axios'
import { useNotification } from '../Components/NotificationProvider'
import { Quote } from '../types/httpResponseTypes'
import { useAppSelector } from '../Datastore/hooks'

function Home() {
  const {handleHttpError} = useNotification()
  const [quote, setQuote] = useState<Quote|null>(null);
  const token = useAppSelector(state => state.auth.token)
  useState(() => {
    let req;
    if (token) {
      const auth = { headers: { Authorization: `Bearer ${token}` } }
      req = axios.get(`/api/quotes/auth/daily`, auth)
    } else {
      req = axios.get(`/api/quotes/daily`)
    }

    req.then(res => setQuote(res.data))
    .catch(e => handleHttpError(e))
  });

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
      <Box sx={{ width: 800 }}>
        <Typography variant="h3" sx={{ textAlign: 'center', zIndex: 2 }}>
          Quote of the Day
        </Typography>

        {quote && (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <ExpandedQuoteCard quote={quote} updateQuote = {setQuote} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Home
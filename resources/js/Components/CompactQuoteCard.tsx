import type { Quote } from '../types/httpResponseTypes'
import {
  faBookmark as regularBookmark,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBookmark as solidBookmark,
  faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { useQuoteActions } from '../Actions/QuoteActions'
import { IconButton } from './IconButton'
import TagComponent from './Tag'

interface CompactCardProps {
  quote: Quote
  index: number
  onClick: (index: number) => void
  updateQuote: (q: Quote) => void
  keyword?: string
}

export const CompactCard: React.FC<CompactCardProps> = ({ quote, index, onClick, updateQuote, keyword }) => {
  const { onLike, onSave } = useQuoteActions(quote, updateQuote)
  const quoteRef = useRef<HTMLElement | null>(null)
  const authorRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!keyword)
      return
    const regEx = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')

    if (quoteRef.current)
      quoteRef.current.innerHTML = quoteRef.current.textContent?.replaceAll(regEx, s => `<span class='search-keyword'>${s}</span>`) ?? quoteRef.current.innerHTML
    if (authorRef.current)
      authorRef.current.innerHTML = authorRef.current.textContent?.replaceAll(regEx, s => `<span class='search-keyword'>${s}</span>`) ?? authorRef.current.innerHTML
  }, [quote])

  return (
    <Card
      onClick={() => onClick(index)}
      sx={{
        'width': '100%',
        'padding': 3,
        'cursor': 'pointer',
        'transition': 'transform 0.2s',
        '&:hover': { transform: 'scale(1.01)' },
        'backgroundColor': '#f5f5f5',
        '& .search-keyword': {
          color: 'primary.main',
        },
      }}
    >
      <CardContent sx={{ 'flexGrow': 1, 'overflow': 'hidden', 'padding': 0, '&:last-child': { pb: 0 } }}>
        <Typography
          ref={quoteRef}
          variant="body1"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: '1.5',
            marginBottom: 2,
            display: 'block',
          }}
        >
          {quote.quote}
        </Typography>

        <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', marginBottom: 1.5 }} ref={authorRef}>
          {quote.author.full_name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 1.5 }}>
          {quote.tags.map((tag, tagIndex) => <TagComponent key={tagIndex} {...tag} />)}
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pointerEvents: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <IconButton
              icon={regularHeart}
              solidIcon={solidHeart}
              activeColor="red"
              defaultColor="black"
              onClick={onLike}
              startingActive={quote.user_upvoted}
            />
            <Typography variant="caption">{quote.upvotes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <IconButton
              icon={regularBookmark}
              solidIcon={solidBookmark}
              activeColor="teal"
              defaultColor="black"
              onClick={onSave}
              startingActive={quote.user_saved}
            />
            <Typography variant="caption">{quote.saves}</Typography>
          </Box>
        </Box>
      </CardContent>

    </Card>
  )
}

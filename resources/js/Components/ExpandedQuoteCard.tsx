import type { Quote } from '../types/httpResponseTypes'
import {
  faBookmark as regularBookmark,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBookmark as solidBookmark,
  faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons'
import { Box, Card, CardContent, Chip, Divider, Typography } from '@mui/material'
import React from 'react'
import { useQuoteActions } from '../Actions/QuoteActions'
import { IconButton } from './IconButton'
import TagComponent from './Tag'

interface ExpandedQuoteCardProps {
  quote: Quote
  isMobile?: boolean
}

export const ExpandedQuoteCard: React.FC<ExpandedQuoteCardProps> = ({
  quote,
  isMobile = true,
}) => {
  const { onLike, onSave } = useQuoteActions(quote)

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', width: '100%', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, alignItems: 'center' }}>
        <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" onClick={onLike} startingActive={quote.user_upvoted} />
        <Typography variant="caption">{quote.upvotes}</Typography>
        <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="blue" defaultColor="black" onClick={onSave} startingActive={quote.user_saved} />
        <Typography variant="caption">{quote.saves}</Typography>
      </Box>

      {/* Content Box */}
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>

        {/* Animated Divider */}
        <Divider className="animated-divider" />

        {/* Quote */}
        <Card sx={{ boxShadow: 'none', marginTop: 2 }}>
          <CardContent>
            {quote.quote.split('\n').map((line, index) => (
              <Typography key={index} variant="body1" paragraph>
                {line}
              </Typography>
            ))}
          </CardContent>
        </Card>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
          {quote.tags.map((tag, index) => <TagComponent key={index} {...tag} />)}
        </Box>

        {/* Author Name */}
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
          {quote.author.full_name}
        </Typography>
      </Box>
    </Box>
  )
}

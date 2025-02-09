import type { Quote } from '../types/httpResponseTypes'
import {
  faBookmark as regularBookmark,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBookmark as solidBookmark,
  faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons'
import { Box, Card, CardContent, colors, Divider, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useQuoteActions } from '../Actions/QuoteActions'
import { IconButton } from './IconButton'
import TagComponent from './Tag'
import Vara, { VaraType } from '../../vara/Vara'
import font from '../../vara/signatures/SatisfySL.json'

interface ExpandedQuoteCardProps {
  quote: Quote
  isMobile?: boolean
  updateQuote: (q: Quote) => void
}

export const ExpandedQuoteCard: React.FC<ExpandedQuoteCardProps> = ({
  quote,
  updateQuote,
  isMobile = true,
}) => {
  const { onLike, onSave } = useQuoteActions(quote, updateQuote)
  const varaRef = useRef<VaraType | null>(null);

  useEffect(() => {
    if (varaRef.current !== null) return
    varaRef.current = new Vara("#vara-container", font, [
      {
        text: quote.author.full_name, // String, text to be shown
        ...quote.author.signature,
        strokeWidth: quote.author.signature.stroke_width,
        fontSize: quote.author.signature.font_size,
        autoAnimation:true, // Boolean, Whether to animate the text automatically
        queued:true, // Boolean, Whether the animation should be in a queue
        delay:0,     // Delay before the animation starts in milliseconds
        x: 5,
        y: 5
      }],{
      })
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', width: '100%', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, alignItems: 'center' }}>
          <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" onClick={onLike} startingActive={quote.user_upvoted} size={40} />
          <Typography variant="caption" fontSize={20}>{quote.upvotes}</Typography>
          <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="blue" defaultColor="black" onClick={onSave} startingActive={quote.user_saved} size={40} />
          <Typography variant="caption" fontSize={20}>{quote.saves}</Typography>
        </Box>

        {/* Content Box */}
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>

          {/* Animated Divider */}
          <Divider className="animated-divider" />

          {/* Quote */}
          <Card sx={{ boxShadow: 'none', marginTop: 2 }}>
            <CardContent>
              {quote.quote.split('\n').map((line, index) => (
                <Typography 
                  key={index} 
                  variant="body1" 
                  fontSize={20} 
                  paragraph
                  sx={{
                    lineHeight: 2.5
                  }}
                  >
                  {line}
                </Typography>
              ))}
            </CardContent>
          </Card>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
            {quote.tags.map((tag, index) => <TagComponent key={index} {...tag} />)}
          </Box>
        </Box>
      </Box>
      <div id="vara-container"></div>
    </Box>
  )
}

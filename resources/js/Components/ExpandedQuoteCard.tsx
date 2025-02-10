import type { Quote } from '../types/httpResponseTypes'
import {
  faBookmark as regularBookmark,
  faHeart as regularHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBookmark as solidBookmark,
  faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons'
import { Box, Card, CardContent, colors, Divider, Paper, Tooltip, Typography } from '@mui/material'
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
        x: 5,
        y: 5
      }],{
        textAlign: 'center'
      }) 
  });

  return (
    <Paper sx={{backgroundColor: 'background.default'}}>
      <Box sx={{
        paddingInline: 2, paddingBlock: 4, 
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;', 
        borderRadius: 2,
        transition: 'box-shadow 0.3s ease-in-out',
        "&:hover": {
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;'
        },
        "&:hover .button-container": {
          opacity: 1,
        },
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
          {/* Content Box */}
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '40vw', textAlign: 'center', padding: 2, }}>
            <Card sx={{ boxShadow: 'none', marginTop: 2, backgroundColor: 'background.default' }}>
              <CardContent>
                {quote.quote.split('\n').map((line, index) => (
                  <Typography 
                    key={index} 
                    variant="body1" 
                    fontSize={20} 
                    sx={{lineHeight: 2.5, backgroundColor: 'background.default'}}
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
        <Tooltip title={quote.author.description} arrow>
          <Box id="vara-container" sx={{
          "&:hover": {
            opacity: 0.5,
          },
          transition: "opacity 0.2s ease-in"
        }}></Box>
        </Tooltip>
        <Box className="button-container" sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'right', opacity: 0, transition: 'opacity 0.2s ease-in' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton icon={regularHeart} solidIcon={solidHeart} activeColor="red" defaultColor="black" onClick={onLike} startingActive={quote.user_upvoted} size={30} />
            <Typography variant="caption" fontSize={15} sx={{userSelect: 'none'}}>{quote.upvotes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <IconButton icon={regularBookmark} solidIcon={solidBookmark} activeColor="teal" defaultColor="black" onClick={onSave} startingActive={quote.user_saved} size={30} />
            <Typography variant="caption" fontSize={15} sx={{userSelect: 'none'}}>{quote.saves}</Typography>
          </Box>
        </Box>
      </Box>

    </Paper>
  )
}

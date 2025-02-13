import type { VaraType } from '../../vara/Vara'
import type { Quote } from '../types/httpResponseTypes'
import { faWikipediaW, faXTwitter } from '@fortawesome/free-brands-svg-icons'

import {
  faClipboard,
  faBookmark as solidBookmark,
  faHeart as solidHeart,
} from '@fortawesome/free-solid-svg-icons'
import { Box, Card, CardContent, Link, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import Vara from '../../vara/Vara'
import { useQuoteActions } from '../Actions/QuoteActions'
import { IconButton } from './IconButton'
import { useNotification } from './NotificationProvider'
import { useSearchBar } from './SearchBar'
import TagComponent from './Tag'
import WikiPortrait from './WikiPortrait'
import { isMobileDevice } from '../ResponsiveUIProvider'

interface ExpandedQuoteCardProps {
  quote: Quote
  updateQuote: (q: Quote) => void
}

export const ExpandedQuoteCard: React.FC<ExpandedQuoteCardProps> = ({
  quote,
  updateQuote,
}) => {
  const { onLike, onSave, canLikeSave } = useQuoteActions(quote, updateQuote)
  const varaRef = useRef<VaraType | boolean>(false)
  const { addNotification } = useNotification()
  const { goToPage } = useSearchBar()

  const getFont = (type: string) => {
    return import(/* @vite-ignore */`../../vara/signatures/${type}`)
  }

  const authorSearch = () => {
    goToPage([], quote.author.id, null)
  }

  const copyToClipboard = () => {
    if (!window.isSecureContext) {
      addNotification({ label: 'Couldn\'t copy quote to clipboard', alert: 'error' })
      return
    }

    navigator.clipboard?.writeText(`${quote.quote} - ${quote.author.full_name}`)
      .then(() => addNotification({ label: 'Copied to clipboard', alert: 'success' }))
      .catch(() => addNotification({ label: 'Couldn\'t copy quote to clipboard', alert: 'error' }))
  }

  const openXPage = () => {
    const authorUrl = quote.author.full_name.replace(/ /g, '').replaceAll('.', '')
    const quoteUrl = quote.quote.replace(/ /g, '%20')
    const tagsUrl = quote.tags.map(t => `%20%23${t.label}`).join('')
    window.open(`https://twitter.com/intent/tweet?text=“${quoteUrl}”%0a%0a%23${authorUrl}%20%23quotes${tagsUrl}`, '_blank')?.focus()
  }

  useEffect(() => {
    if (varaRef.current !== false)
      return

    varaRef.current = true

    getFont(quote.author.signature.type)
      .then((font) => {
        varaRef.current = new Vara('#vara-container', font, [
          {
            text: quote.author.full_name, // String, text to be shown
            color: quote.author.signature.color,
            duration: quote.author.signature.duration * quote.author.full_name.length,
            strokeWidth: quote.author.signature.stroke_width,
            fontSize: quote.author.signature.font_size,
            letterSpacing: quote.author.signature.letter_spacing,
            autoAnimation: true, // Boolean, Whether to animate the text automatically
            queued: true, // Boolean, Whether the animation should be in a queue
            x: 5,
            y: 5,
          },
        ], {
          textAlign: 'center',
        })
      })
  })

  return (
    <Box>
      <Box sx={{
        width: isMobileDevice() ? '95vw' : '45vw',
        'paddingInline': 2,
        'paddingBlock': 4,
        'boxShadow': 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
        'borderRadius': 2,
        'transition': 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
        'animation': 'fadeIn 0.4s ease-in',
        '&:hover': {
          transform: 'translateY(-0.5rem)',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;',
        },
        '&:hover .button-container': {
          opacity: 1,
        },
        'backgroundColor': 'background.default',
      }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxHeight: '80vh' }}>
          <WikiPortrait personName={quote.author.full_name} width={100} height={100} />
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', margin: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            {/* Content Box */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                padding: 2,
                paddingTop: 0
              }}
            >
              <Card sx={{ boxShadow: 'none', backgroundColor: 'background.default' }}>
                <CardContent sx={{maxHeight: '30vh', overflow: 'auto'}}>
                  {quote.quote.split('\n').map((line, index) => (
                    <Typography
                      key={index}
                      variant="body1"
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
            <Link width="100%">
              <Box
                id="vara-container"
                sx={{
                  '&:hover': {
                    opacity: 0.5,
                    cursor: 'pointer',
                  },
                  'transition': 'opacity 0.2s ease-in',
                }}
                onClick={authorSearch}
              />
            </Link>
          </Tooltip>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: isMobileDevice() ? 'center' :  'right',
        }}
        >
          <Box
            className="button-container"
            sx={{
              display: 'inline-flex',
              flexDirection: 'row',
              gap: 1,
              borderRadius: 2,
              opacity: 0,
              color: 'white',
              transition: 'opacity 0.2s ease-in',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                tooltip={canLikeSave() ? 'Like Quote' : 'Please Login'}
                disabled={!canLikeSave()}
                icon={solidHeart}
                solidIcon={solidHeart}
                activeColor="red"
                defaultColor="white"
                onClick={onLike}
                startingActive={quote.user_upvoted}
                size={30}
              />
              <Typography variant="caption" sx={{ userSelect: 'none' }}>{quote.upvotes}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <IconButton
                tooltip={canLikeSave() ? 'Save Quote' : 'Please Login'}
                disabled={!canLikeSave()}
                icon={solidBookmark}
                solidIcon={solidBookmark}
                activeColor="teal"
                defaultColor="white"
                onClick={onSave}
                startingActive={quote.user_saved}
                size={30}
              />
              <Typography variant="caption" sx={{ userSelect: 'none' }}>{quote.saves}</Typography>
            </Box>
            <IconButton
              tooltip={quote.author.wiki_page !== '' ? 'Open Wikipedia Page' : 'No Wikipedia Page'}
              disabled={quote.author.wiki_page === ''}
              toggle={false}
              icon={faWikipediaW}
              solidIcon={faWikipediaW}
              defaultColor="white"
              size={30}
              onClick={() => window.open(quote.author.wiki_page, '_blank')?.focus()}
            />
            <IconButton
              tooltip="Copy Quote to Clipboard"
              toggle={false}
              icon={faClipboard}
              solidIcon={faClipboard}
              defaultColor="white"
              size={30}
              onClick={copyToClipboard}
            />
            <IconButton
              tooltip="Post to X"
              toggle={false}
              icon={faXTwitter}
              solidIcon={faXTwitter}
              defaultColor="white"
              size={30}
              onClick={openXPage}
            />
          </Box>
        </Box>
      </Box>

    </Box>
  )
}

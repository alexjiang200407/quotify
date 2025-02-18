import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface WikipediaResponse {
  query: {
    pages: {
      [key: string]: {
        title?: string
        thumbnail?: {
          source: string
          width: number
          height: number
        }
        pageimage?: string
      }
    }
  }
}

interface WikiPortraitProps {
  personName: string
  width?: number|string
  height?: number|string
}

export const WikiPortrait = ({ personName, width = 200, height = 200 }: WikiPortraitProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  
  const remToPx = (rem: string) => {
    return parseFloat(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  useEffect(() => {
    const widthPx = typeof width == 'string'? remToPx(width) : width + 'px';
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&titles=${encodeURIComponent(
            personName,
          )}&pithumbsize=500&piprop=thumbnail`,
        )

        if (!response.ok)
          throw new Error('Network response was not ok')

        const data: WikipediaResponse = await response.json()
        const page = Object.values(data.query.pages)[0]

        if (!page.thumbnail) {
          throw new Error('No portrait found for this person')
        }

        // Resize the image URL while maintaining aspect ratio
        const resizedUrl = page.thumbnail.source
          .replace(/\/\d+px-/, `/${widthPx}px-`)

        setImageUrl(resizedUrl)
      }
      catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch image')
      }
    }

    fetchImage()
  }, [personName, width, height])

  return (
    <Box sx={{
      width,
      height,
      overflow: 'visible',
    }}
    >
      <Box
        src={!imageUrl || error ? undefined : imageUrl}
        component="img"
        sx={{
          opacity: !imageUrl || error ? 0 : 1,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
          transition: 'opacity 0.3s ease-in, box-shadow 0.3s ease-in',
          borderRadius: '50%',
        }}
      />
    </Box>
  )
}

export default WikiPortrait

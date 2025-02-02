import type { KeyboardEvent } from 'react'
import {
  faChevronLeft,
  faChevronRight,
  faCircleLeft,
  faCircleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Pagination, PaginationItem, TextField } from '@mui/material'
import React, { useState } from 'react'

interface PaginationSystemProps {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export const PaginationSystem: React.FC<PaginationSystemProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [pageInput, setPageInput] = useState('')

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newPage = Math.min(Math.max(1, Number.parseInt(pageInput)), totalPages)
      if (!Number.isNaN(newPage)) {
        onPageChange(newPage)
        setPageInput('')
      }
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 4 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        siblingCount={2}
        boundaryCount={1}
        shape="rounded"
        sx={{
          '& .Mui-selected': {
            'bgcolor': 'primary.main',
            'color': 'white',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        }}
        renderItem={item => (
          <PaginationItem
            slots={{
              previous: () => <FontAwesomeIcon icon={faChevronLeft} />,
              next: () => <FontAwesomeIcon icon={faChevronRight} />,
              first: () => <FontAwesomeIcon icon={faCircleLeft} />,
              last: () => <FontAwesomeIcon icon={faCircleRight} />,
            }}
            {...item}
          />
        )}
      />

      <TextField
        label="Go to page"
        value={pageInput}
        onChange={e => setPageInput(e.target.value.replace(/\D/, ''))}
        onKeyPress={handleKeyPress}
        type="number"
        size="small"
        sx={{ width: 120 }}
        inputProps={{
          min: 1,
          max: totalPages,
          style: { textAlign: 'center' },
        }}
      />
    </Box>
  )
}

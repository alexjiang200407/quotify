import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton as MuiIconButton } from '@mui/material'
// IconButton.tsx
import React, { useEffect, useState } from 'react'

interface IconButtonProps {
  icon: IconProp
  solidIcon: IconProp
  activeColor?: string
  defaultColor?: string
  startingActive?: boolean
  size?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, active: boolean) => void
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  solidIcon,
  activeColor = 'red',
  defaultColor = 'black',
  size = 24,
  startingActive = false,
  onClick,
}) => {
  const [isActive, setIsActive] = useState(startingActive)

  useEffect(() => {
    setIsActive(startingActive)
  }, [startingActive])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsActive(prev => !prev)
    onClick?.(e, isActive)
  }

  return (
    <MuiIconButton
      sx={{
        'backgroundColor': 'transparent',
        '&:hover': { backgroundColor: 'transparent' },
        '&:active': { backgroundColor: 'transparent' },
        '&:focus': { backgroundColor: 'transparent' },
      }}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={isActive ? solidIcon : icon}
        style={{ color: isActive ? activeColor : defaultColor, fontSize: size}}
        className={`${isActive ? 'icon-pulse' : ''} icon-inactive`}
      />
    </MuiIconButton>
  )
}

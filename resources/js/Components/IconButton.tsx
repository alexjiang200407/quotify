import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton as MuiIconButton, Tooltip } from '@mui/material'
// IconButton.tsx
import React, { useEffect, useState } from 'react'

interface IconButtonProps {
  icon: IconProp
  solidIcon: IconProp
  activeColor?: string
  defaultColor?: string
  startingActive?: boolean
  size?: number
  toggle?: boolean
  disabled?: boolean
  tooltip?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, active: boolean) => void
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  solidIcon,
  activeColor = 'red',
  defaultColor = 'black',
  size = 24,
  startingActive = false,
  toggle = true,
  disabled = false,
  onClick,
  tooltip = '',
}) => {
  const [isActive, setIsActive] = useState(startingActive)

  useEffect(() => {
    setIsActive(startingActive)
  }, [startingActive])

  useEffect(() => {}, [disabled])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsActive(prev => !prev)
    onClick?.(e, isActive)
  }

  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <MuiIconButton
          disabled={disabled}
          sx={{
            'backgroundColor': 'transparent',
            '&:hover': { backgroundColor: 'transparent', opacity: '0.5' },
            '&:active': { backgroundColor: 'transparent' },
            '&:focus': { backgroundColor: 'transparent' },
            'opacity': disabled ? 0.3 : 1,
            transition: 'opacity 0.2s ease-in'
          }}
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={isActive && toggle ? solidIcon : icon}
            style={{ color: isActive && toggle ? activeColor : defaultColor, fontSize: size }}
            className={`${isActive ? 'icon-pulse' : ''} icon-inactive`}
          />
        </MuiIconButton>
      </span>
    </Tooltip>
  )
}

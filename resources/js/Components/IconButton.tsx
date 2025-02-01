// IconButton.tsx
import React, { useState } from 'react';
import { IconButton as MuiIconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IconButtonProps {
    icon: IconProp;
    solidIcon: IconProp;
    activeColor?: string;
    defaultColor?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    solidIcon,
    activeColor = 'red',
    defaultColor = 'black',
    onClick
}) => {
    const [isActive, setIsActive] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsActive((prev) => !prev);
        onClick?.(e);
    }

    return (
        <MuiIconButton
            sx={{
                backgroundColor: 'transparent',
                '&:hover': { backgroundColor: 'transparent' },
                '&:active': { backgroundColor: 'transparent' },
                '&:focus': { backgroundColor: 'transparent' },
            }}
            onClick={handleClick}
        >
            <FontAwesomeIcon
                icon={isActive ? solidIcon : icon}
                style={{ color: isActive ? activeColor : defaultColor }}
                className={`${isActive ? 'icon-pulse' : ''} icon-inactive`}
            />
        </MuiIconButton>
    );
};
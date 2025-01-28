import React, { useState } from 'react';
import { IconButton as MuiIconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IconButtonProps {
    icon: IconProp;
    solidIcon: IconProp;
    activeColor?: string;
    defaultColor?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    solidIcon,
    activeColor = 'red',
    defaultColor = 'black',
}) => {
    const [isActive, setIsActive] = useState(false);


    const handleClick = () => {
        setIsActive((prev) => !prev);
    }

    return <MuiIconButton
        sx={{
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: 'transparent',
            },
            '&:active': {
                backgroundColor: 'transparent',
            },
            '&:focus': {
                backgroundColor: 'transparent',
            },

        }}

        onClick={handleClick}

    >
        <FontAwesomeIcon
            icon={isActive ? solidIcon : icon}
            style={{
                color: isActive ? activeColor : defaultColor, // Apply active color
            }}
            className={`${isActive ? 'icon-pulse' : ''} icon-inactive`} // Add the pulse effect class
        />
    </MuiIconButton>;
};
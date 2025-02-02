import { Alert, AlertColor, AlertPropsColorOverrides, Snackbar, SnackbarCloseReason } from '@mui/material'
import React from 'react'
import { OverridableStringUnion } from '@mui/types';

export interface NotificationProps {
  label: string;
  duration?: number;
  alert?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>;
};

function Notification({ label, duration = 3000, alert = 'info' }: NotificationProps) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      message={label}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={alert}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {label}
      </Alert>
    </Snackbar>
  )
}

export default Notification

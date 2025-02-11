import { Box, Button, Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { useHeader } from '../Components/Header'
import { useAppSelector } from '../Datastore/hooks'

const Profile = () => {
  const user = useAppSelector(state => state.auth.user)
  const { headerRef } = useHeader()

  if (!user) {
    return (
      <Box sx={{ paddingTop: `${(headerRef?.current?.clientHeight ?? 0) + 20}px`, textAlign: 'center' }}>
        <Typography>Please Login</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          boxShadow: 3,
          paddingTop: `${(headerRef?.current?.clientHeight ?? 0) + 20}px`,
          bgcolor: 'background.default',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Typography variant="h5">{ user.name }</Typography>
          <Typography color="text.secondary">{ user.email }</Typography>
          <Button variant="contained" color="primary">Edit Profile</Button>
        </Stack>
      </Card>
    </Box>
  )
}

export default Profile

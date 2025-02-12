import type { NotificationProps } from './Notification'
import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { logout } from '../Datastore/authSlice'
import { useAppDispatch } from '../Datastore/hooks'
import Notification from './Notification'

interface NotificationContextType {
  addNotification: (notificationProps: NotificationProps) => void
  handleHttpError: (err: Error, logoutIfUnauthorized?: boolean) => void
}

interface NotificationProviderProps {
  children: React.ReactNode // This would allow multiple elements and strings, etc.
}

const NotificationContext = createContext<NotificationContextType>({
  addNotification: (_: NotificationProps) => console.error('NotificationProvider not setup'),
  handleHttpError: (_: Error) => console.error('NotificationProvider not setup'),
})

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<React.JSX.Element[]>([])
  const dispatch = useAppDispatch()

  const addNotification = (notificationProps: NotificationProps) => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      <Notification key={prevNotifications.length} {...notificationProps} />,
    ])
  }

  const handleHttpError = (err: Error, logoutIfUnauthorized: boolean = true) => {
    if (axios.isAxiosError(err) && err.status !== 500 && err.response) {
      if (err.status === 401) {
        addNotification({ label: err.response.data.error ?? 'Please login to access this feature', alert: 'error' })
        if (logoutIfUnauthorized)
          dispatch(logout())
        return
      }
      addNotification({ label: err.response.data.error, alert: 'error' })
      return
    }
    addNotification({ label: err.message, alert: 'error' })
  }

  return (
    <NotificationContext.Provider value={{ addNotification, handleHttpError }}>
      {children}
      <div id="notification-box">{ notifications }</div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider

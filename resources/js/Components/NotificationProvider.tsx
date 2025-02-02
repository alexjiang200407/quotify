import React, { createContext, useContext, useState } from "react";
import Notification, { NotificationProps } from "./Notification";
import axios from "axios";

interface NotificationContextType {
  addNotification: (notificationProps: NotificationProps) => void;
  handleHttpError: (err: Error) => void;
}

interface NotificationProviderProps {
  children: React.ReactNode; // This would allow multiple elements and strings, etc.
}

const NotificationContext = createContext<NotificationContextType>({
  addNotification: (_: NotificationProps) => console.error("NotificationProvider not setup"),
  handleHttpError: (_: Error) => console.error("NotificationProvider not setup")
});

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notifications, setNotifications] = useState<React.JSX.Element[]>([]);
  
    const addNotification = (notificationProps: NotificationProps) => {
      setNotifications(prevNotifications => [
        ...prevNotifications,
        <Notification key={prevNotifications.length} {...notificationProps} />
      ]);
    };
  
    const handleHttpError = (err: Error) => {
      if (axios.isAxiosError(err) && err.status != 500 && err.response) {
        addNotification({label: err.response.data.error, alert: 'error'});
        return;
      }
      addNotification({label: err.message, alert: 'error'});
    };

    return (
      <NotificationContext.Provider value={{ addNotification, handleHttpError }}>
        {children}
        <div id="notification-box">{ notifications }</div>
      </NotificationContext.Provider>
    );
  };



export default NotificationProvider
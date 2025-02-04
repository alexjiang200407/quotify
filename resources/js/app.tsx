import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './Datastore/store'
import App from './Router'
import '../css/app.css'
import NotificationProvider from './Components/NotificationProvider'

const app = document.getElementById('app')

if (app !== null) {
  const root = ReactDOM.createRoot(app)
  root.render(
    <React.StrictMode>
        <Provider store={store}>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </Provider>
    </React.StrictMode>,
  )
}

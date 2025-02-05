import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import NotificationProvider from './Components/NotificationProvider'
import { initSearchSlice } from './Datastore/searchSlice'
import store from './Datastore/store'
import App from './Router'
import '../css/app.css'

async function initializeApp() {
  const app = document.getElementById('app')
  if (app !== null) {
    const root = ReactDOM.createRoot(app)

    await store.dispatch(initSearchSlice()) // Wait for the store to initialize

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
}

initializeApp()

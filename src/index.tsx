import { DynamicContextProvider } from '@dynamic-labs/sdk-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/main.scss'
import App from './components/App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{ environmentId: 'b8318da7-07b5-47f9-9b40-ed48bc59d430' }}
    >
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

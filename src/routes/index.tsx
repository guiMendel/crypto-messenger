import { Navigate, createBrowserRouter } from 'react-router-dom'
import Login from '../views/Login'
import Chats from '../views/Chats'

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <Navigate to="/" />,
    element: <Chats />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

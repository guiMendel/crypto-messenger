import { Navigate, createBrowserRouter } from 'react-router-dom'
import RequireLogin from '../components/RequireLogin'
import Chats from '../views/Chats'
import Login from '../views/Login'

export const router = createBrowserRouter([
  // Authenticated routes
  {
    path: '/',
    element: (
      <RequireLogin authenticationState="authenticated" redirectTo="/login" />
    ),
    children: [
      {
        path: '',
        element: <Chats />,
      },
    ],
  },

  // Unauthenticated routes
  {
    path: '/login',
    element: (
      <RequireLogin authenticationState="not authenticated" redirectTo="/" />
    ),
    children: [
      {
        path: '',
        element: <Login />,
      },
    ],
  },

  // Unrecognized routes
  {
    path: '*',
    element: <Navigate to="/" />,
  },
])

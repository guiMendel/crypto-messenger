import { Navigate, createBrowserRouter } from 'react-router-dom'
import NewChat from '../components/NewChat'
import RequireLogin from '../components/RequireLogin'
import SearchChats from '../components/SearchChats'
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
        children: [
          { path: '', element: <SearchChats /> },
          { path: 'new', element: <NewChat /> },
        ],
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

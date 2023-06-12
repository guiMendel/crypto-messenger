import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { Navigate, Outlet } from 'react-router-dom'

export default function RequireLogin({
  authenticationState = 'authenticated',
  redirectTo,
}: {
  authenticationState: 'authenticated' | 'not authenticated'
  redirectTo: string
}) {
  const { user } = useDynamicContext()

  return (user == null && authenticationState == 'authenticated') ||
    (user != null && authenticationState == 'not authenticated') ? (
    <Navigate to={redirectTo} />
  ) : (
    <Outlet />
  )
}

import { Navigate } from "react-router"

interface PrivateRouteProps {
    isAuthenticated: boolean
    children: React.ReactNode
}

export const PrivateRoute = ({children, isAuthenticated}: PrivateRouteProps) => {
  return (
    isAuthenticated ? children : <Navigate to="/auth" />
  )
}

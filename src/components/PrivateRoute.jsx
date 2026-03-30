import swal from 'sweetalert'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export const PrivateRoute = ({ children, isAlowed }) => {
  const { user: authUser } = useAuth()
  // Verificamos tanto el contexto como el storage para persistencia al refrescar
  const user = authUser || JSON.parse(window.sessionStorage.getItem('user'))

  if (!user) {
    return <Navigate to='/' />
  }

  if (!isAlowed) {
    // Si no tiene permisos, lo mandamos al login para evitar el bucle en la misma ruta
    return <Navigate to='/' />
  }

  return children
}

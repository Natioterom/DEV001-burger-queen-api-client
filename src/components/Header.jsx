import React from 'react'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'
import { Orders } from './Orders'

export const Header = () => {
  const { logOut, user: authUser } = useAuth()
  const navigate = useNavigate()
  const user = authUser || JSON.parse(window.sessionStorage.getItem('user'))

  const sessionOut = () => {
    window.sessionStorage.removeItem('user')
    logOut()
    navigate('/')
  }

  const isWaiter = user?.user?.roles?.waiter

  return (
    <header className='header-container'>
      <div className='title-logo'>
        <img className='img-logo' src='images/logo.png' />
        <h1>BURGER QUEEN</h1>
      </div>

      <div className='header-actions'>
        {isWaiter && (
          <div className='bell-container' onClick={() => navigate('/mesero/orders')}>
            <span className='bell-icon'>🔔</span>
            <Orders />
          </div>
        )}

        {user && (
          <button onClick={sessionOut} className='btn-logout'>
            <span className='icon-sign-out'></span>
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  )
}

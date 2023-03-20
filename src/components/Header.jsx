import React from 'react'
import { useAuth } from './useAuth'

export const Header = () => {
  const { logOut } = useAuth()
  const user = window.sessionStorage.getItem('user')
  const sessionOut = () => {
    window.sessionStorage.removeItem('user')
    logOut()
  }

  const classIcon = user ? 'showIcon' : 'hideIcon'

  return (
    <header className='header-container'>
      <img className='img-logo' src={('public/images/logo.png')} />
      <h1>BURGER QUEEN</h1>
      <span onClick={sessionOut} className={`icon-sign-out ${classIcon}`} />
    </header>
  )
}

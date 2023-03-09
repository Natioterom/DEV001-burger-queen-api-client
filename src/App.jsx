import './App.css'
import Menu from './components/Menu'
import './componentsCss/Menu.css'
import './componentsCss/Login.css'
import './componentsCss/Products.css'
import './componentsCss/AdminHome.css'
import Login from './components/Login'
import { Header } from './components/Header'
import { Routes, Route } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { Chef } from './components/Chef'
import { PrivateRoute } from './components/PrivateRoute'
import { Pedidos } from './components/Pedidos'
import { AdminHome } from './components/AdminHome'
import { useAuth } from './components/useAuth'

function App () {
  useAuth()
  const user = JSON.parse(window.sessionStorage.getItem('user'))

  return (
    <section className='App'>
      <Header />
      <Routes>
        <Route
          path='/' element={(<Login
            path='../public/images/burger-login.jfif'
            useNavigate={useNavigate}
                             />)}
        />

        <Route
          path='/mesero'
          element={(<PrivateRoute isAlowed={user && user.user.roles.waiter}><Menu useNavigate={useNavigate} /> </PrivateRoute>)}
        />

        <Route path='/chef' element={<PrivateRoute isAlowed={user && user.user.roles.chef}><Chef /></PrivateRoute>} />
        <Route
          path='/admin' element={<PrivateRoute isAlowed={user && user.user.roles.admin}><AdminHome /></PrivateRoute>}
         />
        <Route
          path='/mesero/orders'
          element={<PrivateRoute isAlowed={user && user.user.roles.waiter}><Pedidos /> </PrivateRoute>}
        />

        <Route
          path='/chef'
          element={<PrivateRoute isAlowed={user && user.user.roles.chef}><Chef /></PrivateRoute>}

        />
      </Routes>
    </section>
  )
}

export default App

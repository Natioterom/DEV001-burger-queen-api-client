import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { CardOrder } from './CardOrder'

export const Pedidos = () => {

  const navigate = useNavigate()

  // Vista de pedidos terminados del mesero

  const [ordersDb, setOrdersDb] = useState([])
  const [isSnapshot, setIsSnapshot] = useState(false)

  useEffect(() => {
    fetch('https://api-rest-three.vercel.app/orders')
      .then(res => res.json())
      .then(res => setOrdersDb(res))
  }, [isSnapshot])

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])

  setTimeout(() => {
    setIsSnapshot(!isSnapshot)
  }, 300000)

  const handleIsSnapshot = () => {
    setIsSnapshot(!isSnapshot)
  }

  const day = JSON.stringify(new Date()).slice(1, 11)
  const dbDate = ordersDb.filter(el => el.date.slice(0, 10) === day)

  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ''
  }

  const finishOrders = dbDate.filter(el => el.state === 'Terminado' || el.state === 'Entregado').reverse()

  const handleBack = () => navigate('/mesero')

  return (
    <>
      <div className='buttons'>
        <span className='icon-arrow-left' onClick={handleBack} />
        <span className='icon-refresh' onClick={handleIsSnapshot} />
      </div>
      <section className='card-container'>
        {

        finishOrders.map(el => {
          return (
            <CardOrder
              key={el.id} id={el.id} tiempo={el.tiempo} clientName={el.clientName} list={el.order}
              idWaiter={el.idWaiter} order={el.order} date={el.date}
              text='Entregar pedido'
              state={el.state}
            />
          )
        })
      }
      </section>
    </>
  )
}

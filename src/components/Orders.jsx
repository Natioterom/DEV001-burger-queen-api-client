import { useEffect, useState } from 'react'

export const Orders = () => {
  // Notificacion, numero de pedidos terminados
  const [ordersDb, setOrdersDb] = useState([])

  useEffect(() => {
    const data = async () => {
      try {
        const res = await fetch('http://localhost:3001/orders')
        const resJson = await res.json()
        setOrdersDb(resJson)
      } catch (err) {
        console.error('Error fetching orders for notification:', err)
      }
    }
    data()
    const interval = setInterval(data, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [])
  const day = JSON.stringify(new Date()).slice(1, 11)
  const dbDate = ordersDb.filter(el => el.date.slice(0, 10) === day)
  const finishOrders = dbDate.filter(el => el.state === 'Terminado').length

  return (
    <>
      {finishOrders > 0 && (
        <span className='notification-badge'> {finishOrders}</span>
      )}
    </>
  )
}

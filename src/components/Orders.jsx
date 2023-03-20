import { useEffect, useState } from 'react'

export const Orders = () => {
  // Notificacion, numero de pedidos terminados
  const [ordersDb, setOrdersDb] = useState([])
  
  useEffect(() => {
    const data = async() => {
      const res = await fetch('https://api-rest-three.vercel.app/orders')
      const resJson = await res.json()
      setOrdersDb(resJson)
    }
    data()
  }, [])
  const day = JSON.stringify(new Date()).slice(1, 11)
  const dbDate = ordersDb.filter(el => el.date.slice(0, 10) === day)
  const finishOrders = dbDate.filter(el => el.state === 'Terminado').length

  return (
    <>
      <span> {finishOrders}</span>
    </>
  )
}

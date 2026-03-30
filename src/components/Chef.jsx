import { useState, useEffect } from 'react'
import { CardOrder } from './CardOrder'

export const Chef = () => {
  const [db, setDb] = useState([])
  const [isSnapshot, setIsSnapshot] = useState(false)

  // 🚨 Función de alerta de salida
  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ''
  }

  // 🔹 Listener beforeunload (solo una vez)
  useEffect(() => {
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])

  // 🔹 Fetch de orders, se ejecuta al montar y cada vez que isSnapshot cambia
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:3001/orders')
        const data = await res.json()
        setDb(data)
      } catch (err) {
        console.error('Error al cargar orders:', err)
      }
    }
    fetchOrders()
  }, [isSnapshot])

  // 🔹 Intervalo para refrescar cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSnapshot(prev => !prev)
    }, 30000) // 30,000ms = 30 segundos

    return () => clearInterval(interval)
  }, [])

  const handleIsSnapshot = () => {
    setIsSnapshot(prev => !prev)
  }

  // 🔹 Filtrado por día
  const today = new Date().toISOString().slice(0, 10)
  const dbDate = db.filter(el => el.date.slice(0, 10) === today)
  const dbPending = dbDate.filter(el => el.state === 'Pendiente')

  return (
    <>
      <button className='btn btn-outline-primary mb-3' onClick={handleIsSnapshot}>
        🔄 Refrescar pedidos
      </button>

      <section className='card-container'>
        {dbPending.map(el => (
          <CardOrder
            key={el.id}
            id={el.id}
            tiempo={el.tiempo}
            clientName={el.clientName}
            list={el.order}
            idWaiter={el.idWaiter}
            order={el.order}
            date={el.date}
            text='Enviar Pedido'
          />
        ))}
      </section>
    </>
  )
}

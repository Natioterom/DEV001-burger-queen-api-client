import swal from 'sweetalert'
import { useEffect, useState } from 'react'

export function CardOrder ({ id, list, clientName, idWaiter, order, date, text, tiempo, state }) {
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)
  const [finish, setFinish] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval = null
    if (!isPaused) {
      interval = setInterval(() => {
        setSecond(second + 1)
      }, 1000)
    } else if (isPaused && second !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPaused, second])

  useEffect(() => {
    if (second === 60) {
      setSecond(0)
      setMinute(minute + 1)
    }
  }, [second])

  useEffect(() => {
    if (minute === 60) {
      setMinute(0)
      setHour(hour + 1)
    }
  }, [minute])

  const sendOrder = async () => {
    const data = {
      state: 'Terminado',
      clientName,
      order,
      idWaiter,
      date,
      tiempo: ` ${hour} : ${minute} : ${second}`
    }
    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    await fetch(`http://localhost:3001/orders/${id}`, options)
    setFinish(true)
    setIsPaused(true)
    swal('Pedido enviado', '', 'success')
  }

  const orderCheck = finish || state === 'Entregado' ? 'card-order-finish' : 'card-order'
  const button = finish || state === 'Entregado' ? 'button-card-finish' : 'button-card'
  const timer = text === 'Enviar Pedido' ? ` Tiempo :${hour} : ${minute} : ${second}` : tiempo

  const mesero = () => {
    const data = {
      state: 'Entregado',
      clientName,
      order,
      idWaiter,
      date,
      tiempo: ` ${hour} : ${minute} : ${second}`
    }
    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    fetch(`http://localhost:3001/orders/${id}`, options)

    setFinish(true)
    swal('Pedido entregado', '', 'success')
  }

  return (
    <article className={orderCheck}>
      <p>{timer}</p>
      <h2 className='card-order__title'>{`Pedido # ${id}`}</h2>
      <p>{clientName}</p>
      <ul className='order-list'>
        {
            list.map(el => {
              return (
                <li className='' key={Math.random().toString(36).replace(/[^a-z]+/g, '')}>{el.quantity} {el.productName} </li>
              )
            })
        }
      </ul>
      {text === 'Enviar Pedido'
        ? <button onClick={sendOrder} className={button}> {text} </button>
        : <button onClick={mesero} className={button}> {text} </button>}
    </article>
  )
}

import swal from 'sweetalert'
import Products from './Products'
import { useState, useEffect, useContext } from 'react'
import ProductContext from './DataContext'
import { Orders } from './Orders'
import { Check } from './Check'
import { useNavigate } from 'react-router'

function Menu () {
  const [db, setDb] = useState([])
  const [inputName, setInputName] = useState('')
  const [isBreackFast, setIsBreackFast] = useState(true)
  const [uniqueProducts, setUniqueProducts] = useState([])
  const { items, setItems } = useContext(ProductContext)

  const navigate = useNavigate()

  const user = JSON.parse(window.sessionStorage.getItem('user'))

  useEffect(() => {
    // Consultar y guardar la data
    const getData = async () => {
      const res = await fetch('https://api-rest-three.vercel.app/products')
      const data = await res.json()
      setDb(data)
    }
    getData()
  }, [])

  useEffect(() => {
    // Advertencia para recargar la pagina
    window.addEventListener('beforeunload', alertUser)
    return () => {
      window.removeEventListener('beforeunload', alertUser)
    }
  }, [])

  useEffect(() => {
    // Agrupar productos de forma robusta por nombre
    const grouped = items.reduce((acc, item) => {
      const existing = acc.find(p => p.productName === item.productName)
      if (existing) {
        existing.quantity += 1
      } else {
        acc.push({ ...item, quantity: 1 })
      }
      return acc
    }, [])
    setUniqueProducts(grouped)
  }, [items])

  const alertUser = (e) => {
    e.preventDefault()
    e.returnValue = ''
  }

  const breakFast = db.filter(product => product.type === 'breakFast')
  const lunch = db.filter(product => product.type === 'lunch')

  // Calcular el total de la compra
  const price = items.map(price => price.cost)
  const total = price.reduce((acc, el) => acc + el, 0)

  // Cambiar de vistas
  const handleClickBreakFast = () => {
    setIsBreackFast(true)
  }
  const handleClickLunchDinner = () => {
    setIsBreackFast(false)
  }

  const name = (e) => {
    setInputName(e.target.value)
  }

  const date = new Date()

  // Envia el pedido a la base de datos
  const handleSendProduct = () => {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    const token = user?.accessToken

    if (!inputName) return swal('Atención', 'Por favor ingresa el nombre del cliente', 'warning')
    if (uniqueProducts.length === 0) return swal('Atención', 'El pedido está vacío', 'warning')

    const data = {
      state: 'Pendiente',
      clientName: inputName,
      order: uniqueProducts,
      idWaiter: user.user.id,
      date: new Date().toISOString()
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    fetch('http://localhost:3001/orders', options)
      .then(res => {
        if (!res.ok) throw new Error()
        setItems([])
        setInputName('')
        swal('Pedido enviado a cocina', '', 'success')
      })
      .catch(() => {
        swal('Error', 'No se pudo enviar el pedido a la cocina', 'error')
      })
  }

  // Aumentar cantidad de producto
  const handleAddOne = (item) => {
    setItems([...items, { productName: item.productName, cost: item.cost }])
  }

  // Disminuye productos seleccionados
  const handleDelete = (item) => {
    const indexToRemove = items.findIndex(el => el.productName === item.productName)
    if (indexToRemove !== -1) {
      const newItems = [...items]
      newItems.splice(indexToRemove, 1)
      setItems(newItems)
    }
  }

  // Elimina todo el grupo de un producto
  const handleRemoveAll = (item) => {
    setItems(items.filter(el => el.productName !== item.productName))
  }

  const orders = () => {
    navigate('/mesero/orders')
  }

  return (
    <>
      <button className='btn-click' onClick={handleClickBreakFast}> Desayuno</button>
      <button className='btn-click-user' onClick={handleClickLunchDinner}> Almuerzo/Cena</button>
      <div className='container-menu-check'>
        <section className='container-menu'>
          {isBreackFast
            ? breakFast.map(e => {
              return (
                <Products
                  key={e.id}
                  img={e.img}
                  productName={e.name}
                  cost={e.price}
                />
              )
            })

            : lunch.map(e => {
              return (
                <Products
                  key={e.id}
                  img={e.img}
                  productName={e.name}
                  cost={e.price}
                />
              )
            })}
        </section>
        <section className='check-container'>
          <h1>Cuenta</h1>
          <input className='client-name' value={inputName} placeholder='Nombre' name='name' onChange={name} />
          <div className='list-container'>
            {
              uniqueProducts.map(item => {
                return (
                  <div key={item.productName} className='container-check-list'>
                    <Check
                      quantity={item.quantity}
                      cost={item.cost * item.quantity}
                      name={item.productName}
                    />
                    <div className='order-actions'>
                      <div className='qty-buttons'>
                        <button className='btn-qty btn-minus' onClick={() => handleDelete(item)}>-</button>
                        <button className='btn-qty btn-plus' onClick={() => handleAddOne(item)}>+</button>
                      </div>
                      <span className='icon-trash-o btn-delete-item' onClick={() => handleRemoveAll(item)} />
                    </div>
                  </div>
                )
              })
            }
          </div>
          <h2 className='total'> Total :${total}.00</h2>
          <button className='send-products' onClick={handleSendProduct}>Añadir Pedido</button>
        </section>
      </div>
    </>
  )
}
export default Menu

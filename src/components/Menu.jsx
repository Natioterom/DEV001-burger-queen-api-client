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
  const [ uniqueProducts, setUniqueProducts ] = useState([])
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
    // Crear un array unico con propiedad cantidad a partir de items
    const products = items.map(item => { return { ...item, quantity: items.filter(e => e.productName === item.productName).length } })
    const setProducts = new Set(products.map(JSON.stringify))
    setUniqueProducts(Array.from(setProducts).map(JSON.parse))
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
    const data = {
      state: 'Pendiente',
      clientName: inputName,
      order: uniqueProducts,
      idWaiter: user.user.id,
      date
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    fetch('https://api-rest-three.vercel.app/orders', options)
    setItems([])
    setInputName('')
    swal('Pedido enviado a cocina', '', 'success')
  }

  // Elimina productos seleccionados
  const handleDelete = (item) => {
    const positionArr = items.indexOf(items.find(el => el.productName === item.productName))
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1
      setUniqueProducts([...uniqueProducts])
      setItems(items.filter((_, i) => items.indexOf(items[positionArr]) !== i))
    } else {
      setUniqueProducts(uniqueProducts.filter((_, i) => uniqueProducts.indexOf(item) !== i))
      setItems(items.filter((_, i) => items.indexOf(items[positionArr]) !== i))
    }
  }

  const orders = () => {
    navigate('/mesero/orders')
  }

  return (
    <>
      <span className='icon-bell' onClick={orders}> <Orders /> </span>
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
                  <div key={Math.random().toString(36).replace(/[^a-z]+/g, '')} className='container-check-list'>
                    <Check
                      quantity={item.quantity}
                      cost={item.cost * item.quantity}
                      name={item.productName}
                    />
                    <span className='icon-trash-o' onClick={() => handleDelete(item)} />
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

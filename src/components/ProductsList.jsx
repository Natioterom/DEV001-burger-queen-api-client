import swal from 'sweetalert'
import { useEffect, useState, useRef, useContext } from 'react'
import { ModalProducts } from './ModalProducts'
import ProductContext from './DataContext'

export const ProductList = () => {
  const [db, setDb] = useState([])
  const [borrar, setBorrar] = useState(false)
  const [isEdit, setIsEdit] = useState(null)
  const { edit, setEdit } = useContext(ProductContext)
  const products = useRef({})

  useEffect(() => {
    const petition = async () => {
      const data = await fetch('https://api-rest-three.vercel.app/products')
      const res = await data.json()
      setDb(res)
    }
    petition()
  }, [borrar, edit])

  const handleDelete = (id) => {
    swal({
      title: '¿Estás seguro que quiere elimar este producto?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
      .then((willDelete) => {
        if (willDelete) {
          const option = {
            method: 'DELETE',
            body: JSON.stringify(db),
            headers: { 'content-type': 'application/json' }
          }
          fetch(`https://api-rest-three.vercel.app/products/${id}`, option)
          setBorrar(!borrar)
          swal('El producto ha sido eliminado!', {
            icon: 'success'
          })
        } else {
          swal('Producto no eliminado!')
        }
      })
    setEdit(!edit)
  }
  const handleEdit = (product) => {
    products.current = product
    setEdit(!edit)
    setIsEdit(true)
  }

  const handleAdd = () => {
    setIsEdit(false)
  }
  return (
    <><button type='button' className='btn btn-success' data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={handleAdd}>Agregar Producto</button>
      <article className='container-employee'>
        <div className='container-employee-list'>
          <table className='table'>
            <thead>
              <tr>
                <th className='col' scope='col'>ID</th>
                <th className='col' scope='col'>Nombre</th>
                <th className='col' scope='col'>Precio</th>
                <th className='col' scope='col'>Tipo</th>
                <th className='col' scope='col'>Fecha</th>
                <th className='col' scope='col'>Eliminar</th>
                <th className='col' scope='col'>Editar</th>
              </tr>
            </thead>
            <tbody>
              {
                    db.map((product, index) => {
                      return (
                        <tr key={product.id}>
                          <th scope='row'>{index}</th>
                          <td className='celdas'>{product.name}</td>
                          <td className='celdas'>{product.price}</td>
                          <td className='celdas'>{
                         product.type === 'breakFast'
                           ? 'Desayuno'
                           : 'Almuerzo/Cena'
}
                          </td>
                          <td className='celdas'>{product.dataEntry.slice(0, 10).replaceAll('-', '/')}</td>
                          <td className='celdas'>
                            <button type='button' className='btn btn-outline-danger' onClick={() => handleDelete(product.id)}>Eliminar</button>
                          </td>
                          <td className='celdas'>
                            <button type='button' className='btn btn-outline-info' data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => { handleEdit(product) }}>
                              Editar
                            </button>
                          </td>
                        </tr>
                      )
                    })
                }

            </tbody>
          </table>
        </div>
        <ModalProducts isEdit={isEdit} name={products.current.name} price={products.current.price} product={products.current} />
      </article>

    </>

  )
}

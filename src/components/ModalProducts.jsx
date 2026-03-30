import { useContext, useEffect } from 'react'
import swal from 'sweetalert'
import ProductContext from './DataContext'

export function ModalProducts ({ product, isEdit, refreshList }) {
  const { inputName, setInputName, inputCost, setInputCost, edit, setEdit } = useContext(ProductContext)

  // 🔹 Actualizar inputs según si es edición o nuevo producto
  useEffect(() => {
    if (isEdit && product) {
      setInputName(product.name)
      setInputCost(product.price)
    } else {
      setInputName('')
      setInputCost('')
    }
  }, [product, isEdit, edit])

  const handleName = (e) => setInputName(e.target.value)
  const handleCost = (e) => setInputCost(e.target.value)

  const addProduct = async () => {
    if (!inputName || !inputCost) return swal('Completa todos los campos', '', 'warning')

    const data = {
      name: inputName,
      price: parseInt(inputCost),
      img: '',
      type: 'breakFast',
      dataEntry: new Date()
    }

    await fetch('https://api-rest-three.vercel.app/products', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })

    swal('Producto agregado', '', 'success')
    refreshList()
    setEdit(!edit)
  }

  const editProduct = async () => {
    if (!inputName || !inputCost) return swal('Completa todos los campos', '', 'warning')

    const data = { ...product, name: inputName, price: parseInt(inputCost) }

    await fetch(`https://api-rest-three.vercel.app/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })

    swal('Producto actualizado', '', 'success')
    refreshList()
    setEdit(!edit)
  }

  return (
    <div className='modal fade' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{isEdit ? 'Editar Producto' : 'Agregar Producto'}</h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' />
          </div>

          <div className='modal-body'>
            <div className='mb-3'>
              <label className='form-label'>Nombre Producto</label>
              <input type='text' className='form-control' value={inputName} onChange={handleName} />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Precio</label>
              <input type='text' className='form-control' value={inputCost} onChange={handleCost} />
            </div>
          </div>

          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-primary'
              data-bs-dismiss='modal'
              onClick={isEdit ? editProduct : addProduct}
            >
              {isEdit ? 'Guardar Cambios' : 'Agregar Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

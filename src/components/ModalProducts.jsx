import swal from 'sweetalert'
import { useContext, useEffect } from 'react'
import ProductContext from './DataContext'

export function ModalProducts ({ name, price, product, isEdit }) {
  const { inputName, setInputName } = useContext(ProductContext)
  const { inputCost, setInputCost } = useContext(ProductContext)
  const { edit, setEdit } = useContext(ProductContext)

  useEffect(() => {
    setInputName(name)
    setInputCost(price)
  }, [edit])

  const handleName = (e) => {
    setInputName(e.target.value)
  }
  const handleCost = (e) => {
    setInputCost(e.target.value)
  }
  const editProduct = async () => {
    swal('Producto actualizado', '', 'success')
    const id = product.id
    const data = {
      id: product.id,
      name: inputName,
      price: parseInt(inputCost),
      img: product.img,
      type: product.type,
      dataEntry: product.dataEntry
    }
    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    await fetch(`http://localhost:3000/products/${id}`, options)
    setEdit(!edit)
  }
  const addProduct = (e) => {
    e.preventDefault()
    const fields = Object.fromEntries(new window.FormData(e.target))
    const data = {
      ...fields,
      dataEntry: new Date()
    }
    data.price = parseInt(data.price)
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    fetch('http://localhost:3000/products', options)
    swal('Producto agregado', '', 'success')
    setEdit(!edit)
    e.target.reset()
  }
  return (

    <div className='modal fade' id='staticBackdrop' data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='staticBackdropLabel'>Modal title</h1>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
          </div>
          <div className='modal-body'>
            {isEdit
              ? <>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>Nombre Producto</label>
                  <input type='text' className='form-control' id='formGroupExampleInput' placeholder='Nombre Producto' onChange={handleName} value={inputName} />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput2' className='form-label'>Precio</label>
                  <input type='text' className='form-control' id='formGroupExampleInput2' placeholder='Precio' onChange={handleCost} value={inputCost} />
                </div>
              </>
              : <form onSubmit={addProduct}>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>Nombre Producto</label>
                  <input type='text' className='form-control' name='name' id='formGroupExampleInput' placeholder='Nombre Producto' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput2' className='form-label'>Precio</label>
                  <input type='text' className='form-control' name='price' id='formGroupExampleInput2' placeholder='Precio' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>Imagen</label>
                  <input type='text' className='form-control' name='img' id='formGroupExampleInput' placeholder='http://img.jpg' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput2' className='form-label'>Tipo de producto</label>
                  <select className='form-select' name='type' fields aria-label='Default select example'>
                    <option selected>Selecciona el tipo de producto:</option>
                    <option value='breakFast'>Desayuno</option>
                    <option value='lunch'>Almuerzo/cena</option>
                  </select>
                </div>
                <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>Guardar</button>
              </form>}
          </div>
          <div className='modal-footer'>
            {
            isEdit
              ? <button type='button' className='btn btn-primary' data-bs-dismiss='modal' onClick={editProduct}>Guardar</button>
              : ''
            }
          </div>
        </div>
      </div>
    </div>
  )
}

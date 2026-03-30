import { useState, useEffect } from 'react'

export const ProductList = () => {
  const [db, setDb] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    type: 'breakFast'
  })
  const [editRow, setEditRow] = useState(null)

  const URL = 'http://localhost:3000/products'

  const refreshList = async () => {
    const res = await fetch(URL)
    const data = await res.json()
    setDb(data)
  }

  useEffect(() => {
    refreshList()
  }, [])

  const handleChange = (e, id = null) => {
    const { name, value } = e.target

    if (id) {
      setDb(db.map(p => p.id === id ? { ...p, [name]: value } : p))
    } else {
      setNewProduct({ ...newProduct, [name]: value })
    }
  }

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price) return window.alert('Completa los campos')

    await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })

    setNewProduct({ name: '', price: '', type: 'breakFast' })
    refreshList()
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto?')) {
      await fetch(`${URL}/${id}`, { method: 'DELETE' })
      refreshList()
    }
  }

  const handleSave = async (product) => {
    await fetch(`${URL}/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })

    setEditRow(null)
    refreshList()
  }

  return (
    <div className='container mt-4'>
      <h3>Productos</h3>

      <table className='table table-bordered table-hover'>
        <thead className='table-dark'>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>+</td>
            <td><input name='name' value={newProduct.name} onChange={handleChange} className='form-control' /></td>
            <td><input type='number' name='price' value={newProduct.price} onChange={handleChange} className='form-control' /></td>
            <td>
              <select name='type' value={newProduct.type} onChange={handleChange} className='form-select'>
                <option value='breakFast'>Desayuno</option>
                <option value='lunch'>Almuerzo/Cena</option>
              </select>
            </td>
            <td><button className='btn btn-success btn-sm' onClick={handleAdd}>Agregar</button></td>
          </tr>

          {db.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>

              <td>
                {editRow === product.id
                  ? <input name='name' value={product.name} onChange={(e) => handleChange(e, product.id)} className='form-control' />
                  : product.name}
              </td>

              <td>
                {editRow === product.id
                  ? <input type='number' name='price' value={product.price} onChange={(e) => handleChange(e, product.id)} className='form-control' />
                  : `$${product.price}`}
              </td>

              <td>
                {editRow === product.id
                  ? (
                    <select name='type' value={product.type} onChange={(e) => handleChange(e, product.id)} className='form-select'>
                      <option value='breakFast'>Desayuno</option>
                      <option value='lunch'>Almuerzo/Cena</option>
                    </select>
                    )
                  : (product.type === 'breakFast' ? 'Desayuno' : 'Almuerzo/Cena')}
              </td>

              <td>
                {editRow === product.id
                  ? (
                    <>
                      <button className='btn btn-primary btn-sm me-2' onClick={() => handleSave(product)}>Guardar</button>
                      <button className='btn btn-secondary btn-sm' onClick={() => setEditRow(null)}>Cancelar</button>
                    </>
                    )
                  : (
                    <>
                      <button className='btn btn-warning btn-sm me-2' onClick={() => setEditRow(product.id)}>Editar</button>
                      <button className='btn btn-danger btn-sm' onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </>
                    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

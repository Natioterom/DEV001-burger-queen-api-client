import swal from 'sweetalert'
import { useEffect, useState, useRef, useContext } from 'react'
import { ModalEmployee } from './ModalEmployee'
import ProductContext from './DataContext'

export const EmployeeList = () => {
  const [db, setDb] = useState([])
  const [borrar, setBorrar] = useState(false)
  const [isEdit, setIsEdit] = useState(null)
  const { edit, setEdit } = useContext(ProductContext)
  const employee = useRef('')
  // const formDom = useRef(null)

  useEffect(() => {
    const petition = async () => {
      const data = await fetch('http://localhost:3004/users')
      const res = await data.json()
      setDb(res)
    }
    petition()
  }, [borrar, edit])

  const handleDelete = (id) => {
    swal({
      title: '¿Estás seguro que quiere elimar este usuario?',
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
          fetch(`http://localhost:3004/users/${id}`, option)
          setBorrar(!borrar)
          swal('El usuario ha sido eliminado!', {
            icon: 'success'
          })
        } else {
          swal('Usuario no eliminado!')
        }
      })
    setEdit(!edit)
  }

  const handleAdd = () => {
    setIsEdit(false)
    // console.log(formDom.current)
  }
  const handleEdit = (worker) => {
    employee.current = worker
    setEdit(!edit)
    setIsEdit(true)
  }

  return (
    <><button type='button' className='btn btn-success' data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={handleAdd}>Agregar Empleado</button>
      <article className='container-employee'>
        <div className='container-employee-list'>
          <table className='table'>
            <thead>
              <tr>
                <th className='col' scope='col'>ID</th>
                <th className='col' scope='col'>Nombre</th>
                <th className='col' scope='col'>e-mail</th>
                <th className='col' scope='col'>Rol</th>
                <th className='col' scope='col'>Eliminar</th>
                <th className='col' scope='col'>Editar</th>
              </tr>
            </thead>
            <tbody>
              {
                    db.map((worker) => {
                      return (
                        <tr key={worker.id}>
                          <th scope='row'>{worker.id}</th>
                          <td className='celdas'>{worker.name}</td>
                          <td className='celdas'>{worker.email}</td>
                          <td className='celdas'>{
                          worker.roles.admin
                            ? 'Admin'
                            : worker.roles.chef
                              ? 'Chef'
                              : 'Mesero'
}
                          </td>
                          <td className='celdas'>
                            <button type='button' className='btn btn-outline-danger' onClick={() => { handleDelete(worker.id) }}>Eliminar</button>
                          </td>
                          <td className='celdas'>
                            <button type='button' className='btn btn-outline-info' data-bs-toggle='modal' data-bs-target='#staticBackdrop' onClick={() => { handleEdit(worker) }}>Editar</button>
                          </td>
                        </tr>
                      )
                    })
                }

            </tbody>
          </table>
        </div>
        <ModalEmployee employee={employee.current} isEdit={isEdit} />
      </article>
    </>
  )
}

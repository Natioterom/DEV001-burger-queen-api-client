import swal from 'sweetalert'
import { useEffect, useState, useContext } from 'react'
import { ModalEmployee } from './ModalEmployee'
import ProductContext from './DataContext'

export const EmployeeList = () => {
  const [db, setDb] = useState([])
  const [isEdit, setIsEdit] = useState(null)
  const { edit, setEdit, setCurrentEmployee } = useContext(ProductContext)

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch('http://localhost:3004/users')
      const data = await res.json()
      setDb(data)
    }
    fetchEmployees()
  }, [edit])

  // Eliminar usuario
  const handleDelete = (id) => {
    swal({
      title: '¿Seguro que quieres eliminar este usuario?',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete) {
        await fetch(`http://localhost:3004/users/${id}`, { method: 'DELETE' })
        setEdit(prev => !prev) // refetch
        swal('Usuario eliminado!', { icon: 'success' })
      }
    })
  }

  // Agregar usuario
  const handleAdd = () => {
    setCurrentEmployee(null)// Limpiamos empleado actual
    setIsEdit(false)
  }

  // Editar usuario
  const handleEdit = (employee) => {
    setCurrentEmployee(employee)
    setIsEdit(true)
  }

  return (
    <>
      <button type='button' className='btn btn-success mb-3' data-bs-toggle='modal' data-bs-target='#employeeModal' onClick={handleAdd}>
        Agregar Empleado
      </button>

      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Eliminar</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {db.map(worker => (
            <tr key={worker.id}>
              <td>{worker.id}</td>
              <td>{worker.name}</td>
              <td>{worker.email}</td>
              <td>
                {worker.roles.admin ? 'Admin' : worker.roles.chef ? 'Chef' : 'Mesero'}
              </td>
              <td>
                <button className='btn btn-outline-danger' onClick={() => handleDelete(worker.id)}>Eliminar</button>
              </td>
              <td>
                <button className='btn btn-outline-info' data-bs-toggle='modal' data-bs-target='#employeeModal' onClick={() => handleEdit(worker)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalEmployee isEdit={isEdit} />
    </>
  )
}

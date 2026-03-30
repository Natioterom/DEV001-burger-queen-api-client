import swal from 'sweetalert'
import { useState, useEffect, useContext } from 'react'
import ProductContext from './DataContext'

export function ModalEmployee ({ isEdit }) {
  const { setEdit, currentEmployee } = useContext(ProductContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (isEdit && currentEmployee) {
      // Modo editar: cargamos datos del empleado
      setName(currentEmployee.name)
      setEmail(currentEmployee.email)
      setPassword('') // nunca mostrar la contraseña real
      setRole(currentEmployee.roles.admin ? 'admin' : currentEmployee.roles.chef ? 'chef' : 'waiter')
    } else {
      // Modo agregar: limpiamos campos
      setName('')
      setEmail('')
      setPassword('')
      setRole('')
    }
  }, [isEdit, currentEmployee])

  // Editar empleado
  const editEmployee = async (e) => {
    e.preventDefault()
    const data = {
      name,
      email,
      password,
      roles: {
        admin: role === 'admin',
        chef: role === 'chef',
        waiter: role === 'waiter'
      }
    }

    await fetch(`https://api-rest-three.vercel.app/users/${currentEmployee.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })

    swal('Usuario actualizado!', '', 'success')
    setEdit(prev => !prev)
  }

  // Agregar empleado
  const addEmployee = async (e) => {
    e.preventDefault()
    const data = {
      name,
      email,
      password,
      roles: {
        admin: role === 'admin',
        chef: role === 'chef',
        waiter: role === 'waiter'
      }
    }

    await fetch('https://api-rest-three.vercel.app/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    })

    swal('Usuario agregado!', '', 'success')
    setEdit(prev => !prev)
  }

  return (
    <div className='modal fade' id='employeeModal' tabIndex='-1' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>{isEdit ? 'Editar Empleado' : 'Agregar Empleado'}</h5>
            <button type='button' className='btn-close' data-bs-dismiss='modal' />
          </div>
          <form onSubmit={isEdit ? editEmployee : addEmployee}>
            <div className='modal-body'>
              <div className='mb-3'>
                <label className='form-label'>Nombre</label>
                <input className='form-control' value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input className='form-control' value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Contraseña</label>
                <input className='form-control' type='password' value={password} onChange={e => setPassword(e.target.value)} required={!isEdit} />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Rol</label>
                <select className='form-select' value={role} onChange={e => setRole(e.target.value)} required>
                  <option value=''>Selecciona rol</option>
                  <option value='admin'>Admin</option>
                  <option value='chef'>Chef</option>
                  <option value='waiter'>Mesero</option>
                </select>
              </div>
            </div>
            <div className='modal-footer'>
              <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>{isEdit ? 'Guardar cambios' : 'Agregar'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

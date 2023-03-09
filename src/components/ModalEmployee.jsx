import swal from 'sweetalert'
import { useContext, useState, useEffect } from 'react'
import ProductContext from './DataContext'

export function ModalEmployee ({ employee, isEdit }) {
  const { edit, setEdit } = useContext(ProductContext)
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState(null)

  useEffect(() => {
    const prueba = () => {
      if (isEdit) {
        setInputName(employee.name)
        setInputEmail(employee.email)
        setInputPassword('')
      } else {
        setInputName('')
        setInputEmail('')
        setInputPassword('')
      }
    }
    prueba()
  }, [edit, isEdit])

  const handleName = (e) => {
    setInputName(e.target.value)
  }
  const handleEmail = (e) => {
    setInputEmail(e.target.value)
  }
  const handlePassword = (e) => {
    setInputPassword(e.target.value)
  }
  const editEmployee = async (e) => {
    e.preventDefault()
    const id = employee.id
    const fields = Object.fromEntries(new window.FormData(e.target))
    console.log(fields)
    const data = {
      ...fields,
      id: employee.id
    }

    const obj = {
      admin: data.roles === 'admin',
      waiter: data.roles === 'waiter',
      chef: data.roles === 'chef'
    }
    data.roles = obj
    data.email = inputEmail
    data.name = inputName
    data.password = inputPassword
    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }

    try {
      const res = await fetch(`http://localhost:3004/users/${id}`, options)
      if (!res.ok || res.status >= 400) {
        throw new Error(res.status)
      } else {
        swal('Usuario actualizado', '', 'success')
      }
      setEdit(!edit)
    } catch (error) {
      swal('Todos los campos son requeridos', '', 'error')
    }
  }

  const addEmployee = (e) => {
    e.preventDefault()
    const fields = Object.fromEntries(new window.FormData(e.target))
    const data = {
      ...fields
    }
    const obj = {
      admin: data.roles === 'admin',
      waiter: data.roles === 'waiter',
      chef: data.roles === 'chef'
    }
    data.roles = obj
    data.email = inputEmail
    data.name = inputName

    const options = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    }
    fetch('http://localhost:3004/users', options)
    swal('Usuario agregado', '', 'success')
    setEdit(!edit)
    // formDom.current = e.target
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
                <form onSubmit={editEmployee}>
                  <div className='mb-3'>
                    <label htmlFor='formGroupExampleInput' className='form-label'>Nombre</label>
                    <input type='text' className='form-control' onChange={handleName} value={inputName} name='name' id='formGroupExampleInput' placeholder='Nombre' />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='formGroupExampleInput' className='form-label'> e-mail</label>
                    <input type='text' className='form-control' onChange={handleEmail} value={inputEmail} name='email' id='formGroupExampleInput' placeholder='nombre@burgerqueen.com' />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='formGroupExampleInput2' className='form-label'>Contraseña</label>
                    <input type='text' className='form-control' name='password' id='formGroupExampleInput2' placeholder='Contraseña' onChange={handlePassword} value={inputPassword} />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='formGroupExampleInput2' className='form-label'>Rol empleado</label>
                    <select className='form-select' name='roles' fields aria-label='Default select example'>
                      <option value>Selecciona el rol del empleado:</option>
                      <option value='chef'>Chef</option>
                      <option value='waiter'>Mesero</option>
                      <option value='admin'>Administrador</option>
                    </select>
                  </div>
                  <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>Guardar</button>
                </form>
                </>
              : <form className='formDom' onSubmit={addEmployee}>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>Nombre</label>
                  <input type='text' className='form-control' name='name' id='formGroupExampleInput' placeholder='Nombre' onChange={handleName} value={inputName} />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'> e-mail</label>
                  <input type='text' className='form-control' name='email' id='formGroupExampleInput' placeholder='nombre@burgerqueen.com' onChange={handleEmail} value={inputEmail} />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput2' className='form-label'>Contraseña</label>
                  <input type='text' className='form-control' name='password' id='formGroupExampleInput2' placeholder='Contraseña' />
                </div>
                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput2' className='form-label'>Rol empleado</label>
                  <select className='form-select' name='roles' fields aria-label='Default select example'>
                    <option selected>Selecciona el rol del empleado:</option>
                    <option value='chef'>Chef</option>
                    <option value='waiter'>Mesero</option>
                    <option value='admin'>Administrador</option>
                  </select>
                </div>
                <button type='submit' className='btn btn-primary' data-bs-dismiss='modal'>Guardar</button>
                </form>}
          </div>
        </div>
      </div>
    </div>
  )
}

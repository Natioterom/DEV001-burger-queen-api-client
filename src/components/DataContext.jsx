import React, { useState, createContext } from 'react'

const ProductContext = createContext()

export function ProductContextProvider ({ children }) {
  const [items, setItems] = useState([])// Lista global de productos
  const [edit, setEdit] = useState(false)// Para re-render del modal
  const [currentProduct, setCurrentProduct] = useState(null) // Producto que se edita
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [inputName, setInputName] = useState('')// Nombre del producto
  const [inputCost, setInputCost] = useState('')// Precio del producto

  const resetInputs = () => {
    setInputName('')
    setInputCost('')
    setCurrentProduct(null)
    setCurrentEmployee(null)
  }

  return (
    <ProductContext.Provider
      value={{
        items,
        setItems,
        edit,
        setEdit,
        currentProduct,
        setCurrentProduct,
        currentEmployee,
        setCurrentEmployee,
        inputName,
        setInputName,
        inputCost,
        setInputCost,
        resetInputs
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export default ProductContext

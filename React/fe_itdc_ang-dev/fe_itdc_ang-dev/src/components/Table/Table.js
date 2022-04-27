import React from "react"
import { Table as BSTable } from "react-bootstrap"

const Table = ({ 
  responsive = true,
  className,
  children,
  ...rest
}) => {
  return (
    <BSTable 
      {...rest}
      bordered 
      hover 
      responsive={responsive}
      className={`bg-white border-1 shadow-sm ${className}`}
    >
      {children}
    </BSTable>
  )
}

export default Table
import React from 'react'

const TBody = ({children, ...props}) => {
  return (
    <tbody {...props}>
      {children}
    </tbody>
  )
}

export default TBody

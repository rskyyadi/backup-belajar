import React from 'react'

const Thead = ({children, ...props}) => {
  return (
    <thead {...props}>
      {children}
    </thead>
  )
}

export default Thead

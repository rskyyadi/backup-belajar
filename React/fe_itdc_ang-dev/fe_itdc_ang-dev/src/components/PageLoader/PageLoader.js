import React from 'react'
import {
  Spinner
} from 'react-bootstrap'

const PageLoader = () => {
  return (
    <div className="page-loader">
      <Spinner
        animation="border" 
        variant="primary" 
      />
    </div>
  )
}

export default PageLoader

import React from 'react'
import {
  Spinner
} from 'react-bootstrap'

const DataStatus = ({text, loading}) => {
  return (
    <div className="d-flex justify-content-center my-4">
      {loading && (
        <Spinner 
          animation="border" 
          size="sm"
          className="mr-2 mt-1"
        />
      )}
      <h5 className="m-0">{text}</h5>
    </div>
  )
}

export default DataStatus

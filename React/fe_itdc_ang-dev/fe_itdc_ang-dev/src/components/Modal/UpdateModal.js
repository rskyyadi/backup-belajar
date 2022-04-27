import React from 'react'
import {
  Modal
} from 'react-bootstrap'
import {
  IoPencilOutline
} from 'react-icons/io5'

const UpdateModal = ({show, size, onHide, children, title}) => {
  return (
    <Modal 
      show={show}
      size={size}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-success">
          <h6 className="mb-0">
            <IoPencilOutline
              className="mb-1 mr-2" 
              size={20}
            />
            Ubah Data {title}
          </h6>
        </Modal.Title>
      </Modal.Header>
      {children}
    </Modal>
  )
}

export default UpdateModal

import React from 'react'
import {
    Modal
} from 'react-bootstrap'
import {
    IoAddOutline,
    IoReload,
    IoCloseCircleOutline,
    IoCheckmarkCircleOutline
} from 'react-icons/io5'

const StatusModal = ({ show, size, onHide, children, title, status = "PROGRESS" }) => {
  const Done = () => {
    return (
      <h6 className="mb-0 text-success">
          <IoCheckmarkCircleOutline className="mb-1 mr-2" size={20} />
          Progress (status DONE)
      </h6>
    )
  }

  const Cancelled = () => {
    return (
      <h6 className="mb-0 text-danger">
        <IoCloseCircleOutline className="mb-1 mr-2" size={20} />
        Progress (status CANCELED)
      </h6>
    )
  }

  const OnProgress = () => {
    return (
      <h6 className="mb-0 text-info">
        <IoReload className="mb-1 mr-2" size={20} />
        Progress (Status ON PROGRESS)
      </h6>
    )
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <h6 className="mb-0">
            {
              (status == "DONE") 
                ? <Done />
                : (status == "CANCEL") 
                  ? <Cancelled />
                  : <OnProgress />
            }
          </h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          {children}
      </Modal.Body>
    </Modal>
  )
}

export default StatusModal

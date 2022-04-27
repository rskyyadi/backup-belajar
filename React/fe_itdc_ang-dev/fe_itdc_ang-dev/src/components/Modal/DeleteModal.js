import React from 'react'
import {
  Modal
} from 'react-bootstrap'
import {
  IoTrashBinOutline
} from 'react-icons/io5'
import {
  ActionButton
} from '../../components'

const DeleteModal = ({show, onHide, loading, onConfirm, title, children}) => {
  return (
    <Modal 
      show={show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <h6 className="mb-0">
            <IoTrashBinOutline
              className="mb-1 mr-2" 
              size={20}
            />
            Hapus Data {title}
          </h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <h5 className="mb-1">Apakah anda yakin menghapus data?</h5>
        <div>
          {children}
        </div>
        <small className="text-danger">Data yang telah dihapus tidak dapat dikembalikan</small>
        <div className="mt-3">
          <ActionButton 
            variant="outline-secondary"
            text="Batal"
            onClick={onHide}
          />
          <ActionButton 
            variant="danger"
            text="Hapus data"
            onClick={onConfirm}
            loading={loading}
            className="ml-1"
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteModal

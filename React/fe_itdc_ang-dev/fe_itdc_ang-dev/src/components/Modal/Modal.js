import React from 'react'
import {
  Modal as BSModal
} from 'react-bootstrap'

const Modal = ({
  title,
  show,
  size,
  onHide,
  children,
  closeButton,
  ...rest
}) => {
  return (
    <BSModal 
      {...rest}
      size={size}
      show={show} 
      onHide={onHide}
    >
      <BSModal.Header 
        closeButton={closeButton}
      >
        <b>{title}</b>
      </BSModal.Header>
      {children}
    </BSModal>
  )
}

export default Modal
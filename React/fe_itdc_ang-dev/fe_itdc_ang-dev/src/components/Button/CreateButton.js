import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoAddOutline
} from 'react-icons/io5'

const CreateButton = ({
  text,
  type,
  size ,
  variant,
  disable,
  className,
  style,
  children,
  onClick,
  tooltip,
  tooltipText,
  tooltipPlacement,
  ...rest
}) => {
  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      overlay={tooltip ? <Tooltip>{tooltipText}</Tooltip> : <div></div>}
    >
      <Button
        {...rest}
        type={type}
        variant="primary"
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoAddOutline size={18} />
        <span className="ml-2 text-uppercase">
          {text ? text : 'Tambah'}
        </span>
      </Button>
    </OverlayTrigger>
  )
}

export default CreateButton
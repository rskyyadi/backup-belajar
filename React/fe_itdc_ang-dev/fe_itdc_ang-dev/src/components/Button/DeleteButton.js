import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoTrashBinOutline
} from 'react-icons/io5'

const DeleteButton = ({
  text,
  type,
  size = 'sm',
  variant,
  disable,
  className,
  style,
  children,
  onClick,
  tooltip = true,
  tooltipText,
  tooltipPlacement,
  ...rest
}) => {
  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      overlay={tooltip ? <Tooltip>{tooltipText ?? 'Hapus data'}</Tooltip> : <div></div>}
    >
      <Button
        {...rest}
        type={type}
        variant="danger"
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoTrashBinOutline />
        {text && (
          <span className="ml-2 text-uppercase">
            {text}
          </span>
        )}
      </Button>
    </OverlayTrigger>
  )
}

export default DeleteButton
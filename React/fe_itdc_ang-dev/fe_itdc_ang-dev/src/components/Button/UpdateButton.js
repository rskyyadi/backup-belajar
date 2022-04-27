import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoPencilOutline
} from 'react-icons/io5'

const UpdateButton = ({
  text,
  type,
  size,
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
      overlay={tooltip ? <Tooltip>{tooltipText ?? 'Ubah data'}</Tooltip> : <div></div>}
    >
      <Button
        {...rest}
        type={type}
        variant="success"
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoPencilOutline />
        {text && (
          <span className="ml-2 text-uppercase">
            {text}
          </span>
        )}
      </Button>
    </OverlayTrigger>
  )
}

export default UpdateButton
import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoBackspaceOutline
} from 'react-icons/io5'

const BackButton = ({
  text,
  type,
  size,
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
        variant="outline-dark"
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoBackspaceOutline size={18} />
        <span className="ml-2 text-uppercase">
          {text ? text : 'Kembali'}
        </span>
      </Button>
    </OverlayTrigger>
  )
}

export default BackButton

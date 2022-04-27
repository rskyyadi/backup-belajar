import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoDocumentTextOutline
} from 'react-icons/io5'

const PrintButton = ({
  text,
  type,
  size,
  variant = 'info',
  disable,
  className,
  style,
  children,
  onClick,
  tooltip = true,
  tooltipText = 'Cetak data',
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
        variant={variant}
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoDocumentTextOutline />
        {text && (
          <span className="ml-2 text-uppercase">
            {text}
          </span>
        )}
      </Button>
    </OverlayTrigger>
  )
}

export default PrintButton
import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoDocumentTextOutline
} from 'react-icons/io5'

const ExportButton = ({
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
        variant="outline-success"
        onClick={onClick}
        disabled={disable}
        className={className}
        size={size}
        style={style}
      >
        <IoDocumentTextOutline size={18} />
        <span className="ml-2 text-uppercase">
          {text ? text : 'Export'}
        </span>
      </Button>
    </OverlayTrigger>
  )
}

export default ExportButton
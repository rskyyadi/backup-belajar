import React from "react"
import { 
  Button, 
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import {
  IoEyeOutline
} from 'react-icons/io5'

const ReadButton = ({
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
      overlay={tooltip ? <Tooltip>{tooltipText ?? 'Detail data'}</Tooltip> : <div></div>}
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
        <IoEyeOutline />
        {text && (
          <span className="ml-2 text-uppercase">
            {text}
          </span>
        )}
      </Button>
    </OverlayTrigger>
  )
}

export default ReadButton
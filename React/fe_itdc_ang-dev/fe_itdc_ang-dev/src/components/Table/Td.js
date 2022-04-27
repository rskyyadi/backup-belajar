import React from 'react'

const Td = ({ 
  children, 
  colSpan, 
  rowSpan, 
  className, 
  noPadding, 
  style,
  width, 
  fontSize,
  textRight,
  textCenter,
  ...rest
}) => {
  return (
    <td
      {...rest}
      width={width}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={`${noPadding ? 'p-0' : 'p-1'} ${className}`}
      style={{
        ...style,
        fontSize: fontSize ? fontSize : 13,
        textAlign: textRight 
          ? 'right' 
          : textCenter
            ? 'center'
            : 'left'
      }}
    >
      {children}
    </td>
  )
}

export default Td

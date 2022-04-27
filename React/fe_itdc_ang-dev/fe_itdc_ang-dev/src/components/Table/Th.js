import React from 'react'

const Th = ({
  children,
  colSpan,
  rowSpan,
  className,
  width,
  noPadding,
  style,
  fontSize,
  ...rest
}) => (
  <th
    {...rest}
    width={width}
    colSpan={colSpan}
    rowSpan={rowSpan}
    className={`${noPadding ? 'p-0' : 'p-2'} align-middle text-center ${className}`}
    style={{
      ...style,
      fontSize: fontSize ? fontSize : 14
    }}
  >
    {children}
  </th>
)

export default Th
import React from "react";

const ThFixed = ({
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
    className={`${noPadding ? 'p-0' : 'p-1'} align-middle text-center ${className}`}
    style={{
      ...style,
      fontSize: fontSize ? fontSize : 14,
      width: 20
    }}
  >
    {children}
  </th>
)

export default ThFixed
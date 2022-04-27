import React from 'react'
import RDatePicker from 'react-datepicker'

const DatePicker = ({
  label,
  selected,
  onChange,
  className,
  wrapperClassName,
  wrapperStyle,
  error,
  errorText,
  ...rest
}) => {
  return (
    <div className={`mb-2 d-flex flex-column ${wrapperClassName}`} style={{ ...wrapperStyle, paddingTop: '5px' }}>
      <small>{label}</small>
      <RDatePicker
        {...rest}
        selected={selected}
        onChange={onChange}
        onChangeRaw={(e) => e.preventDefault()}
        className={`form-control form-control-sm ${className} ${error && "is-invalid"}`}
      />
      <small className="text-danger pt-1">{error && errorText}</small>
    </div>
  )
}

export default DatePicker

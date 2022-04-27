import React from 'react'

const TextArea = ({ 
  label, 
  type, 
  name, 
  placeholder, 
  value, 
  rows, 
  error, 
  errorText, 
  onChange,
  className,
  wrapperClassName,
  style,
  wrapperStyle,
  noMargin, 
  disabled,
  ...rest
}) => {
  return (
    <div className={`${noMargin ? 'm-0' : 'mb-2'} ${wrapperClassName}`} style={wrapperStyle}>
      <small>{label}</small>
      <textarea
        {...rest}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        className={`form-control form-control-sm ${className} ${error && 'is-invalid'}`}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        style={style}
      />
      <div className="invalid-feedback">
        {errorText}
      </div>
    </div>
  )
}

export default TextArea
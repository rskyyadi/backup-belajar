import React from "react";

const Select = ({
  label,
  name,
  size,
  defaultValue,
  disabled,
  children,
  error,
  errorText,
  wrapperClassName,
  wrapperStyle,
  noMargin,
  onChange,
  style,
  ...rest
}) => {
  return (
    <div className={`${noMargin ? 'm-0' : 'mb-2'} ${wrapperClassName}`} style={wrapperStyle}>
      <small>{label}</small>
      <select
        {...rest}
        name={name}
        defaultValue={defaultValue}
        className={`custom-select custom-select-${size ?? 'sm'} ${error && "is-invalid"}`}
        onChange={onChange}
        disabled={disabled}
        style={style}
      >
        {children}
      </select>
      <div className="invalid-feedback">{errorText}</div>
    </div>
  );
};

export default Select;

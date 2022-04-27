const Checkbox = ({ 
  id, 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  className, 
  wrapperClassName,
  width, 
  height, 
  style,
  checked,
  ...rest
}) => {
  return (
    <div className={`custom-control custom-checkbox custom-control-inline ${wrapperClassName}`}>
      <input
        {...rest}
        width={width}
        height={height}
        type="checkbox"
        name={name}
        value={value}
        className={`custom-control-input ${className} ${error && 'is-invalid'}`}
        style={style}
        onChange={onChange}
        id={id}
        checked={checked}
      />
      <label className="custom-control-label" htmlFor={id}>{label}</label>
    </div>
  )
}

export default Checkbox

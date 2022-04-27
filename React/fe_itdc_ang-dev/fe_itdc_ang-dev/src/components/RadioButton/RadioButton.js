const RadioButton = ({
  id, 
  label, 
  name, 
  value, 
  checked,
  error, 
  onChange,
  className,
  wrapperClassName,
  ...rest
}) => {
  return (
    <div className={`custom-control custom-radio custom-control-inline ${wrapperClassName}`}>
      <input 
        {...rest}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        className={`custom-control-input ${error && 'is-invalid'} ${className}`} 
        onChange={onChange}
      />
      <label className="custom-control-label" htmlFor={id}>{label}</label>
    </div>
  )
}

export default RadioButton

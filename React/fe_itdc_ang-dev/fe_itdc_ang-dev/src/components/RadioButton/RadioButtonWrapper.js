const RadioButtonWrapper = ({
  label, 
  children,
  errorText,
  className,
  style,
  noMargin
}) => (
  <div 
    className={`${noMargin ? 'm-0' : 'mb-2'} d-flex flex-column ${className}`}
    style={style}
  >
    <label>
      <small>
        {label}
      </small>
    </label>
    <div>
      {children}
    </div>
    <small className="mt-1 text-danger">
      {errorText}
    </small>
  </div>
)

export default RadioButtonWrapper
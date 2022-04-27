const CheckboxWrapper = ({
  label, 
  errorText, 
  children,
  className,
  noMargin
}) => (
  <div className={`${noMargin ? 'm-0' : 'mb-2'} mb-2 d-flex flex-column ${className}`}>
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

export default CheckboxWrapper
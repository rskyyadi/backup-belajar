import SweetAlert from 'react-bootstrap-sweetalert'

const Alert = ({
  show, 
  onHide,
  onConfirm,
  type,
  title,
  text,
  confirmButtonText,
  confirmButtonVariant,
  confirmButtonClass,
  confirmButtonStyle,
  showCancelButton,
  cancelButtonText,
  cancelButtonVariant,
  cancelButtonClass,
  cancelButtonStyle,
  ...rest
}) => (
  <SweetAlert
    {...rest}
    type={type}
    title={title}
    onConfirm={onConfirm}
    onCancel={onHide}
    show={show}
    confirmBtnText={confirmButtonText}
    confirmBtnCssClass={confirmButtonClass}
    confirmBtnBsStyle={confirmButtonVariant}
    confirmBtnStyle={{...confirmButtonStyle, minWidth: 100}}
    showCancel={showCancelButton}
    cancelBtnText={cancelButtonText}
    cancelBtnBsStyle={cancelButtonVariant ? cancelButtonVariant : 'outline-secondary'}
    cancelBtnCssClass={cancelButtonClass}
    cancelBtnStyle={{...cancelButtonStyle, minWidth: 100}}
  >
    {text}
  </SweetAlert>
)

export default Alert
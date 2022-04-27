import {
  Alert as BSAlert,
  Spinner
} from 'react-bootstrap'

const Alert = ({show, variant, text, onClose, isLoading, showCloseButton, ...props}) => (
  <>
    {show && (
      <BSAlert 
        {...props}
        dismissible={showCloseButton}
        variant={variant}
        onClose={onClose}
      >
        {isLoading && (
          <Spinner 
            size="sm"
            animation="border"
            variant={variant} 
            className="mr-2 mb-1"
          />
        )}
        <span>
          {text}
        </span>
      </BSAlert>
    )}
  </>
)

export default Alert
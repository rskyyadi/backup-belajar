import {
  useState
} from 'react'
import {
  Editor
} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const TextEditor = ({label, placeholder, wrapperStyle, wrapperClassName, error, errorText, editorState, onEditorStateChange}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (  
    <div className={`mb-2 ${wrapperClassName}`} style={wrapperStyle}>
      <label>
        <small>
          {label}
        </small>
      </label>
      <Editor
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        wrapperClassName={`text-editor ${isFocused && 'focused'} ${error && 'is-invalid'}`}
        editorClassName="px-3"
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
      <small className="mt-1 text-danger">
        {errorText}
      </small>
    </div>
  )
}

export default TextEditor
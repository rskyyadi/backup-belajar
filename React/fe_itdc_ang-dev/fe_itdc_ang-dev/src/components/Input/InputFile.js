import React from "react";

const InputFile = ({ label, name, value, readOnly, error, errorText, onChange, accept }) => {
  return (
    <div className="mb-2">
      <small style={{ textTransform: "capitalize" }}>{label}</small>
      <input
        type="file"
        name={name}
        value={value}
        readOnly={readOnly}
        accept={accept}
        className={`form-control-file form-control-sm pl-0 ${error && "is-invalid"}`}
        onChange={onChange}
        readOnly={readOnly}
      />
      <div className="invalid-feedback">{errorText}</div>
    </div>
  );
};

export default InputFile;

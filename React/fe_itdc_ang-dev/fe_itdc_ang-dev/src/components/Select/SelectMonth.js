import React from "react";

const SelectMonth = ({
  label,
  name,
  defaultValue,
  disabled,
  error,
  errorText,
  onChange,
}) => {
  return (
    <div className="mb-3">
      <label>{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className={`custom-select ${error && "is-invalid"}`}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">Pilih bulan</option>
        <option value="1">Januari</option>
        <option value="2">Februari</option>
        <option value="3">Maret</option>
        <option value="4">April</option>
        <option value="5">Mei</option>
        <option value="6">Juni</option>
        <option value="7">Juli</option>
        <option value="8">Agustus</option>
        <option value="9">September</option>
        <option value="10">Oktober</option>
        <option value="11">November</option>
        <option value="12">Desember</option>
      </select>
      <div className="invalid-feedback">{errorText}</div>
    </div>
  );
};

export default SelectMonth;

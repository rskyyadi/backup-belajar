import React from 'react'
import {
  IoSearchOutline
} from 'react-icons/io5'

const InputSearch = ({ name, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="input-group input-group-merge mb-2">
        <div className="input-group-prepend">
          <span className="input-group-text bg-white" id="basic-addon-search2"><IoSearchOutline /></span>
        </div>
        <input
          type="text"
          className="form-control"
          name={name}
          placeholder="Cari..."
          onChange={onChange}
          value={value} />
      </div>
    </form>
  )
}

export default InputSearch

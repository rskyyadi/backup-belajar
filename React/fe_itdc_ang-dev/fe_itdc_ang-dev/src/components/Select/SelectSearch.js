import React from "react"
import { AsyncPaginate } from "react-select-async-paginate"

const SelectSearch = ({
  label,
  name,
  placeholder,
  isDisabled,
  defaultValue,
  loading,
  option,
  error,
  errorText,
  wrapperClassName,
  wrapperStyle,
  noMargin,
  onChange,
  ...rest
}) => {
  const options = option
  
  const loadOptions = async (search, prevOptions) => {
    let filteredOptions
    if (!search) {
      filteredOptions = options
    } else {
      const searchLower = search.toLowerCase()
  
      filteredOptions = options.filter(({ label }) =>
        label.toLowerCase().includes(searchLower)
      )
    }
  
    const hasMore = filteredOptions.length > prevOptions.length + 25
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 25
    )
  
    return {
      options: slicedOptions,
      hasMore
    }
  }

  return (
    <div className={`${noMargin ? 'm-0' : 'mb-2'} ${wrapperClassName}`} style={wrapperStyle}>
      <small>{label}</small>
      {loading ? (
        <AsyncPaginate
          {...rest}
          placeholder="Memuat data . . ."
          isDisabled={true}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 28,
              maxHeight: 31,
              fontSize: 14,
            }),
            valueContainer: (base) => ({
              ...base,
              paddingTop: 1,
              paddingLeft: 5,
              margin: 0,
            }),
            dropdownIndicator: (base) => ({
              ...base,
              padding: 0,
              paddingLeft: 5,
              paddingRight: 5,
            }),
            menu: (base) => ({
              ...base,
              fontSize: 13
            }),
          }}
        />
      ) : (
        <>
          <AsyncPaginate
            {...rest}
            name={name}
            loadOptions={loadOptions}
            placeholder={placeholder}
            onChange={onChange}
            classNamePrefix={error ? "react-select-invalid" : "react-select"}
            defaultValue={defaultValue}
            noOptionsMessage={() => "Tidak ada data"}
            loadingMessage={() => "Memuat data . . ."}
            isDisabled={isDisabled}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: 28,
                maxHeight: 31,
                fontSize: 14,
              }),
              valueContainer: (base) => ({
                ...base,
                paddingTop: 1,
                paddingLeft: 5,
                margin: 0,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: 0,
                paddingLeft: 5,
                paddingRight: 5,
              }),
              menu: (base) => ({
                ...base,
                fontSize: 13,
                zIndex: 10
              }),
            }}
          />
          <small className="text-danger">{errorText}</small>
        </>
      )}
    </div>
  )
}

export default SelectSearch
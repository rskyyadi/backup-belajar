const TableNumber = (page, dataLength, index) => {
  const tblNumber = page * dataLength + (index + 1) - dataLength

  return tblNumber
}

export default TableNumber
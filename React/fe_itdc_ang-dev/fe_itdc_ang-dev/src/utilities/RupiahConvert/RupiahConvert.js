const RupiahConvert = value => {

  const convertToRupiah = () => {
    let rupiah = ''
    const convert = value.toString().split('').reverse().join('')

    for(var i = 0; i < convert.length; i++) if(i%3 === 0) rupiah += convert.substr(i,3)+'.'

    return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
  }

  const convertToNumber = () => {
    return parseInt(value.replace(/,.*|[^0-9]/g, ''), 10)
  }

  return {
    detail: convertToRupiah(),
    default: convertToNumber()
  }
}

export default RupiahConvert
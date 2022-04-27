const DateConvert = (dateParams) => {
  const day = dateParams.getDay();
  const date = dateParams.getDate();
  const month = dateParams.getMonth();
  const year = dateParams.getFullYear();

  const newDate = date.toString().length < 2 ? `0${date}` : date;
  const checkMonth = month + 1;
  const newMonth = checkMonth.toString().length < 2 ? `0${checkMonth}` : checkMonth;

  const dayValue = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const monthValue = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return {
    detail: `${dayValue[day]}, ${date} ${monthValue[month]} ${year}`, // => Senin, 1 Januari 2000
    detailDay: `${dayValue[day]}`, // => Senin, Selasa, ...
    detailMonth: `${monthValue[month]}`, // => Januari, Februari, ...
    default: `${year}-${newMonth}-${newDate}`, // => 2000-01-01
    defaultDay: newDate, // => 01, 02, 03, ...
    defaultMonth: newMonth, // => 01, 02, ... 10, 11, 12
    defaultYear: year, // => 2000, 2001, 2002, ...
    defaultDMY: `${newDate}/${newMonth}/${year}`, // => 01/01/2000
    custom: `${newDate}/${newMonth}/${year}`, // => 01/01/2000
  };
};

export default DateConvert;

const InfoItemVertical = ({label, text, style, className}) => (
  <div className={`d-flex flex-column mb-2 ${className}`} style={style}>
      <small style={{fontSize: 12}}>{label}</small>
      <b style={{fontSize: 14}}>{text}</b>
  </div>
)

export default InfoItemVertical
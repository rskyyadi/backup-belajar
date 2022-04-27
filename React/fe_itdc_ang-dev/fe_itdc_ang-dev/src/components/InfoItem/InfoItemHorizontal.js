const InfoItemHorizontal = ({label, text, width, style, className}) => (
  <div 
    className={`d-flex align-items-top ${className}`} 
    style={style}
  >
      <div style={{width: width ? width : 180, fontSize: 14}}>
        {label}
      </div>
      <div className="pl-3 pr-2" style={{fontSize: 14}}>
        :
      </div>
      <div style={{fontSize: 14}}>
        {text}
      </div>
  </div>
)

export default InfoItemHorizontal
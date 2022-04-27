import React from "react";
import {
  OverlayTrigger,
  Tooltip
} from "react-bootstrap"
import ReactSwitch from "react-switch";

const Switch = ({ 
  id, 
  checked, 
  onChange,
  className,
  wrapperClassName,
  tooltip,
  tooltipCheckedText,
  tooltipUncheckedText,
  ...rest
}) => {
  return (
    <OverlayTrigger
      overlay={tooltip
        ? <Tooltip>
            {checked 
              ? tooltipCheckedText ?? 'Aktif' 
              : tooltipUncheckedText ?? 'Tidak aktif'
            }
          </Tooltip>
        : <div></div>
      }
    >
      <div className={`d-flex align-items-center ${wrapperClassName}`}>
        <ReactSwitch
          {...rest}
          id={id}
          checked={checked}
          onChange={onChange}
          draggable={false}
          onColor="#3B82F6"
          className={className}
        />
      </div>
    </OverlayTrigger>
  );
};

export default Switch;

import React from "react";

const Tr = ({ children, ...props }) => {
  return <tr {...props}>{children}</tr>;
};

export default Tr;

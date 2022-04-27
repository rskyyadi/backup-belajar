import React, { Component } from "react";
import { Table as CustomTable } from "components";

const HeadSearchSection = ({ children }) => (
  <div className="col-12 col-sm-6 col-md-6 order-2 order-sm-1 mt-3 mt-sm-0">
    {children}
  </div>
);

const HeadButtonSection = ({ children }) => (
  <div className="col-12 col-sm d-flex justify-content-center justify-content-sm-end order-1 order-sm-2">
    <div>{children}</div>
  </div>
);

const Head = ({ children }) => <div className="row mb-2">{children}</div>;

const Table = ({ children }) => <CustomTable>{children}</CustomTable>;

const BotNavSection = ({ children }) => (
  <div className="d-flex justify-content-between">{children}</div>
);

class CRUDLayout extends Component {
  static Table = Table;
  static Head = Head;
  static HeadSearchSection = HeadSearchSection;
  static HeadButtonSection = HeadButtonSection;
  static BotNavSection = BotNavSection;

  render() {
    return <section>{this.props.children}</section>;
  }
}

export default CRUDLayout;

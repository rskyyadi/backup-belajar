import React from "react";
import ReactPaginate from "react-paginate";
import { Row, Col } from "react-bootstrap";
import { Select } from "../../components";

const Pagination = ({
  dataLength,
  onDataLengthChange,
  currentPage,
  totalPage,
  onPaginationChange,
  dataPage,
  dataCount,
  dataNumber,
}) => {
  return (
    <Row class="overflow-scroll">
      <Col>
        <p className="mt-1">
          Menampilkan {dataNumber} - {dataCount < dataPage ? dataCount : dataPage} dari {dataCount}{" "}
          data
        </p>
      </Col>
      <Col>
        <ReactPaginate
          pageCount={totalPage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          containerClassName="pagination justify-content-center"
          pageLinkClassName="page-link"
          breakClassName="page-link"
          previousClassName="page-link"
          nextClassName="page-link"
          activeClassName="page-item active"
          disabledClassName="page-item disabled"
          previousLabel="&laquo;"
          nextLabel="&raquo;"
          onPageChange={onPaginationChange}
          initialPage={currentPage - 1}
          disableInitialCallback={true}
        />
      </Col>
      <Col className="d-flex justify-content-end">
        <p className="mr-4 mt-1">Tampilkan :</p>
        <Select defaultValue={dataLength} style={{ width: "150px" }} onChange={onDataLengthChange}>
          <option value="10">10 Data</option>
          <option value="20">20 Data</option>
          <option value="50">50 Data</option>
          <option value="100">100 Data</option>
        </Select>
      </Col>
    </Row>
  );
};

export default Pagination;

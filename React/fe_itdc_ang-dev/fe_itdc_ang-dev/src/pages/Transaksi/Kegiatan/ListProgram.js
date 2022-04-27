import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import {
  CRUDLayout,
  InputSearch,
  DataStatus,
  Alert,
  BackButton,
  Pagination,
  ActionButton,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
} from "components";
import { ProgramAnggaranApi } from "api";
import {
  TableNumber,
  DateConvert
} from 'utilities'

const ListProgram = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);

  // menampung value dari search form
  const [isSearching, setIsSearching] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  //Fetch Data
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataLength, setDataLength] = useState(10)
  const [dataCount, setDataCount] = useState(0)

  // menampilkan alert
  const [showAlert, setShowAlert] = useState(false);

  // configurasi alert
  const [alertConfig, setAlertConfig] = useState({
    variant: "primary",
    text: "",
  });

  const history = useHistory();

  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setIsSearching(false);
    setShowAlert(false)

    // request data ke server
    Axios.all([ProgramAnggaranApi.getPage(page, dataLength, searchKey)])
      .then(
        Axios.spread((programAnggaran) => {
          setData(programAnggaran.data.data);
          setTotalPage(programAnggaran.data.total_page);
          setDataCount(programAnggaran.data.data_count);
        })
      )
      .catch(() => {
        setAlertConfig({
          variant: "danger",
          text: "Data gagal dimuat",
        });
        setShowAlert(true)
      })
      .finally(() => {
        if (searchKey != "") {
          setAlertConfig({
            variant: "primary",
            text: `Hasil Pencarian : ${searchKey}`,
          })
          setShowAlert(true)
        }
        setIsLoading(false)
      });
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("List Program");

    // jalankan function request data ke server
    getData();

    return () => {
      setIsLoading(false);
      setIsSearching(false);
    };
  }, [setNavbarTitle, page, dataLength, searchKey]);

  const Table = () => (
    <>
      <CRUDLayout.Table>
        <THead>
          <Tr>
            <ThFixed>No</ThFixed>
            <ThFixed>Aksi</ThFixed>
            <Th>Tgl. Program</Th>
            <Th>No. Program</Th>
            <Th>Nama Program</Th>
            <Th>Unit Organisasi</Th>
            <Th>Penanggung Jawab</Th>
            <Th>Periode Mulai</Th>
            <Th>Periode Selesai</Th>
          </Tr>
        </THead>
        <TBody>
          {data.map((val, index) => {
            return (
              <Tr key={index}>
                <TdFixed textCenter>{TableNumber(page, dataLength, index)}</TdFixed>
                <TdFixed>
                  <div className="d-flex justify-content-center">
                    <ActionButton
                      size="sm"
                      onClick={() =>
                        history.push(
                          "/anggaran/transaksi/kegiatan/tambah-kegiatan/" + val.id_program
                        )
                      }
                    >
                      Kegiatan
                    </ActionButton>
                  </div>
                </TdFixed>
                <Td>{val.tgl_program ? DateConvert(new Date(val.tgl_program)).defaultDMY : ''}</Td>
                <Td>{val.no_program ?? '-'}</Td>
                <Td>{val.nama_program ?? '-'}</Td>
                <Td>{val.nama_unit_organisasi ?? '-'}</Td>
                <Td>{val.nama_karyawan ?? '-'}</Td>
                <Td>{val.periode_mulai ? `${DateConvert(new Date(val.periode_mulai)).detailMonth} ${DateConvert(new Date(val.periode_mulai)).defaultYear}` : '-'}</Td>
                <Td>{val.periode_selesai ? `${DateConvert(new Date(val.periode_selesai)).detailMonth} ${DateConvert(new Date(val.periode_selesai)).defaultYear}` : '-'}</Td>
              </Tr>
            );
          })}
        </TBody>
      </CRUDLayout.Table>
      {!isSearching && (
        <Pagination
          dataLength={dataLength}
          dataNumber={page * dataLength - dataLength + 1}
          dataPage={dataCount < dataLength ? dataCount : page * dataLength}
          dataCount={dataCount}
          currentPage={page}
          totalPage={totalPage}
          onPaginationChange={({ selected }) => setPage(selected + 1)}
          onDataLengthChange={(e) => {
            setPage(1)
            setDataLength(e.target.value)
          }}
        />
      )}
    </>
  );

  return (
    <CRUDLayout>
      {/* Head */}
      <CRUDLayout.Head>
        {/* Search Section */}
        <CRUDLayout.HeadSearchSection>
          <Row>
            <Col md="8">
              <InputSearch
                onChange={(e) => {
                  setTimeout(() => {
                    setSearchKey(e.target.value)
                    setPage(1)
                  }, 1000);
                }}
                onSubmit={(e) => e.preventDefault()}
              />
            </Col>
          </Row>
        </CRUDLayout.HeadSearchSection>

        {/* Button Section */}
        <CRUDLayout.HeadButtonSection>
          <BackButton onClick={() => history.push('/anggaran/transaksi/kegiatan')} />
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>

      {/* ALert */}
      <Alert
        show={showAlert}
        showCloseButton={true}
        variant={alertConfig.variant}
        text={alertConfig.text}
        onClose={() => {
          setShowAlert(false);
          getData();
        }}
      />

      {/* Table Section */}
      {
        // cek apakah data sedang dimuat (loading)
        isLoading === true ? (
          // loading
          <DataStatus loading={true} text="Memuat data..." />
        ) : // Cek apakah ada data
          data 
          ? data.length > 0 
            ? <Table /> 
            : <DataStatus text="Tidak ada data" />
          : <DataStatus text="Server error" />
      }
    </CRUDLayout>
  );
};

export default ListProgram;

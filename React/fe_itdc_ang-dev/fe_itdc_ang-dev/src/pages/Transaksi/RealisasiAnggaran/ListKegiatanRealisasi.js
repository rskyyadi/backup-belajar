import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import {
  CRUDLayout,
  InputSearch,
  UpdateButton,
  BackButton,
  ReadButton,
  DataStatus,
  Alert,
  DeleteModal,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
  Pagination
} from "components";
import { DateConvert, TableNumber } from "utilities";
import { RealisasiAnggaranApi } from "api";

const ListKegiatanRealisasi = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);
  // menampung value dari search form
  const [searchKey, setSearchKey] = useState("");
  const [isSearching, setIsSearching] = useState(false)
  //Fetch Data
  const [dataKegiatanRealisasi, setDataKegiatanRealisasi] = useState([]);
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [dataLength, setDataLength] = useState(10)
  // menampilkan alert
  const [showAlert, setShowAlert] = useState(false);
  // configurasi alert
  const [alertConfig, setAlertConfig] = useState({
    variant: "primary",
    text: "",
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedChangeStatusId, setSelectedChangeStatusId] = useState("");

  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setSearchKey("");

    RealisasiAnggaranApi.getListKegiatanRealisasi(page, dataLength)
      .then(({ data }) => {
        setDataKegiatanRealisasi(data.data)
        setTotalPage(data.total_page)
      })
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };

  // ubah status kegiatan
  const changeStatusHandler = () => {
    RealisasiAnggaranApi.changeStatusClose({ id_kegiatan: selectedChangeStatusId })
      .then(() => {
        setShowAlert(true);
        setAlertConfig({
          variant: "primary",
          text: "Ubah status berhasil",
        });
      })
      .catch((err) => {
        setShowAlert(true);
        setAlertConfig({
          variant: "danger",
          text: `Ubah status gagal (${err})`,
        });
      })
      .finally(() => {
        setShowStatusModal(false);
        getData();
      });
  };

  // request search data dari server
  const searchData = (e) => {
    // mencegah terjadinya page reload
    e.preventDefault();

    // nilai dari form search
    const key = searchKey;

    // lakukan search data ke server pada kode dibawah [
    // ***
    // ***
    // ***
    // ]
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // menampilkan alert pencarian
    setAlertConfig({
      variant: "primary",
      text: `Hasil dari pencarian: ${key}`,
    });
    setShowAlert(true);
  };

  const Table = () => (
    <>
      <CRUDLayout.Table>
        <THead>
          <Tr>
            <ThFixed>No</ThFixed>
            <ThFixed>Aksi</ThFixed>
            <ThFixed>Baseline</ThFixed>
            <Th style={{width:'20%'}}>Tanggal Kegiatan</Th>
            <Th>Nama Kegiatan</Th>
            <Th>No Kegiatan</Th>
            <Th>Unit Organisasi</Th>
          </Tr>
        </THead>
        <TBody>
          {dataKegiatanRealisasi.map((val, index) => (
            <Tr key={index}>
              <TdFixed>{TableNumber(page, dataLength, index)}</TdFixed>
              <TdFixed>
                <div className="d-flex justify-content-center">  
                  <Link to={`/anggaran/transaksi/realisasi/tambah-realisasi/${val.id_kegiatan}`}>  
                    <Button size="sm" className="mt-1" variant="primary">Realisasi</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="m-1"
                    onClick={() => {
                      setShowStatusModal(true);
                      setSelectedChangeStatusId(val.id_kegiatan);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </TdFixed>
              <TdFixed>
                {val.level_baseline} 
                {/* {(!val.status_realisasi) && (
                  <UpdateButton />
                )} */}
              </TdFixed>
              <Td style={{fontSize: '0.8rem'}}>
                <strong>{DateConvert(new Date(val.tgl_mulai)).detail}</strong> sd <strong>{DateConvert(new Date(val.tgl_selesai)).detail}</strong>
              </Td>
              <Td>{val.nama_kegiatan}</Td>
              <Td>{val.no_kegiatan}</Td>
              <Td>{val.nama_unit_organisasi}</Td>
            </Tr>
          ))}
        </TBody>
      </CRUDLayout.Table>
      {!isSearching && (
        <Pagination 
          dataLength={dataLength}
          onDataLengthChange={e => setDataLength(e.target.value)}
          currentPage={page}
          totalPage={totalPage} 
          onPaginationChange={({selected}) => setPage(selected + 1)}
        />
      )}
    </>
  );

  const ChangeStatusModal = () => (
    <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
      <Modal.Header>
        <p className="m-0">Konfirmasi Status Kegiatan</p>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center mb-3">
          Apakah anda yakin mengubah status kegiatan realisasi menjadi{" "}
          <b className="text-danger">CLOSE</b> ?
        </h5>
        <div className="text-center">
          <Button
            variant="outline-secondary"
            className="m1"
            onClick={() => setShowStatusModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" className="m-1" onClick={changeStatusHandler}>
            Ubah Status
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  useEffect(() => {
    setNavbarTitle("Realisasi Anggaran");
    // jalankan function request data ke server
    getData();
  }, [setNavbarTitle, page, dataLength]);

  return (
    <CRUDLayout>
      {/* Head */}
      <CRUDLayout.Head>
        {/* Search Section */}
        <CRUDLayout.HeadSearchSection>
          {/* Search Form */}
          <InputSearch
            placeholder="Cari Kegiatan"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onSubmit={searchData}
          />
        </CRUDLayout.HeadSearchSection>

        {/* Button Section */}
        <CRUDLayout.HeadButtonSection>
          {/* Button Kembali */}
          <Link to="/anggaran/transaksi/realisasi">
            <BackButton />
          </Link>
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>

      {/* ALert */}
      <Alert
        show={showAlert}
        showCloseButton={true}
        variant={alertConfig.variant}
        text={alertConfig.text}
        onClose={() => setShowAlert(false)}
      />

      {/* Table Section */}
      {
        // cek apakah data sedang dimuat (loading)
        isLoading === true ? (
          // loading
          <DataStatus loading={true} text="Memuat data..." />
        ) : // Cek apakah ada data
        dataKegiatanRealisasi.length > 0 ? (
          // Ada data
          <Table />
        ) : (
          // Tidak ada data
          <DataStatus text="Tidak ada data" />
        )
      }
      <ChangeStatusModal />
    </CRUDLayout>
  );
};

export default ListKegiatanRealisasi;

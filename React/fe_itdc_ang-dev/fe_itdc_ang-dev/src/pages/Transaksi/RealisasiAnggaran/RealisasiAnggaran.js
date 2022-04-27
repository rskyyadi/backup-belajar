import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { IoAddOutline } from "react-icons/io5";
import {
  CRUDLayout,
  InputSearch,
  ExportButton,
  CreateButton,
  DeleteButton,
  UpdateButton,
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

const RealisasiAnggaran = ({ setNavbarTitle }) => {
  const history = useHistory();
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false)
  // menampung value dari search form
  const [searchKey, setSearchKey] = useState("");
  //Fetch Data
  const [dataKegiatanRealisasi, setDataKegiatanRealisasi] = useState([]);
  const [page, setPage] = useState(1)
  const [dataLength, setDataLength] = useState(10)
  const [totalPage, setTotalPage] = useState(1)

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

    RealisasiAnggaranApi.getRealisasi(page, dataLength)
      .then(({ data }) => {
        console.log(data)
        setDataKegiatanRealisasi(data.data)
        setTotalPage(data.total_page)
      })
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };

  // ubah status kegiatan
  const changeStatusHandler = () => {
    RealisasiAnggaranApi.changeStatusOpen({ id_kegiatan: selectedChangeStatusId })
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
            <Th>Status</Th>
            <Th style={{width:'15%'}}>Tanggal Selesai</Th>
            <Th>Nama Kegiatan</Th>
            <Th>No Kegiatan</Th>
            <Th>Unit Organisasi</Th>
            <ThFixed>Baseline</ThFixed>
          </Tr>
        </THead>
        <TBody>
          {dataKegiatanRealisasi.map((val, index) => (
            <Tr key={index}>
              <Td>{TableNumber(page, dataLength, index)}</Td>
              <Td>
                <div className="d-flex justify-content-center">
                    <ReadButton 
                      onClick={() => history.push("/anggaran/transaksi/realisasi/detail/" + val.id_kegiatan)}
                    />
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="m-1"
                      onClick={() => {
                        setShowStatusModal(true)
                        setSelectedChangeStatusId(val.id_kegiatan)
                      }}
                    >
                      Open
                    </Button>
                  </div>
              </Td>
              <Td>{val.status ? "Sudah Terjunal": "Belum Di Jurnal"}</Td>
              <Td>{DateConvert(new Date(val.tgl_selesai_terealisasi)).detail}</Td>
              <Td>{val.nama_kegiatan}</Td>
              <Td>{val.no_kegiatan}</Td>
              <Td>{val.nama_unit_organisasi}</Td>
              <TdFixed>{val.level_baseline}</TdFixed>
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
          <b className="text-success">OPEN</b> ?
        </h5>
        <div className="text-center">
          <Button
            variant="outline-secondary"
            className="m1"
            onClick={() => setShowStatusModal(false)}
          >
            Batal
          </Button>
          <Button variant="success" className="m-1" onClick={changeStatusHandler}>
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
          {/* Button Export */}
          <ExportButton />
          {/* Button Tambah */}
          <Link to="/anggaran/transaksi/realisasi/list-kegiatan">
            <Button variant="primary" className="mb-1 ml-2">
              <IoAddOutline size="18" className="mr-2" />
              TAMBAH REALISASI
            </Button>
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

      {/* Modal */}
      <ChangeStatusModal />
      {/* <TambahModal /> */}
      {/* <HapusModal /> */}
    </CRUDLayout>
  );
};

export default RealisasiAnggaran;

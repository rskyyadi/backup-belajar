import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Axios from "axios";
import {
  CRUDLayout,
  InputSearch,
  ActionButton,
  CreateButton,
  DeleteButton,
  UpdateButton,
  ReadButton,
  DataStatus,
  Alert,
  DeleteModal,
  Pagination,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
} from "components";
import { KegiatanAnggaranApi } from "api";
import { DateConvert, TableNumber } from "utilities";
import { Row, Col, ButtonGroup } from 'react-bootstrap';

const Kegiatan = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);

  // menampung value dari search form
  const [isSearching, setIsSearching] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  // menangani modal hapus data
  const [isDeleteData, setIsDeleteData] = useState(false);

  const history = useHistory();
  const location = useLocation()

  // data
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataLength, setDataLength] = useState(10);
  const [dataCount, setDataCount] = useState(0);
  // menampung data yang akan dihapus
  const [deleteData, setDeleteData] = useState([]);

  // menampilkan alert
  const [showAlert, setShowAlert] = useState(false);
  // configurasi alert
  const [alertConfig, setAlertConfig] = useState({
    variant: "primary",
    text: "",
  });

  const checkAlert = () => {
    const locationState = location.state

    if (locationState) {
      if (locationState.showAlert) {
        setShowAlert(true)
        setAlertConfig({
          text: locationState.alertText,
          variant: locationState.alertVariant
        })
      }
    }
  }

  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setIsSearching(false);

    // request data ke server
    Axios.all([
      KegiatanAnggaranApi.getPage(page, dataLength, searchKey),
      // KegiatanAnggaranApi.getFormEdit(),
    ])
      .then(
        Axios.spread((KegiatanAnggaran) => {
          setData(KegiatanAnggaran.data.data);
          setTotalPage(KegiatanAnggaran.data.total_page);
          setDataCount(KegiatanAnggaran.data.data_count);
          // setDataDetailKegiatan(DetailKegiatan.data.data);
        })
      )
      .catch(() => {
        setAlertConfig({
          variant: "danger",
          text: "Data gagal dimuat",
        });
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Kegiatan");

    // jalankan function request data ke server
    getData();
    checkAlert()
    return () => {
      setIsLoading(false);
      setIsSearching(false);
    };
  }, [setNavbarTitle, page, dataLength, searchKey]);

  // Modal Hapus
  const HapusModal = () => {
    // id dari data yang ingin dihapus
    const idData = deleteData.id_kegiatan;
    const value = { id_kegiatan: idData };
    // menangani delete button loading
    const [btnLoading, setBtnLoading] = useState(false);

    // request hapus data ke server

    const deleteDataHandler = () => {
      // set delete button loading
      setBtnLoading(true);
      KegiatanAnggaranApi.delete(value)
        .then(() => {
          setAlertConfig({
            variant: "primary",
            text: "Hapus data berhasil!",
          });
        })
        .catch((err) => {
          setAlertConfig({
            variant: "danger",
            text: `Hapus data gagal! (${err?.response?.data?.message})`,
          });
        })
        .finally(() => {
          // menampilkan alert
          setShowAlert(true);
          // menutup hapus modal
          setIsDeleteData(false);
          // request data baru ke server
          getData();
        });
    };

    return (
      <DeleteModal
        show={isDeleteData}
        onHide={() => setIsDeleteData(false)}
        loading={btnLoading}
        onConfirm={deleteDataHandler}
      >
        Nama Kegiatan : {deleteData.nama_kegiatan}
      </DeleteModal>
    );
  };

  const generateStatusApproval = status => {
    if (status?.toUpperCase() === 'APP') {
      return 'APPROVE'
    } else if (status?.toUpperCase() === 'REJ') {
      return 'REJECT'
    } else if (status?.toUpperCase() === 'REV') {
      return 'REVISI'
    } 

    return 'PENDING'
    
  }

  const Table = () => {
    return (
      <>
        <CRUDLayout.Table>
          <THead>
            <Tr className="text-center">
              <ThFixed>No</ThFixed>
              <ThFixed>Aksi</ThFixed>
              <Th>Tanggal Pengajuan</Th>
              <Th>Nama Kegiatan</Th>
              <Th>Program</Th>
              <Th>Status Approval</Th>
            </Tr>
          </THead>
          <TBody>
            {data.map((val, index) => (
              <Tr key={index}>
                <TdFixed textCenter>{TableNumber(page, dataLength, index)}</TdFixed>
                <TdFixed>
                  <ButtonGroup size="sm">
                    <ReadButton
                      onClick={() => {
                        history.push(
                          `/anggaran/transaksi/kegiatan/detail-kegiatan/${val.id_kegiatan}`
                        );
                      }}
                    />
                    <UpdateButton
                      onClick={() =>
                        history.push(
                          `/anggaran/transaksi/kegiatan/edit-kegiatan/${val.id_kegiatan}`
                        )
                      }
                    />
                    {/* <DeleteButton
                      onClick={() => {
                        setDeleteData(val);
                        setIsDeleteData(true);
                      }}
                    /> */}
                  </ButtonGroup>
                </TdFixed>
                <TdFixed>{val.tgl_approval ? DateConvert(new Date(val.tgl_approval)).defaultDMY : "-"}</TdFixed>
                <Td>{val.nama_kegiatan}</Td>
                <Td>{val.nama_program}</Td>
                <Td>{generateStatusApproval(val.status_approval)}</Td>
              </Tr>
            ))}
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
  };

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
          <CreateButton onClick={() => history.push("/anggaran/transaksi/kegiatan/list-program")} />
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
          data?.length > 0 ? (
            // Ada data
            <Table />
          ) : (
            // Tidak ada data
            <DataStatus text="Tidak ada data" />
          )
      }
      <HapusModal />
    </CRUDLayout>
  );
};

export default Kegiatan;

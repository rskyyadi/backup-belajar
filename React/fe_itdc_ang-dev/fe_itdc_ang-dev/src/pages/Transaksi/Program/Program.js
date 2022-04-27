import React, { useState, useEffect } from "react";
import { Button, ButtonGroup, Col, ModalBody, ModalFooter, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import {
  CRUDLayout,
  InputSearch,
  DataStatus,
  Alert,
  Pagination,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
  CreateButton,
  ReadButton,
  UpdateButton,
  DeleteButton,
  DeleteModal as ModalDelete
} from "components";
import { 
  ProgramAnggaranApi 
} from "api";
import {
  DateConvert,
  TableNumber
} from 'utilities'
import {
  FormModal,
  DetailModal
} from './Section'

const ListProgram = ({ setNavbarTitle }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataLength, setDataLength] = useState(10)
  const [dataCount, setDataCount] = useState(0)
  const [processedData, setProcessedData] = useState({})
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: "primary",
    text: "",
  })
  const [modalConfig, setModalConfig] = useState({
    show: false,
    type: '' //create, read, update, delete
  })

  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setIsSearching(false);

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
          show: true,
          variant: "danger",
          text: "Data gagal dimuat",
        });
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  const generateStatusApproval = (status) => {
    const newStatus = status?.toUpperCase()
    if (newStatus === "REJ") {
      return "REJECTED"
    }

    if (newStatus === "REV") {
      return "REVISI"
    }

    if (newStatus === "APP") {
      return "APPROVED"
    }

    if (newStatus === "VER") {
      return "VERIFIED"
    }

    return "PENDING"
  }

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
            {/* <Th>Periode Mulai</Th>
            <Th>Periode Selesai</Th> */}
            <Th>Status Approval</Th>
          </Tr>
        </THead>
        <TBody>
          {data.map((val, index) => {
            return (
              <Tr key={index}>
                <TdFixed textCenter>{TableNumber(page, dataLength, index)}</TdFixed>
                <TdFixed>
                  <ButtonGroup size="sm">
                    <ReadButton 
                      onClick={() => {
                        setProcessedData(val)
                        setModalConfig({
                          show: true,
                          type: 'read'
                        })
                      }}
                    />
                    {(val.status_approval === "PEN" || val.status_approval === "REV" || !val.status_approval) && (
                      <UpdateButton 
                        onClick={() => {
                          setProcessedData(val)
                          setModalConfig({
                            show: true,
                            type: 'update'
                          })
                        }}
                      />
                    )}
                    {/* <DeleteButton 
                      onClick={() => {
                        setProcessedData(val)
                        setModalConfig({
                          show: true,
                          type: 'delete'
                        })
                      }}
                    /> */}
                  </ButtonGroup>
                </TdFixed>
                <Td>{val.tgl_program ? DateConvert(new Date(val.tgl_program)).defaultDMY : ''}</Td>
                <Td>{val.no_program ?? '-'}</Td>
                <Td>{val.nama_program ?? '-'}</Td>
                <Td>{val.nama_unit_organisasi ?? '-'}</Td>
                <Td>{val.nama_karyawan ?? '-'}</Td>
                {/* <Td>{val.periode_mulai ? `${DateConvert(new Date(val.periode_mulai)).detailMonth} ${DateConvert(new Date(val.periode_mulai)).defaultYear}` : '-'}</Td>
                <Td>{val.periode_selesai ? `${DateConvert(new Date(val.periode_selesai)).detailMonth} ${DateConvert(new Date(val.periode_selesai)).defaultYear}` : '-'}</Td> */}
                <Td>{generateStatusApproval(val.status_approval)}</Td>
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
  
  const DeleteModal = () => {
    const [isDeleting, setIsDeleting] = useState(false)

    const onDeleteHandler = () => {
      setIsDeleting(true)

      ProgramAnggaranApi.delete(processedData.id_program)
        .then(() => {
          setAlertConfig({
            show: true,
            variant: 'primary',
            text: 'Data berhasil dihapus!'
          })
        })
        .catch(() => {
          setAlertConfig({
            show: true,
            variant: 'danger',
            text: 'Data gagal dihapus!'
          })
        })
        .finally(() => {
          setIsDeleting(false)
          setModalConfig({
            ...modalConfig,
            show: false
          })
        })
    }

    return (
      <ModalDelete 
        show={modalConfig.show && modalConfig.type === 'delete'}
        title="Program"
        loading={isDeleting}
        onHide={() => setModalConfig({
          ...modalConfig,
          show: false
        })}
        onConfirm={onDeleteHandler}
      >
        Apakah anda yakin menghapus data program dengan nama: {processedData.nama_program}
      </ModalDelete>
    )
  }

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
          <CreateButton onClick={() => setModalConfig({
            show: true,
            type: 'create'
          })} />
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>
      
      {/* ALert */}
      <Alert
        show={alertConfig.show}
        showCloseButton={true}
        variant={alertConfig.variant}
        text={alertConfig.text}
        onClose={() => setAlertConfig({
          ...alertConfig,
          show: false
        })}
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
              ?  <Table />
              : <DataStatus text="Tidak ada data" />
              
            : <DataStatus text="Server error" />
      }

      {/* Modal */}
      {modalConfig.show && modalConfig.type !== 'delete' && modalConfig.type !== 'read' &&
        <FormModal
          modalConfig={modalConfig}
          processedData={processedData}
          setModalConfig={setModalConfig}
          setAlertConfig={setAlertConfig}
          getData={getData}
        />
      }
      {modalConfig.show && modalConfig.type === 'read' &&
        <DetailModal 
          processedData={processedData}
          modalConfig={modalConfig}
          setModalConfig={setModalConfig}
        />
      }
      {modalConfig.show && modalConfig.type === 'delete' &&
        <DeleteModal />
      }
    </CRUDLayout>
  );
};

export default ListProgram;

import React, { 
  useState, 
  useEffect 
} from "react"
import { 
  useHistory, 
  useLocation 
} from "react-router-dom"
import { 
  Row, 
  Col, 
  ButtonGroup
} from "react-bootstrap"
import {
  IoAddOutline,
  IoEyeOutline
} from 'react-icons/io5'
import _ from "lodash"
import {
  CRUDLayout,
  Alert,
  DataStatus,
  ActionButton,
  BackButton,
  UpdateButton,
  ReadButton,
  InputSearch,
  Pagination,
  Table,
  Th,
  Td,
  ThFixed,
  TdFixed,
  CreateButton,
  Select
} from "components"
import { 
  DateConvert, 
  TableNumber 
} from "utilities"
// import { 
//   KegiatanApi
// } from "api"

const ListKegiatanSubKegiatan = ({ setNavbarTitle }) => {
  const history = useHistory()
  const location = useLocation()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataKegiatan, setDataKegiatan] = useState([1])
  const [paginationConfig, setPaginationConfig] = useState({
    page: "1",
    dataLength: "10",
    totalPage: "1",
    dataCount: "0",
  })
  const [searchConfig, setSearchConfig] = useState({
    status: false,
    key: "",
  })
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: "primary",
    text: "",
  })

  const getInitialData = () => {
    setIsPageLoading(false)

    // const query = statusProgress 
    // ? {
    //     q: searchConfig.key,
    //     page: paginationConfig.page,
    //     per_page: paginationConfig.dataLength,
    //     status_progress: statusProgress
    //   } 
    // : {
    //     q: searchConfig.key,
    //     page: paginationConfig.page,
    //     per_page: paginationConfig.dataLength
    //   }

    // KegiatanApi.get(query)
    //   .then(({ data }) => {
    //     setDataKegiatan(data.data)
    //     setPaginationConfig({
    //       ...paginationConfig,
    //       dataCount: data.data_count,
    //       totalPage: data.total_page,
    //     })
    //   })
    //   .catch((err) => {
    //     setAlertConfig({
    //       show: true,
    //       variant: "danger",
    //       text: "Data gagal dimuat!",
    //     })
    //   })
    //   .finally(() => setIsPageLoading(false))
  }

  const checkAlert = () => {
    const locationState = location.state

    if (locationState) {
      if (locationState.alert) {
        setAlertConfig({
          show: locationState.alert.show,
          text: locationState.alert.text,
          variant: locationState.alert.variant,
        })
      }
    }
  }

  const onInputSearchChange = (e) => {
    const key = e.target.value

    setSearchConfig({
      ...searchConfig,
      key: e.target.value,
    })
    setPaginationConfig({
      page: "1",
      dataLength: "10",
      totalPage: "1",
      dataCount: "0",
    })
    setAlertConfig({
      show: key ? true : false,
      variant: "primary",
      text: "Hasil dari pencarian: " + key,
    })
  }

  const checkUbah = (data) => {
    const newStatus = data?.status_progress?.toUpperCase()

    if (newStatus === 'OPEN') {
      return true
    }

    return false
  }

  const generateStatusApproval = (data) => {
    const newStatus = data?.status_progress?.toUpperCase()
    if (newStatus === "ON PROGRESS") {
      return (
        <div className="d-flex flex-column">
          <span className="text-success">ON PROGRESS</span>
          <span className="text-success">{data.tgl_mulai_Kegiatan}</span>
        </div>
      )
    }

    if (newStatus === "CLOSE") {
      return (
        <div className="d-flex flex-column">
          <span className="text-danger">CLOSED</span>
          <span className="text-danger">{data.tgl_selesai_Kegiatan}</span>
        </div>
      )
    }

    return (
      <div className="d-flex flex-column">
        <span className="text-primary">PENDING</span>
        <span className="text-primary">{data.tgl_selesai_Kegiatan}</span>
      </div>
    )
  }
  

  useEffect(() => {
    setNavbarTitle("List Kegiatan")
    getInitialData()
    checkAlert()

    return () => {
      setIsPageLoading(false)
    }
  }, [
    setNavbarTitle,
    searchConfig.key,
    paginationConfig.page,
    paginationConfig.dataLength,
  ])

  const PageContent = () => {
    const DataTable = () => (
      <Table>
        <thead>
          <tr>
            <ThFixed>No</ThFixed>
            <Th noPadding width={70}>Tgl. Kegiatan</Th>
            <Th noPadding width={80}>Kode. Kegiatan</Th>
            <Th>Nama Kegiatan</Th>
            <Th>Program</Th>
            <Th>Penanggung Jawab</Th>
            <Th>Periode Kegiatan</Th>
            <ThFixed>Aksi</ThFixed>
          </tr>
        </thead>
        <tbody>
          {dataKegiatan.map((val, index) => (
            <tr key={index}>
              <Td textCenter>{TableNumber(paginationConfig.page, paginationConfig.dataLength, index)}</Td>
              <Td>{val.tgl_kegiatan ? DateConvert(new Date(val.tgl_kegiatan)).defaultDMY : "-"}</Td>
              <Td>{val.no_kegiatan ?? "-"}</Td>
              <Td>{val.nama_kegiatan ?? "-"}</Td>
              <Td>{val.nama_program ?? "-"}</Td>
              <Td>{val.nama_karyawan ?? "-"}</Td>
              <Td>{val.periode_mulai ?? '-'} sd {val.periode_selesai ?? '-'}</Td>
              <Td>
                <ButtonGroup size="sm">
                  <ReadButton variant="secondary" />
                  <ActionButton
                    tooltip
                    tooltipText="Tambah Sub Kegiatan"
                    onClick={() => history.push('/anggaran/transaksi/sub-kegiatan/tambah/' + val.id_kegiatan)}
                  >
                    <IoAddOutline />
                  </ActionButton>
                </ButtonGroup>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    )

    if (!dataKegiatan || dataKegiatan.length < 1) {
      return <DataStatus text="Tidak ada data" />
    }

    return (
      <>
        <DataTable />
        {!searchConfig.status && (
          <Pagination
            dataLength={paginationConfig.dataLength}
            dataNumber={
              paginationConfig.page * paginationConfig.dataLength - paginationConfig.dataLength + 1
            }
            dataPage={
              paginationConfig.dataCount < paginationConfig.dataLength
                ? paginationConfig.dataCount
                : paginationConfig.page * paginationConfig.dataLength
            }
            dataCount={paginationConfig.dataCount}
            currentPage={paginationConfig.page}
            totalPage={paginationConfig.totalPage}
            onPaginationChange={({ selected }) =>
              setPaginationConfig({
                ...paginationConfig,
                page: selected + 1,
              })
            }
            onDataLengthChange={(e) =>
              setPaginationConfig({
                ...paginationConfig,
                page: 1,
                dataLength: e.target.value,
              })
            }
          />
        )}
      </>
    )
  }

  return (
    <CRUDLayout>
      {/* Head Section */}
      <CRUDLayout.Head>
        <CRUDLayout.HeadSearchSection>
          <Row className="mb-2">
            <Col md={8}>
              <InputSearch value={searchConfig.key} onChange={onInputSearchChange} />
            </Col>
          </Row>
        </CRUDLayout.HeadSearchSection>
        <CRUDLayout.HeadButtonSection>
          <BackButton onClick={(() => history.goBack())} />
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>

      {/* Alert */}
      <Alert
        show={alertConfig.show}
        variant={alertConfig.variant}
        text={alertConfig.text}
        showCloseButton={true}
        onClose={() =>
          setAlertConfig({
            ...alertConfig,
            show: false,
          })
        }
      />

      {/* Content */}
      {isPageLoading ? <DataStatus loading={true} text="Memuat data . . ." /> : <PageContent />}
    </CRUDLayout>
  )
}

export default ListKegiatanSubKegiatan

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
  IoEyeOutline
} from 'react-icons/io5'
import _ from "lodash"
import {
  CRUDLayout,
  Alert,
  DataStatus,
  ActionButton,
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
//   JobMixApi
// } from "api"

const ListSubKegiatan = ({ setNavbarTitle }) => {
  const history = useHistory()
  const location = useLocation()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataSubKegiatan, setDataSubKegiatan] = useState([])
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

    // JobMixApi.get(query)
    //   .then(({ data }) => {
    //     setDataSubKegiatan(data.data)
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
          <span className="text-success">{data.tgl_mulai_jobmix}</span>
        </div>
      )
    }

    if (newStatus === "CLOSE") {
      return (
        <div className="d-flex flex-column">
          <span className="text-danger">CLOSED</span>
          <span className="text-danger">{data.tgl_selesai_jobmix}</span>
        </div>
      )
    }

    return (
      <div className="d-flex flex-column">
        <span className="text-primary">PENDING</span>
        <span className="text-primary">{data.tgl_selesai_jobmix}</span>
      </div>
    )
  }
  

  useEffect(() => {
    setNavbarTitle("List Sub Kegiatan")
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
            <ThFixed>Aksi</ThFixed>
            <Th noPadding width={70}>Tgl. Sub Kegiatan</Th>
            <Th noPadding width={80}>Kode. Sub Kegiatan</Th>
            <Th>Nama Sub Kegiatan</Th>
            <Th>Nama Kegiatan</Th>
            <Th>Penanggung Jawab</Th>
            <Th>Periode Sub Kegiatan</Th>
            <Th>Pengaju</Th>
            <Th>Status Approval</Th>
          </tr>
        </thead>
        <tbody>
          {dataSubKegiatan.map((val, index) => (
            <tr key={index}>
              <Td textCenter>{TableNumber(paginationConfig.page, paginationConfig.dataLength, index)}</Td>
              <Td>
                <ButtonGroup size="sm">
                  <ReadButton onClick={() => history.push("/transaksi/sub-kegiatan/detail/" + val.id_sub_kegiatan)}/>
                  {checkUbah(val) && (
                    <UpdateButton onClick={() => history.push("/transaksi/sub-kegiatan/ubah/" + val.id_sub_kegiatan)} />
                  )}
                </ButtonGroup>
              </Td>
              <Td>{val.tgl_sub_kegiatan ? DateConvert(new Date(val.tgl_sub_kegiatan)).defaultDMY : "-"}</Td>
              <Td>{val.kode_sub_kegiatan ?? "-"}</Td>
              <Td>{val.nama_sub_kegiatan ?? "-"}</Td>
              <Td>{val.nama_kegiatan ?? "-"}</Td>
              <Td>{val.nama_penanggung_jawab ?? "-"}</Td>
              <Td>{val.periode ?? "-"}</Td>
              <Td>{val.nama_pengaju ?? "-"}</Td>
              <Td className="text-uppercase text-center">{generateStatusApproval(val)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    )

    if (!dataSubKegiatan || dataSubKegiatan.length < 1) {
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
          <CreateButton onClick={() => history.push('/anggaran/transaksi/sub-kegiatan/kegiatan')} />
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

export default ListSubKegiatan

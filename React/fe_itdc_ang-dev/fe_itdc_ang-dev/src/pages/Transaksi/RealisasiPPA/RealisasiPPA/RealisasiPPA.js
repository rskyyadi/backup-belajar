import React, {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col,
  Modal,
  ButtonGroup
} from 'react-bootstrap'
import {
  useHistory
} from 'react-router-dom'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import {
  CRUDLayout,
  Alert,
  DataStatus,
  ReadButton,
  CreateButton,
  UpdateButton,
  DeleteButton,
  PrintButton,
  ActionButton,
  InputSearch,
  Input,
  DeleteModal,
  Pagination,
  Table,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td
} from 'components'
import {
  TableNumber,
  RupiahConvert
} from 'utilities'
import {
  RealisasiPPAApi
} from 'api'

const RealisasiPPA = ({ setNavbarTitle }) => {
  const history = useHistory()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [dataRealisasiPPA, setDataRealisasiPPA] = useState([])
  const [processedData, setProcessedData] = useState({})
  const [paginationConfig, setPaginationConfig] = useState({
    page: '1',
    totalPage: '1',
    dataLength: '1',
    dataCount: '1'
  })
  const [searchConfig, setSearchConfig] = useState({
    status: false,
    key: ''
  })
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: ''
  })
  const [modalConfig, setModalConfig] = useState({
    show: false,
    type: 'delete'
  })

  const getInitialData = () => {
    setIsPageLoading(true)

    RealisasiPPAApi.getPage({
      page: paginationConfig.page,
      dataLength: paginationConfig.dataLength,
      q: searchConfig.key
    })
      .then((res) => {
        setDataRealisasiPPA(res.data.data)
        setPaginationConfig({
          ...paginationConfig,
          dataCount: res.data.data_count,
          dataLength: res.data.total_page
        })
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          variant: 'danger',
          text: 'Data gagal dimuat'
        })
      })
      .finally(() => setIsPageLoading(false))
  }

  const onDeleteHandler = () => {
    setIsDeleteLoading(true)

    RealisasiPPAApi.delete({ id_ppa: processedData.id_ppa })
      .then(() => {
        setAlertConfig({
          show: true,
          variant: 'primary',
          text: 'Hapus data berhasil!'
        })
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          variant: 'danger',
          text: 'Hapus data gagal'
        })
      })
      .finally(() => {
        setModalConfig({
          ...modalConfig,
          show: false
        })
        setIsDeleteLoading(false)
        getInitialData()
      })
  }

  useEffect(() => {
    setNavbarTitle('Realisasi PPA')
    getInitialData()

    return () => {
      setIsPageLoading(true)
    }
  }, [paginationConfig.page, paginationConfig.dataLength, searchConfig.key])

  const PageContent = () => {
    return (
      <>
        <Table>
          <THead>
            <Tr>
              <ThFixed>No</ThFixed>
              <ThFixed>Aksi</ThFixed>
              <Th>Tanggal Realisasi</Th>
              <Th>Nomor Realisasi</Th>
              <Th>Program</Th>
              <Th>Kegiatan</Th>
              <Th>Sumber Daya</Th>
              <Th>Nominal</Th>
              <Th>Bukti</Th>
            </Tr>
          </THead>
          <TBody>
            {dataRealisasiPPA.map((val, index) => (
              <Tr key={index}>
                <TdFixed textCenter>{index + 1}</TdFixed>
                <TdFixed>
                  <div className="d-flex flex-column">
                    <div className="d-flex">
                      <ButtonGroup size="sm">
                        <ReadButton onClick={() => history.push('/anggaran/transaksi/realisasi-ppa/detail/' + val.id_ppa)} />
                        <UpdateButton onClick={() => history.push('/anggaran/transaksi/realisasi-ppa/ubah/' + val.id_ppa)} />
                        <DeleteButton onClick={() => {
                          setProcessedData(val)
                          setModalConfig({
                            ...modalConfig,
                            show: true,
                            type: 'delete'
                          })
                        }} />
                        <PrintButton onClick={() => history.push('/anggaran/transaksi/realisasi-ppa/detail/' + val.id_ppa)} />
                      </ButtonGroup>
                    </div>
                  </div>
                </TdFixed>
                <Td>{val.tgl_ppa_realisasi}</Td>
                <Td>{val.no_ppa_realisasi}</Td>
                <Td>{val.nama_program}</Td>
                <Td>{val.nama_kegiatan}</Td>
                <Td>{val.item_sumber_daya}</Td>
                <Td textRight>{RupiahConvert((val.harga_satuan * val.qty).toString()).detail}</Td>
                <Td>
                  <ActionButton
                    size="sm"
                    text="Lihat Bukti"
                    onClick={() => window.open(process.env.REACT_APP_API_FILE_URL + val.bukti, "_blank").focus()}
                  />
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        <Pagination
          dataLength={paginationConfig.dataLength}
          dataNumber={paginationConfig.page * paginationConfig.dataLength - paginationConfig.dataLength + 1}
          dataPage={paginationConfig.dataCount < paginationConfig.dataLength ? paginationConfig.dataCount : paginationConfig.page * paginationConfig.dataLength}
          dataCount={paginationConfig.dataCount}
          currentPage={paginationConfig.page}
          totalPage={paginationConfig.totalPage}
          onPaginationChange={({ selected }) => setPaginationConfig({
            ...paginationConfig,
            page: selected + 1
          })}
          onDataLengthChange={(e) => setPaginationConfig({
            ...paginationConfig,
            page: 1,
            dataLength: e.target.value
          })}
        />
      </>
    )
  }

  return (
    <CRUDLayout>
      {/* head section */}
      <CRUDLayout.Head>
        <CRUDLayout.HeadSearchSection>
          <div className="d-flex mb-3">
            <InputSearch
              placeholder="Cari sumber daya PPA"
              onChange={e => setSearchConfig({
                ...searchConfig,
                key: e.target.value
              })}
            />
          </div>
        </CRUDLayout.HeadSearchSection>
        <CRUDLayout.HeadButtonSection>
          <ActionButton
            text="Tambah Realisasi PPA"
            onClick={() => history.push('/anggaran/transaksi/realisasi-ppa/approved')}
          />
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>

      {/* alert */}
      <Alert
        show={alertConfig.show}
        variant={alertConfig.variant}
        text={alertConfig.text}
        showCloseButton={true}
        onClose={() => setAlertConfig({
          ...alertConfig,
          show: false
        })}
      />

      {/* content section */}
      {isPageLoading
        ? <DataStatus
          loading={true}
          text="Memuat data . . ."
        />
        : dataRealisasiPPA
          ? dataRealisasiPPA.length > 0
            ? <PageContent />
            : <DataStatus text="Tidak ada data" />
          : <DataStatus text="Tidak ada data" />
      }

      {/* Modal */}
      <DeleteModal
        show={modalConfig.show}
        onHide={() => setModalConfig({
          ...modalConfig,
          show: false
        })}
        onConfirm={onDeleteHandler}
        loading={isDeleteLoading}
      />
    </CRUDLayout>
  )
}

export default RealisasiPPA

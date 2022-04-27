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
  CreateButton,
  ReadButton,
  UpdateButton,
  PrintButton,
  ActionButton,
  InputSearch,
  Input,
  UpdateModal,
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
  DateConvert,
  RupiahConvert
} from 'utilities'
import {
  PPAApi
} from 'api'

const PPA = ({ setNavbarTitle }) => {
  const history = useHistory()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataPPA, setDataPPA] = useState([])
  const [processedData, setProcessedData] = useState({})
  const [paginationConfig, setPaginationConfig] = useState({
    page: '1',
    dataLength: '10',
    totalPage: '1',
    dataCount: '0'
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
    type: 'edit'
  })

  const getInitialData = () => {
    setIsPageLoading(true)
    setSearchConfig({
      ...searchConfig,
      status: false
    })

    PPAApi.getPage({
      page: paginationConfig.page,
      per_page: paginationConfig.dataLength,
      q: searchConfig.key
    })
      .then(({ data }) => {
        setDataPPA(data.data)
        setPaginationConfig({
          ...paginationConfig,
          dataCount: data.data_count,
          totalPage: data.total_page
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

  useEffect(() => {
    setNavbarTitle('PPA')
    getInitialData()

    return () => {
      setIsPageLoading(true)
    }
  }, [paginationConfig.page, paginationConfig.dataLength, searchConfig.key])

  const PageContent = () => {
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

    return (
      <>
        <Table>
          <THead>
            <Tr>
              <ThFixed>No</ThFixed>
              <ThFixed>Aksi</ThFixed>
              <Th>Tanggal</Th>
              <Th>Nomor PPA</Th>
              <Th>Kegiatan</Th>
              <Th>Sumber Daya</Th>
              <Th>Unit Organisasi</Th>
              <Th>Baseline</Th>
              <Th>Status PPA</Th>
              <Th>Status Approval</Th>
              {/* <Th>Catatan Approval</Th> */}
            </Tr>
          </THead>
          <TBody>
            {dataPPA.map((val, index) => (
              <Tr key={index}>
                <TdFixed textCenter>{TableNumber(paginationConfig.page, paginationConfig.dataLength, index)}</TdFixed>
                <TdFixed>
                  <div className="d-flex">
                    <ButtonGroup size="sm">
                      <ReadButton onClick={() => history.push('/anggaran/transaksi/ppa/detail/' + val.id_ppa)} />
                      {val?.kode_status?.toUpperCase() === 'REV' && <UpdateButton
                        onClick={() => {
                          setProcessedData(val)
                          setModalConfig({
                            show: true,
                            type: 'edit'
                          })
                        }}
                      />}
                      {val?.kode_status?.toUpperCase() === 'APP' && <PrintButton onClick={() => history.push('/anggaran/transaksi/ppa/cetak/' + val.id_ppa)} />}
                    </ButtonGroup>
                  </div>
                </TdFixed>
                <Td>{val.tgl_ppa}</Td>
                <Td>{val.no_ppa}</Td>
                <Td>{val.nama_kegiatan}</Td>
                <Td>{val.item_sumber_daya}</Td>
                <Td>{val.unit_organisasi}</Td>
                <Td>{val.level_baseline}</Td>
                <Td>{val.status_ppa}</Td>
                <Td>{generateStatusApproval(val.kode_status)}</Td>
                {/* <Td>{val.catatan_approval}</Td> */}
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

  const PageModal = () => {
    const ModalForm = () => {
      const [noPPA, setNoPPA] = useState('')
      const [isNoPPALoading, setIsNoPPALoading] = useState(false)

      const formInitialValues = {
        no_ppa: noPPA,
        id_kegiatan_sumber_daya: processedData.id_kegiatan_sumber_daya,
        tgl_ppa: processedData.tgl_ppa,
        qty: processedData.qty,
        satuan: processedData.satuan,
        harga_satuan: processedData.harga_satuan
      }

      const formValidationSchema = Yup.object().shape({
        tgl_ppa: Yup.string()
          .required("Pilih tanggal ppa"),
        qty: Yup.string()
          .required("Masukan qty"),
        satuan: Yup.string()
          .required("Masukan satuan"),
        harga_satuan: Yup.string()
          .required("Masukan harga satuan")
      })

      const formSubmitHandler = values => {
        PPAApi.createOrUpdate(values)
          .then(() => {
            setAlertConfig({
              show: true,
              variant: "primary",
              text: 'Ubah data berhasil!'
            })

            getInitialData()
          })
          .catch(() => setAlertConfig({
            show: true,
            variant: "danger",
            text: "Ubah data gagal!"
          }))
          .finally(() => setModalConfig({
            ...modalConfig,
            show: false
          }))
      }

      const getKodeHandler = date => {
        setIsNoPPALoading(true)

        PPAApi.getKode(date)
          .then(res => setNoPPA(res.data.data))
          .catch(() => setNoPPA(""))
          .finally(() => setIsNoPPALoading(false))
      }

      useEffect(() => {
        setNoPPA(processedData.no_ppa)
        return () => { }
      }, [])

      const InfoForm = () => {
        const convertBulan = date => {
          const month = DateConvert(new Date(date)).detailMonth
          const year = DateConvert(new Date(date)).defaultYear

          return `${month} ${year}`
        }

        const InfoItem = ({ title, value }) => (
          <tr>
            <td><small>{title}</small></td>
            <td className="pl-3 pr-1"><small>:</small></td>
            <td><small>{value}</small></td>
          </tr>
        )

        return (
          <table className="mb-3">
            <tbody>
              <InfoItem
                title="Program"
                value={processedData.nama_program}
              />
              <InfoItem
                title="Kegiatan"
                value={processedData.nama_kegiatan}
              />
              <InfoItem
                title="Sumber Daya"
                value={processedData.item_sumber_daya}
              />
              <InfoItem
                title="Bulan"
                value={convertBulan(processedData.tgl_ppa)}
              />
              <InfoItem
                title="Tipe Anggaran"
                value={`${processedData.nomor_akun} - ${processedData.nama_akun}`}
              />
            </tbody>
          </table>
        )
      }

      return (
        <>
          <Formik
            enableReinitialize
            initialValues={formInitialValues}
            validationSchema={formValidationSchema}
            onSubmit={formSubmitHandler}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <InfoForm />
                  <hr />
                  <Input
                    type="date"
                    label="Tanggal PPA"
                    name="tgl_ppa"
                    onChange={e => {
                      const value = e.target.value

                      setFieldValue("tgl_ppa", value)
                      getKodeHandler(value)
                    }}
                    value={values.tgl_ppa}
                    error={errors.tgl_ppa && touched.tgl_ppa && true}
                    errorText={errors.tgl_ppa}
                    readOnly
                  />
                  <Input
                    type="text"
                    label="No. PPA"
                    placeholder="Pilih tanggal untuk membuat nomor"
                    value={isNoPPALoading
                      ? 'Memuat kode . . .'
                      : noPPA
                        ? noPPA
                        : ''
                    }
                    readOnly
                  />
                  <Row>
                    <Col>
                      <Input
                        type="number"
                        label="Qty"
                        name="qty"
                        onChange={handleChange}
                        value={values.qty}
                        error={errors.qty && touched.qty && true}
                        errorText={errors.qty}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        label="Satuan"
                        name="satuan"
                        onChange={handleChange}
                        value={values.satuan}
                        error={errors.satuan && touched.satuan && true}
                        errorText={errors.satuan}
                      />
                    </Col>
                  </Row>
                  <Input
                    type="text"
                    label="Harga Satuan"
                    name="harga_satuan"
                    value={RupiahConvert(values.harga_satuan.toString()).detail}
                    onChange={e => {
                      const val = e.target.value
                      const convert = RupiahConvert(val.toString()).default
                      setFieldValue('harga_satuan', Number.isInteger(convert) ? convert : "")
                    }}
                    error={errors.harga_satuan && touched.harga_satuan && true}
                    errorText={errors.harga_satuan}
                  />
                  <Input
                    type="text"
                    label="Total Harga"
                    value={RupiahConvert((values.harga_satuan * values.qty).toString()).detail}
                    readOnly
                  />
                </Modal.Body>
                <Modal.Footer>
                  <ActionButton
                    type="submit"
                    variant="success"
                    text="Ubah Data"
                    loading={isSubmitting}
                  />
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </>
      )
    }

    if (modalConfig.type === 'edit') {
      return (
        <UpdateModal
          show={modalConfig.show}
          onHide={() => setModalConfig({
            ...modalConfig,
            show: false
          })}
        >
          <ModalForm />
        </UpdateModal>
      )
    }
  }

  return (
    <CRUDLayout>
      {/* head section */}
      <CRUDLayout.Head>
        <CRUDLayout.HeadSearchSection>
          <div className="d-flex mb-3">
            <InputSearch
              placeholder="Cari PPA"
              onChange={e => setSearchConfig({
                ...searchConfig,
                key: e.target.value
              })}
            />
          </div>
        </CRUDLayout.HeadSearchSection>
        <CRUDLayout.HeadButtonSection>
          <CreateButton onClick={() => history.push('/anggaran/transaksi/ppa/sumber-daya')} />
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
        : dataPPA
          ? dataPPA.length > 0
            ? <PageContent />
            : <DataStatus text="Tidak ada data" />
          : <DataStatus text="Tidak ada data" />
      }

      {/* Modal */}
      <PageModal />
    </CRUDLayout>
  )
}

export default PPA

import React, {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col,
  Table,
  Modal
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
  BackButton,
  ReadButton,
  UpdateButton,
  PrintButton,
  ActionButton,
  InputSearch,
  Input,
  CreateModal,
  Pagination,
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
  RupiahConvert,
  DateConvert
} from 'utilities'
import {
  PPAApi
} from 'api'

const SumberDayaPPA = ({ setNavbarTitle }) => {
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
    type: 'create'
  })

  const getInitialData = () => {
    setIsPageLoading(true)
    setSearchConfig({
      ...searchConfig,
      status: false
    })

    PPAApi.getSumberDaya({
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

  const convertBulan = date => {
    const month = DateConvert(new Date(date)).detailMonth
    const year = DateConvert(new Date(date)).defaultYear

    return `${month} ${year}`
  }

  useEffect(() => {
    getInitialData()
    setNavbarTitle('Sumber Daya PPA')

    return () => {
      setIsPageLoading(true)
    }
  }, [paginationConfig.page, paginationConfig.dataLength, searchConfig.key])

  const PageContent = () => {
    return (
      <>
        <Table
          className="bg-white shadow-sm"
          bordered
          responsive
        >
          <THead>
            <Tr>
              <ThFixed>No</ThFixed>
              <Th>Program</Th>
              <Th>Kegiatan</Th>
              <Th>Sumber Daya</Th>
              <Th>Bulan</Th>
              <ThFixed>Aksi</ThFixed>
            </Tr>
          </THead>
          <TBody>
            {dataPPA.map((val, index) => (
              <Tr key={index}>
                <Td textCenter>{TableNumber(paginationConfig.page, paginationConfig.dataLength, index)}</Td>
                <Td>{val.nama_program}</Td>
                <Td>{val.nama_kegiatan}</Td>
                <Td>{val.item_sumber_daya}</Td>
                <Td>{convertBulan(val.bulan_tahun)}</Td>
                <TdFixed>
                  <ActionButton
                    size="sm"
                    text="PPA"
                    onClick={() => {
                      setProcessedData(val)
                      setModalConfig({
                        show: true,
                        type: 'create'
                      })
                    }
                    }
                  />
                </TdFixed>
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
      const [dataModal, setDataModal] = useState([])
      const [noPPA, setNoPPA] = useState('')
      const [isNoPPALoading, setIsNoPPALoading] = useState(false)

      const formInitialValues = {
        no_ppa: noPPA,
        id_kegiatan_sumber_daya: processedData.id_kegiatan_sumber_daya,
        tgl_ppa: new Date().toISOString().slice(0, 10),
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
              text: 'Tambah data berhasil!'
            })

            getInitialData()
          })
          .catch(() => setAlertConfig({
            show: true,
            variant: "danger",
            text: "Tambah data gagal!"
          }))
          .finally(() => setModalConfig({
            ...modalConfig,
            show: false
          }))
      }

      const getDataModal = () => {
        PPAApi.getDetail(processedData?.id_kegiatan_sumber_daya).then((val) => setDataModal(val?.data?.data?.ppa ?? {}))
      }

      console.log(dataModal);


      const getKodeHandler = date => {
        setIsNoPPALoading(true)

        PPAApi.getKode(date)
          .then(res => setNoPPA(res.data.data))
          .catch(() => setNoPPA(""))
          .finally(() => setIsNoPPALoading(false))
      }

      useEffect(() => {
        getDataModal()
        getKodeHandler(new Date().toISOString().slice(0, 10))

        return () => {
          setIsNoPPALoading(false)
        }
      }, [])

      const InfoForm = () => {
        const InfoItem = ({ title, value }) => (
          <tr>
            <td><small>{title}</small></td>
            <td className="pl-3 pr-1"><small>:</small></td>
            <td><small>{value}</small></td>
          </tr>
        )

        return (
          <table>
            <tbody>
              <InfoItem
                title="Program"
                value={dataModal.nama_program}
              />
              <InfoItem
                title="Kegiatan"
                value={dataModal.nama_kegiatan}
              />
              <InfoItem
                title="Sumber Daya"
                value={dataModal.sumber_daya}
              />
              <InfoItem
                title="Bulan"
                value={convertBulan(dataModal.bulan_tahun)}
              />
              <InfoItem
                title="Tipe Anggaran"
                value={`${dataModal.nomor_akun} - ${dataModal.nama_akun}`}
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
                </Modal.Body>.
                <Modal.Footer>
                  <ActionButton
                    type="submit"
                    variant="primary"
                    text="Simpan Data"
                    loading={isSubmitting}
                  />
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </>
      )
    }

    if (modalConfig.type === 'create') {
      return (
        <CreateModal
          show={modalConfig.show}
          onHide={() => setModalConfig({
            ...modalConfig,
            show: false
          })}
        >
          <ModalForm />
        </CreateModal>
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
              placeholder="Cari sumber daya PPA"
              onChange={e => setSearchConfig({
                ...searchConfig,
                key: e.target.value
              })}
            />
          </div>
        </CRUDLayout.HeadSearchSection>
        <CRUDLayout.HeadButtonSection>
          <BackButton onClick={() => history.goBack()} />
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

export default SumberDayaPPA

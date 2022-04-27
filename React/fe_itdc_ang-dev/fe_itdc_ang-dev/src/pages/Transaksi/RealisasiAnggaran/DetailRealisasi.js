import React, {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col,
  Card,
  Table,
  Modal
} from 'react-bootstrap'
import {
  useParams,
  useHistory
} from 'react-router-dom'
import {
  IoClose, 
  IoNewspaperOutline
} from 'react-icons/io5'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import {
  ActionButton,
  BackButton,
  DataStatus,
  Input,
  THead,
  TBody,
  TdFixed,
  Tr,
  Th,
  Td,
  InputFile,
  DeleteButton,
  Alert,
  DeleteModal
} from 'components'
import {
  RealisasiAnggaranApi
} from 'api'
import {
  RupiahConvert
} from 'utilities'

const DetailRealisasi = () => {
  const { id } = useParams()
  const history = useHistory()
  const [dataKegiatan, setDataKegiatan] = useState({})
  const [dataProgram, setDataProgram] = useState({})
  const [dataSumberDaya, setDataSumberDaya] = useState([])
  const [dataSumberDayaRealisasi, setDataSumberDayaRealisasi] = useState([])
  const [dataProcessed, setDataProcessed] = useState({})
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isShowModal, setIsShowModal] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [deleteRealisasiId, setDeleteRealisasiId] = useState("")
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: ''
  })

  const getInitialData = () => {
    setIsPageLoading(true)

    RealisasiAnggaranApi.getKegiatanRealisasi(id)
      .then(({data}) => {
        setDataKegiatan(data.data.kegiatan)
        setDataProgram(data.data.program)
        setDataSumberDaya(data.data.sumber_daya)
        setDataSumberDayaRealisasi(data.data.sumber_daya_realisasi)
      })
      .catch(() => setAlertConfig({
        show: true,
        variant: 'danger',
        text: 'Gagal saat memuat data'
      }))
      .finally(() => setIsPageLoading(false))
  }

  useEffect(() => {
    getInitialData()
  }, [])

  const PageContent = () => {
    const InfoSection = () => {
      const dataInfo = [
        {
          title: 'Unit Organisasi',
          value: dataProgram.nama_unit_organisasi
        },
        {
          title: 'Tanggal Awal',
          value: dataKegiatan.tgl_mulai
        },
        {
          title: 'Tanggal Akhir',
          value: dataKegiatan.tgl_selesai
        },
        {
          title: 'Program',
          value: dataProgram.nama_program
        },
        {
          title: 'Kegiatan',
          value: dataKegiatan.nama_kegiatan
        },
        {
          title: 'Penanggung Jawab',
          value: dataKegiatan.nama_karyawan
        },
      ]

      const formInitialValues = {
        id_kegiatan: dataKegiatan.id_kegiatan,
        tgl_mulai_terealisasi: dataKegiatan.tgl_mulai_terealisasi,
        tgl_selesai_terealisasi: dataKegiatan.tgl_selesai_terealisasi,
      }

      const formValidationSchema = Yup.object().shape({
        tgl_mulai_terealisasi: Yup.string()
          .required('Pilih tanggal mulai realisasi')
          .nullable(),
        tgl_selesai_terealisasi: Yup.string()
          .required('Pilih tanggal selesai realisasi')
          .nullable()
      })

      const formSubmitHandler = (value) => {
        RealisasiAnggaranApi.updateRealisasiWaktu(value)
        .then(() => {
          setAlertConfig({
            show: true,
            variant: "primary",
            text: "Ubah waktu realisasi berhasil!",
          })
        })
        .catch(() => {
          setAlertConfig({
            show: true,
            variant: "danger",
            text: "Ubah waktu realisasi gagal!",
          })
        })
        .finally(() => getInitialData())
      }

      return (
        <>
          <Alert 
            text={alertConfig.text}
            variant={alertConfig.variant}
            show={alertConfig.show}
            showCloseButton={true}
            onClose={() => setAlertConfig({
              ...alertConfig,
              show: false
            })}
          />
          <Row>
            <Col md={6} lg={8}>
              <table className="mb-3">
                {dataInfo.map((val, index) => (
                  <tr key={index}>
                    <td className=""><small>{val.title}</small></td>
                    <td className="p-1 pl-4"><small>:</small></td>
                    <td><small>{val.value}</small></td>
                  </tr>
                ))}
              </table>
            </Col>
            <Col md={6} lg={4}>
              <Formik
                initialValues={formInitialValues}
                validationSchema={formValidationSchema}
                onSubmit={formSubmitHandler}
              >
                {({values, errors, touched, isSubmitting, handleChange, handleSubmit}) => (
                  <form onSubmit={handleSubmit}>
                    <Input 
                      label="Tanggal Mulai"
                      type="date"
                      name="tgl_mulai_terealisasi"
                      onChange={handleChange}
                      value={values.tgl_mulai_terealisasi}
                      error={errors.tgl_mulai_terealisasi && touched.tgl_mulai_terealisasi && true}
                      errorText={errors.tgl_mulai_terealisasi}
                      readOnly
                    />
                    <Input 
                      label="Tanggal Selesai"
                      type="date"
                      name="tgl_selesai_terealisasi"
                      onChange={handleChange}
                      value={values.tgl_selesai_terealisasi}
                      error={errors.tgl_selesai_terealisasi && touched.tgl_selesai_terealisasi && true}
                      errorText={errors.tgl_selesai_terealisasi}
                      readOnly
                    />
                  </form>
                )}
              </Formik>
            </Col>
          </Row>
        </>
      )
    }

    const TableSection = () => {
      let totalAnggaran = 0
      let totalQtyAnggaran = 0
      let totalRealisasiAnggaran = 0
      let totalQtyRealisasiAnggaran = 0

      return (
        <Table 
          bordered 
          responsive
          hover
          className="mt-3 shadow-sm"
        >
          <THead>
            <Tr>
              <Th>Sumber Daya</Th>
              <Th>Kategori</Th>
              <Th>Akun</Th>
              <Th>Qty</Th>
              <Th>Harga Satuan</Th>
              <Th>Total Anggaran</Th>
              <Th>Realisasi</Th>
            </Tr>
          </THead>
          <TBody>
            {dataSumberDaya.map((val, index) => {
              let totalRealisasi = 0
              let totalQtyRealisasi = 0
              totalAnggaran = totalAnggaran + (val.harga_satuan * parseInt(val.qty))
              totalQtyAnggaran = totalQtyAnggaran + parseInt(val.qty)

              return (
                <Tr key={index}>
                  <Td>{val.item_sumber_daya}</Td>
                  <Td>{val.nama_kategori_sumber_daya}</Td>
                  <Td>{val.nama_akun}</Td>
                  <TdFixed>{parseInt(val.qty)}</TdFixed>
                  <Td textRight>{RupiahConvert(val.harga_satuan.toString()).detail}</Td>
                  <Td textRight>{RupiahConvert((val.harga_satuan * val.qty).toString()).detail}</Td>
                  <td className="p-0 border-none">
                    {dataSumberDayaRealisasi 
                      ? dataSumberDayaRealisasi.length > 0
                        ? dataSumberDayaRealisasi.find(v => v.id_kegiatan_sumber_daya === val.id_kegiatan_sumber_daya)  
                          ? (
                            <Table className="m-0">
                              <THead>
                                <Tr>
                                  <Th>Tanggal</Th>
                                  <Th>Akun Realisasi</Th>
                                  <Th>Qty</Th>
                                  <Th>Realisasi</Th>
                                  <Th>Total Realisasi</Th>
                                </Tr>
                              </THead>
                              <TBody>
                                {dataSumberDayaRealisasi.filter(fil => fil.id_kegiatan_sumber_daya === val.id_kegiatan_sumber_daya).map((childVal, index) => {
                                    totalRealisasi = totalRealisasi + (parseInt(childVal.qty) * childVal.harga_satuan)
                                    totalQtyRealisasi = totalQtyRealisasi + parseInt(childVal.qty)
                                    totalRealisasiAnggaran = totalRealisasiAnggaran + (parseInt(childVal.qty) * childVal.harga_satuan)
                                    totalQtyRealisasiAnggaran = totalQtyRealisasiAnggaran + parseInt(childVal.qty)

                                    return (
                                      <Tr key={index}>
                                        <TdFixed>{childVal.tgl_realisasi}</TdFixed>
                                        <Td>{childVal.nama_akun_realisasi}</Td>
                                        <TdFixed>{childVal.qty}</TdFixed>
                                        <Td textRight>
                                          {RupiahConvert(childVal.harga_satuan.toString()).detail}
                                        </Td>
                                        <Td textRight>
                                          {RupiahConvert((parseInt(childVal.qty) * childVal.harga_satuan).toString()).detail}
                                        </Td>
                                      </Tr>
                                  )
                                })
                              }
                              <Tr>
                                <Td 
                                  textRight
                                  colSpan={2}
                                >
                                  <b>Qty sisa :</b>
                                </Td>
                                <TdFixed><b className="text-nowrap">{val.qty - totalQtyRealisasi}</b></TdFixed>
                                <Td textRight><b className="text-nowrap">Anggaran Sisa :</b></Td>
                                <Td textRight><b>{RupiahConvert(((val.harga_satuan * val.qty) - totalRealisasi).toString()).detail}</b></Td>
                              </Tr>
                            </TBody>
                          </Table>
                          ) 
                          : <DataStatus text="Belum ada realisasi" /> 
                        : <DataStatus text="Belum ada realisasi" />
                      : <DataStatus text="Belum ada realisasi" />
                    }
                  </td>
                </Tr>
              )
            })}
            <Tr>
              <Td textRight colSpan={3}>
                <b>Total Qty : </b>
              </Td>
              <TdFixed>
                <b>{totalQtyAnggaran}</b>
              </TdFixed>
              <Td textRight>
                <b className="text-nowrap">Total Anggaran : </b>
              </Td>
              <Td textRight>
                <b>{RupiahConvert(totalAnggaran.toString()).detail}</b>
              </Td>
              <td className="p-0">
                  <Table className="m-0">
                    <TBody>
                      <Tr>
                        <Td textRight><b>Total Qty Sisa : </b></Td>
                        <Td textRight>
                          <b>{totalQtyAnggaran - totalQtyRealisasiAnggaran}</b>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td textRight><b>Total Anggaran Sisa : </b></Td>
                        <Td textRight>
                          <b>{RupiahConvert((totalAnggaran - totalRealisasiAnggaran).toString()).detail}</b>
                        </Td>
                      </Tr>
                    </TBody>
                  </Table>
              </td>
            </Tr>
          </TBody>
        </Table>
      )
    }

    return (
      <>
        <InfoSection />
        <TableSection />
      </>
    )
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <b>Realisasi Anggaran</b>
        <BackButton 
          size="sm" 
          onClick={() => history.goBack()}
        />
      </Card.Header>
      <Card.Body>
        {isPageLoading
          ? <DataStatus 
              loading={true}
              text="Memuat data . . ."
            />
          : <PageContent />
        }
      </Card.Body>
    </Card>
  )
}

export default DetailRealisasi

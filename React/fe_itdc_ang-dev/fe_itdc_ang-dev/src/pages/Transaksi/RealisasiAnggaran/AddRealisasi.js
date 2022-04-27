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
import Axios from 'axios'
import {
  ActionButton,
  BackButton,
  DataStatus,
  Input,
  SelectSearch,
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
  RealisasiAnggaranApi,
  COAApi
} from 'api'
import {
  RupiahConvert
} from 'utilities'

const AddRealisasi = () => {
  const { id } = useParams()
  const history = useHistory()
  const [dataKegiatan, setDataKegiatan] = useState({})
  const [dataProgram, setDataProgram] = useState({})
  const [dataSumberDaya, setDataSumberDaya] = useState([])
  const [dataSumberDayaRealisasi, setDataSumberDayaRealisasi] = useState([])
  const [dataCOA, setDataCOA] = useState([])
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

    Axios.all([RealisasiAnggaranApi.getKegiatanRealisasi(id), COAApi.get()])
      .then(
        Axios.spread(({ data }, coa) => {
          console.log(data)
          setDataProgram(data.data.program);
          setDataKegiatan(data.data.kegiatan);
          setDataSumberDaya(data.data.sumber_daya);
          setDataSumberDayaRealisasi(data.data.sumber_daya_realisasi);
          setDataCOA(coa.data.data);
        })
      )
      .catch(() => setAlertConfig({
        show: true,
        variant: 'danger',
        text: 'Gagal saat memuat data'
      }))
      .finally(() => setIsPageLoading(false))
  }

  const deleteDataHandler = () => {
    RealisasiAnggaranApi.deleteKegiatanSumberDayaRealisasi({
      id_kegiatan_sumber_daya_realisasi: deleteRealisasiId,
    })
      .then(() => {
        setAlertConfig({
          show: true,
          variant: "primary",
          text: "Hapus data kegiatan sumber daya realisasi berhasil!",
        })
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          variant: "danger",
          text: `Hapus data kegiatan sumber daya realisasi gagal!`,
        })
      })
      .finally(() => {
        setIsDeleteModal(false)
        getInitialData()
      })

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
                    />
                    <Input 
                      label="Tanggal Selesai"
                      type="date"
                      name="tgl_selesai_terealisasi"
                      onChange={handleChange}
                      value={values.tgl_selesai_terealisasi}
                      error={errors.tgl_selesai_terealisasi && touched.tgl_selesai_terealisasi && true}
                      errorText={errors.tgl_selesai_terealisasi}
                    />
                    <div className="d-flex justify-content-end">
                      <ActionButton 
                        type="submit"
                        text="Simpan"
                        className="mt-2"
                        loading={isSubmitting}
                      />
                    </div>
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
              <Th>Aksi</Th>
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
                  <Td>
                    <ActionButton 
                      size="sm"
                      text="Realisasi"
                      onClick={() => {
                        setIsShowModal(true)
                        setDataProcessed(val)
                      }}
                    />
                  </Td>
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
                                  <Th>Aksi</Th>
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
                                        <TdFixed>
                                          <DeleteButton 
                                            onClick={() => {
                                              setDeleteRealisasiId(childVal.id_kegiatan_sumber_daya_realisasi)
                                              setIsDeleteModal(true)
                                            }}
                                          />
                                          {childVal.bukti && (
                                            <ActionButton 
                                              size="sm"
                                              variant="info"
                                              text={<IoNewspaperOutline />}
                                              tooltip={true}
                                              tooltipText="Lihat bukti"
                                              onClick={() => window.open(process.env.REACT_APP_API_FILE_URL + childVal.bukti, "_blank").focus()}
                                            />
                                          )}
                                        </TdFixed>
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
                                  colSpan={3}
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
              <Td textRight colSpan={4}>
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

  const ModalRealisasi = () => {
    const [isNomorLoading, setIsNomorLoading] = useState(false)
    const [nomorRealisasi, setNomorRealisasi] = useState('')
    const formInitialValues = {
      id_kegiatan: dataProcessed.id_kegiatan,
      id_kegiatan_sumber_daya: dataProcessed.id_kegiatan_sumber_daya,
      satuan: dataProcessed.satuan,
      harga_satuan: dataProcessed.harga_satuan,
      qty: parseInt(dataProcessed.qty),
      tgl_realisasi: "",
      no_realisasi: "",
      bukti: "",
    }

    const formValidationSchema = Yup.object().shape({
      tgl_realisasi: Yup.string()
        .required("Pilih tanggal realisasi"),
      no_realisasi: Yup.string()
        .required("Nomor realisasi tidak boleh kosong"),
      qty: Yup.string()
        .required("Masukan qty"),
      harga_satuan: Yup.string().
        required("Masukan harga satuan"),
      bukti: Yup.mixed()
        .notRequired()
        .nullable()
        .test("fileFormat", "File harus berupa JPG, JPEG, PNG atau PDF",(value) => !value || value.name.match(/\.(jpg|jpeg|png|pdf)$/))
    })

    const formSubmitHandler = (values) => {
      if (values.bukti) {
        const fData = new FormData();
        fData.append("file", values.bukti);

        RealisasiAnggaranApi.uploadBukti(fData)
          .then(({ data }) => {
            const newBukti = data.data;
            const newData = {
              ...values,
              bukti: newBukti,
            };

            RealisasiAnggaranApi.createKegiatanRealisasi(newData)
              .then(() => {
                setAlertConfig({
                  show: true,
                  variant: "primary",
                  text: "Realisasi kegiatan berhasil",
                })
              })
              .catch(() => {
                setAlertConfig({
                  show: true,
                  variant: "danger",
                  text: "Realisasi kegiatan gagal!",
                })
              })
              .finally(() => {
                setIsShowModal(false)
                getInitialData()
              })
          })
          .catch(() => {
            setAlertConfig({
              show: true,
              variant: "danger",
              text: "Upload bukti gagal & Realisasi kegiatan gagal!",
            })
          })
          .finally(() => {
            setIsShowModal(false)
            getInitialData()
          })
      } else {
        RealisasiAnggaranApi.createKegiatanRealisasi(values)
          .then(() => {
            setAlertConfig({
              show: true,
              variant: "primary",
              text: "Realisasi kegiatan berhasil!",
            })
          })
          .catch(() => {
            setAlertConfig({
              show: true,
              variant: "danger",
              text: "Realisasi kegiatan gagal!",
            })
          })
          .finally(() => {
            setIsShowModal(false)
            getInitialData()
          })
      }
    }

    const getNomorRealisasi = (value, setFieldValue) => {
      setIsNomorLoading(true);

      RealisasiAnggaranApi.getNomorRealisasi(value)
        .then(({ data }) => {
          setNomorRealisasi(data.data);
          setFieldValue("no_realisasi", data.data);
        })
        .catch((err) => alert("Gagal mengambil nomor realisasi " + err))
        .finally(() => setIsNomorLoading(false));
    };


    return (
      <Modal
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center">
            <b>Realisasi Anggaran</b>
            <IoClose 
              style={{cursor: 'pointer'}}
              onClick={() => setIsShowModal(false)} 
            />
          </div>
          <hr />
          <Formik
            initialValues={formInitialValues}
            validationSchema={formValidationSchema}
            onSubmit={formSubmitHandler}
          >
            {({values, errors, touched, isSubmitting, setFieldValue, handleChange, handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <Input
                  label="Tanggal"
                  type="date"
                  name="tgl_realisasi"
                  placeholder="Masukan kode"
                  value={values.tgl_realisasi}
                  onChange={(e) => {
                    const value = e.target.value

                    setFieldValue("tgl_realisasi", value)
                    getNomorRealisasi(value, setFieldValue)
                  }}
                  error={errors.tgl_realisasi && touched.tgl_realisasi && true}
                  errorText={errors.tgl_realisasi}
                />
                <Input
                  label="No Realisasi"
                  type="text"
                  name="no_realisasi"
                  placeholder={
                    isNomorLoading
                      ? "Memuat . . . "
                      : values.tanggal
                        ? nomorRealisasi
                        : "Pilih tanggal terlebih dahulu"
                  }
                  value={nomorRealisasi}
                  onChange={handleChange}
                  error={errors.no_realisasi && touched.no_realisasi && true}
                  errorText={errors.no_realisasi}
                  readOnly={true}
                />
                <Input
                  label="Qty"
                  type="number"
                  name="qty"
                  placeholder="Masukan Qty"
                  value={values.qty}
                  onChange={handleChange}
                  error={errors.qty && touched.qty && true}
                  errorText={errors.qty}
                />
                <Input
                  label="Harga Satuan"
                  type="number"
                  name="harga_satuan"
                  placeholder="Masukan Harga Satuan"
                  value={values.harga_satuan}
                  onChange={handleChange}
                  error={errors.harga_satuan && touched.harga_satuan && true}
                  errorText={errors.harga_satuan}
                />
                <Row>
                  <div className="col-10">
                    <Input
                      label="Tipe Anggaran"
                      readOnly={true}
                      value={
                        `${dataProcessed.nomor_akun} - ${dataProcessed.nama_akun}`
                          ? `${dataProcessed.nomor_akun} - ${dataProcessed.nama_akun}`
                          : "-"
                      }
                    />
                  </div>
                  <Col>
                    <Input
                      label="Pos"
                      readOnly={true}
                      value={dataProcessed.normal_pos ? dataProcessed.normal_pos : "-"}
                    />
                  </Col>
                </Row>
                <Row>
                  <div className="col-10">
                    <SelectSearch
                      label="Master Akun"
                      name="id_coa"
                      placeholder="Pilih master akun"
                      option={
                        dataCOA
                          ? dataCOA
                              .filter((val) => val.normal_pos === "K")
                              .map((val) => {
                                return {
                                  label: `${val.nomor_akun} - ${val.nama_akun}`,
                                  value: val.id_coa,
                                  normal_pos: val.normal_pos,
                                  nomor_akun: val.nomor_akun,
                                };
                              })
                          : {
                              value: "",
                              label: "Pilih master akun",
                            }
                      }
                      onChange={(val) => {
                        setFieldValue("id_coa", val.value);
                        setFieldValue("nama_akun", val.label);
                        setFieldValue("normal_pos", val.normal_pos);
                        setFieldValue("nomor_akun", val.nomor_akun);
                      }}
                      error={errors.id_coa && touched.id_coa && true}
                      errorText={errors.id_coa && touched.id_coa && errors.id_coa}
                    />
                  </div>
                  <Col>
                    <Input
                      label="Pos"
                      readOnly={true}
                      value={values.normal_pos ? values.normal_pos : "-"}
                    />
                  </Col>
                </Row>
                <InputFile
                  label="Upload Bukti"
                  name="bukti"
                  accept=".JPEG, .JPG, .PNG, .PDF"
                  onChange={(e) => setFieldValue("bukti", e.target.files[0])}
                  error={errors.bukti && touched.bukti && true}
                  errorText={errors.bukti}
                />
                <ActionButton
                  type="submit"
                  variant="primary"
                  text="Simpan Realisasi"
                  className="mt-2 px-4"
                  loading={isSubmitting}
                />
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
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
    <ModalRealisasi />
    <DeleteModal 
      show={isDeleteModal}
      onHide={() => setIsDeleteModal(false)}
      onConfirm={deleteDataHandler}
    />
    </>
  )
}

export default AddRealisasi

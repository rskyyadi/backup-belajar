import React, {
  useState,
  useEffect
} from 'react'
import {
  useHistory,
  useParams
} from 'react-router-dom'
import {
  Table,
  Row,
  Col
} from 'react-bootstrap'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  Input,
  InputFile,
  SelectSearch,
  ActionButton,
  BackButton,
  DataStatus,
  Alert
} from 'components'
import {
  RupiahConvert
} from 'utilities'
import {
  COAApi,
  PPAApi,
  RealisasiPPAApi
} from 'api'

const TambahRealisasiPPA = ({setNavbarTitle}) => {
  const history = useHistory()
  const { id } = useParams()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataPPA, setDataPPA] = useState({})
  const [dataCOA, setDataCOA] = useState([])
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: ''
  })
  const [dataStatus, setDataStatus] = useState({
    loading: true,
    text: 'Memuat data . . .'
  })

  const getInitialData = () => {
    Axios.all([
      PPAApi.getDetail({
        id_ppa: id
      }), 
      COAApi.get()
    ])
      .then(Axios.spread((ppa, coa) => {
        setDataPPA(ppa.data.data)
        setDataCOA(coa.data.data)
        setIsPageLoading(false)
      }))
      .catch(() => {
        setAlertConfig({
          show: true,
          variant: 'danger',
          text: 'Data gagal dimuat!'
        })
        setDataStatus({
          loading: false,
          text: 'Tidak ada data'
        })
      })
  }
  
  useEffect(() => {
    setNavbarTitle('Tambah Realisasi PPA')
    getInitialData()

    return () => {}
  }, [])

  const HeadSection = () => (
    <div className="d-flex flex-column align-items-center mb-4">
      <b>PT. ITDC NUSANTARA UTILITAS</b>
      <b>PERSETUJUAN PRINSIP PENGADAAN BARANG DAN JASA</b>
      <b>SERTA PEMBAYARAN</b>
    </div>
  )

  const FormSection = () => {
    const [imagePreview, setImagePreview] = useState('')
    const [noPPA, setNoPPA] = useState('')
    const [isNoPPALoading, setIsNoPPALoading] = useState(false)

    const formInitialValues = {
      id_ppa: id,
      no_ppa_realisasi: noPPA,
      tgl_ppa_realisasi: new Date().toISOString().slice(0, 10),
      id_coa_realisasi: dataPPA?.realisasi?.id_coa_realisasi ? dataPPA?.realisasi?.id_coa_realisasi : '',
      no_akun_realisasi: dataPPA?.realisasi?.no_akun_realisasi ? dataPPA?.realisasi?.no_akun_realisasi : '',
      bukti: ''
    }

    const formValidationSchema = Yup.object().shape({
      tgl_ppa_realisasi: Yup.string()
        .required('Pilih tanggal'),
      no_ppa_realisasi: Yup.string()
        .required('Pilih tanggal untuk menentukan nomor PPA'),
      id_coa_realisasi: Yup.string()
        .required('Pilih COA'),
      bukti: Yup.mixed()
        .test("fileFormat", "File harus berupa JPG, JPEG, PNG",(value) => !value || value.name.match(/\.(jpg|jpeg|png)$/))
        .required("Pilih gambar")
    })
    
    const formSubmitHandler = values => {
      setIsPageLoading(true)

      const fData = new FormData();
      fData.append("file", values.bukti);

      RealisasiPPAApi.uploadBukti(fData)
        .then(({ data }) => {
          const newBukti = data.data;
          const newData = {
            ...values,
            bukti: newBukti,
          }
          console.log(newData)

          RealisasiPPAApi.createOrUpdate(newData)
            .then(res => {
              setAlertConfig({
                show: true,
                variant: "primary",
                text: "Realisasi PPA berhasil",
              })
              console.log(res)
            })
            .catch(() => {
              setAlertConfig({
                show: true,
                variant: "danger",
                text: "Realisasi PPA gagal!",
              })
            })
            .finally(() => setIsPageLoading(false))
        })
        .catch(() => {
          setAlertConfig({
            show: true,
            variant: "danger",
            text: "Upload bukti gagal & realisasi PPA gagal!",
          })
        })
        .finally(() => setIsPageLoading(false))
    }

    const getKodeHandler = date => {
      setIsNoPPALoading(true)

      RealisasiPPAApi.getKode(date)
        .then(res => setNoPPA(res.data.data))
        .catch(() => setNoPPA(""))
        .finally(() => setIsNoPPALoading(false))
    }

    const updateFileImage = (val, setFieldValue) => {
      const data = val.target.value

      if (data) {
        let reader = new FileReader()
        let file = val.target.files[0]
        
        reader.onloadend = () => {
          setFieldValue('bukti', file)
          setImagePreview(reader.result)
        }
  
        reader.readAsDataURL(file)
      } else {
        setImagePreview('')
        setFieldValue('bukti', '')
      }
    }

    useEffect(() => {
      getKodeHandler(new Date().toISOString().slice(0, 10))

      return () => {
        
      }
    }, [])

    return (
      <Formik
        enableReinitialize
        initialValues={formInitialValues}
        validationSchema={formValidationSchema}
        onSubmit={formSubmitHandler}
      >
        {({values, errors, touched, isSubmitting, setFieldValue, handleChange, handleSubmit}) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Input 
                  type="date"
                  label="Tanggal Realisasi PPA"
                  name="tgl_ppa_realisasi"
                  onChange={e => {
                    const value = e.target.value
                    setFieldValue('tgl_ppa_realisasi', value)
                    getKodeHandler(value)
                  }}
                  value={values.tgl_ppa_realisasi}
                  error={errors.tgl_ppa_realisasi && touched.tgl_ppa_realisasi && true}
                  errorText={errors.tgl_ppa_realisasi}
                />
              </Col>
              {console.log(errors)}
              <Col>
                <Input 
                  type="text"
                  label="No. Realisasi PPA"
                  placeholder="Pilih tanggal untuk membuat nomor"
                  value={isNoPPALoading 
                    ? 'Memuat kode . . .' 
                    : noPPA 
                      ? noPPA 
                      : ''
                  }
                  readOnly
                  error={errors.no_ppa_realisasi && touched.no_ppa_realisasi && true}
                  errorText={errors.no_ppa_realisasi}
                />
              </Col>
            </Row>
            <div className="mt-3">
              <b>Jurnal Akuntansi</b>
            </div>
            <Row>
              <Col>
                <Input 
                  type="text"
                  label="Tipe Anggaran"
                  value={dataPPA?.ppa?.tipe_anggaran}
                  readOnly
                />
              </Col>
              <Col>
                <div style={{width: '50px'}}>
                  <Input 
                    type="text"
                    label="Posisi"
                    value="D"
                    readOnly
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <SelectSearch 
                  label="COA Kredit"
                  placeholder="Pilih COA"
                  defaultValue={
                    dataPPA?.realisasi?.coa_kredit
                      ? {
                          label: dataPPA?.realisasi?.coa_kredit,
                          value: dataPPA?.realisasi?.id_coa_realisasi
                        }
                      : ''
                  }
                  option={dataCOA.filter(val => val.normal_pos === 'K').map(val => {
                    return {
                      value: val.id_coa,
                      label: `${val.nomor_akun} - ${val.nama_akun}`,
                      no_akun: val.nomor_akun
                    }
                  })}
                  onChange={e => {
                    setFieldValue('id_coa_realisasi', e.value)
                    setFieldValue('no_akun_realisasi', e.no_akun)
                  }}
                  error={errors.id_coa_realisasi && touched.id_coa_realisasi && true}
                  errorText={errors.id_coa_realisasi && touched.id_coa_realisasi && errors.id_coa_realisasi}
                />
              </Col>
              <Col>
                <div style={{width: '50px'}}>
                  <Input 
                    type="text"
                    label="Posisi"
                    value="K"
                    readOnly
                  />
                </div>
              </Col>
            </Row>
            <InputFile 
              label="Bukti"
              accept="image/*"
              onChange={e => {
                const value = e.target.files[0]

                if(value) {
                  updateFileImage(e, setFieldValue)
                  setFieldValue('bukti', value)
                } else {
                  setFieldValue('bukti', '')
                  setImagePreview('')
                }
              }}
              error={errors.bukti && touched.bukti && true}
              errorText={errors.bukti && touched.bukti && errors.bukti}
            />
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview bukti" 
                  height="200"
                />
              </div>
            )}
            <ActionButton 
              type="submit"
              text="Simpan Realisasi"
              className="my-3"
              loading={isSubmitting}
            />
          </form>
        )}
      </Formik>
    )
  }

  const InfoSection = () => {
    const InfoItem = ({title, value}) => (
      <tr>
        <th>{title}</th>
        <td className="pl-5 pr-2">:</td>
        <td>{value}</td>
      </tr>
    )

    return (
      <>
        <table className="mt-4">
          <tbody>
            <InfoItem title="Tanggal PPA" value={dataPPA?.ppa?.tgl_ppa} />
            <InfoItem title="No. PPA" value={dataPPA?.ppa?.no_ppa} />
            <InfoItem title="Dari" value={dataPPA?.ppa?.dari} />
            <InfoItem title="Program" value={dataPPA?.ppa?.nama_program} />
            <InfoItem title="Kegiatan" value={dataPPA?.ppa?.nama_kegiatan} />
            <InfoItem title="Sumber Daya" value={dataPPA?.ppa?.sumber_daya} />
          </tbody>
        </table>
      </>
    )
  }

  const AnggaranSection = () => {
    const AnggaranItem = ({title, value}) => (
      <tr>
        <th>{title}</th>
        <td className="pl-5 pr-2">:</td>
        <td className="text-right pl-2">{value}</td>
      </tr>
    )

    return (
      <div className="d-flex flex-column align-items-center mb-4">
        <b className="mb-2">Mata Anggaran</b>
        <table>
          <tr>
            <AnggaranItem title="Pos" value={dataPPA?.ppa?.tipe_anggaran} />
            <AnggaranItem title="Nilai" value={dataPPA?.mata_anggaran?.nominal_anggaran ? RupiahConvert(dataPPA.mata_anggaran.nominal_anggaran.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Realisasi" value={dataPPA?.mata_anggaran?.nominal_terealisasi ? RupiahConvert(dataPPA.mata_anggaran.nominal_terealisasi.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Sisa" value={dataPPA?.mata_anggaran?.nominal_sisa ? RupiahConvert(dataPPA.mata_anggaran.nominal_sisa.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Jumlah Transaksi" value={dataPPA?.mata_anggaran?.jumlah_transaksi ? RupiahConvert(dataPPA.mata_anggaran.jumlah_transaksi.toString()).detail : RupiahConvert('0').detail} />
          </tr>
        </table>
      </div>
    )
  }

  const PersetujuanSection = () => {
    const HeadItem = ({top, bottom}) => (
      <th 
        className="text-center bg-light"
        style={{width: '33.3%'}}
      >
        <div>{top}</div>
        <div>{bottom}</div>
      </th>
    )
    
    const InfoItem = ({nama, tanggal}) => (
      <div style={{fontSize: '14px'}}>
        <div className="d-flex pb-1">
          <div style={{width: '50px'}}>Nama</div>
          <div className="pl-3 pr-2">:</div>
          <div>{nama}</div>
        </div>
        <div className="d-flex">
          <div style={{width: '50px'}}>Tanggal</div>
          <div className="pl-3 pr-2">:</div>
          <div>{tanggal}</div>
        </div>
      </div>
    )

    return (
      <div className="mt-4 pb-3">
        <div className="text-center">
          <b>PERSETUJUAN PRINSIP</b>
        </div>
        <Table 
          bordered
          className="mt-4"
        >
          <thead>
            <tr>
              <HeadItem top="Setuju Diadakan" bottom="(Approved)" />
              <HeadItem top="Diperiksa" bottom="(Checker)" />
              <HeadItem top="Pembuat" bottom="(Maker)" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_approver}
                    width="100"
                  />
                </div>
              </td>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_checker}
                    width="100"
                  />
                </div>
              </td>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_maker}
                    width="100"
                  />
                </div>
              </td>
            </tr>
            <tr>
            <td>
                <InfoItem nama={dataPPA?.persetujuan?.approver} tanggal={dataPPA?.persetujuan?.tgl_approver} />
              </td>
              <td>
                <InfoItem nama={dataPPA?.persetujuan?.checker} tanggal={dataPPA?.persetujuan?.tgl_checker} />
              </td>
              <td>
                <InfoItem nama={dataPPA?.persetujuan?.maker} tanggal={dataPPA?.persetujuan?.tgl_maker} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

  const CatatanSection = () => {
    return (
      <div className="pt-3">
        <b>Catatan :</b>
        <ul>
          <li className="pt-3">
            PPA ini adalah PPA manual yang mengacu pada draft RKAP yang belum melalui RUPS RKAP 2021. Bila terjadi perubahan nilai setelah RUPS dilakukan, maka akan terdapat penyesuaian dalam sistem anggaran.
          </li>
          <li className="pt-3">
            PPA manual ini sebagai dasar proses pengadaan pekerjaan maupun pembayaran & akan diganti dengan PPA di sistem setelah RUPS & upload anggaran selesai dilakukan.
          </li>
        </ul>
      </div>
    )
  }

  const PageContent = () => {
    return (
      <div className="p-5 bg-white shadow-sm">
        <HeadSection />
        <hr />
        <FormSection />
        <hr />
        <InfoSection />
        <AnggaranSection />
        <hr />
        <PersetujuanSection />
        <hr />
        <CatatanSection />
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-end my-3">
        <BackButton onClick={() => history.goBack()} />
      </div>
      <Alert 
        show={alertConfig.show}
        variant={alertConfig.variant}
        text={alertConfig.text}
      />
      {isPageLoading
        ? <DataStatus 
            loading={dataStatus.loading}
            text={dataStatus.text}
          />
        : <PageContent />
      }
    </div>
  )
}

export default TambahRealisasiPPA

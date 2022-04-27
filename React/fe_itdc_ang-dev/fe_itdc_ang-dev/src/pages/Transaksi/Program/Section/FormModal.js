import {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col,
  ModalBody,
  ModalFooter
} from 'react-bootstrap'
import Axios from 'axios'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import {
  Modal,
  DataStatus,
  DatePicker,
  SelectSearch,
  Input,
  TextArea,
  ActionButton
} from 'components'
import { 
  DateConvert 
} from 'utilities'
import {
  ProgramAnggaranApi
} from 'api'

const FormModal = ({processedData, modalConfig, setModalConfig, setAlertConfig, getData}) => {
  const today = DateConvert(new Date()).default
  const [dataUnitOrganisasi, setDataUnitOrganisasi] = useState([])
  const [dataKaryawan, setDataKaryawan] = useState([])
  const [modalFetchingStatus, setModalFetchingStatus] = useState({
    loading: false,
    success: true
  })
  const formInitialValues = {
    tgl_program: modalConfig.type === 'update' ? processedData?.tgl_program : '',
    no_program: modalConfig.type === 'update' ? processedData?.no_program : '',
    nama_program: modalConfig.type === 'update' ? processedData?.nama_program : '',
    id_jabatan: modalConfig.type === 'update' ? processedData?.id_jabatan : '',
    id_karyawan: modalConfig.type === 'update' ? processedData?.id_karyawan : '',
    id_unit_organisasi: modalConfig.type === 'update' ? processedData?.id_unit_organisasi : '',
    periode_mulai: modalConfig.type === 'update' ? processedData?.periode_mulai : '',
    periode_selesai: modalConfig.type === 'update' ? processedData?.periode_selesai : '',
    deskripsi_program: modalConfig.type === 'update' ? processedData?.deskripsi_program : ''
  }

  const formValidationSchema = Yup.object().shape({
    tgl_program: Yup.string()
      .required('Pilih tgl. program'),
    no_program: Yup.string()
      .required('Pilih tgl. program untuk menentukan nomor'),
    nama_program: Yup.string()
      .required('Masukan nama program')
      .test({
        name: 'check-nama',
        message: 'Nama program tidak dapat digunakan karena sudah diregister',
        test: val => modalConfig.type === 'update'
          ? val === processedData.nama_program ? true : ProgramAnggaranApi.checkNama({nama_program: val}).then(() => true).catch(() => false)
          : ProgramAnggaranApi.checkNama({nama_program: val}).then(() => true).catch(() => false)
      }),
    id_unit_organisasi: Yup.string()
      .required('Pilih unit organisasi'),
    id_karyawan: Yup.string()
      .required('Pilih penanggung jawab'),
    periode_mulai: Yup.string()
      .required('Pilih tanggal periode mulai'),
    periode_selesai: Yup.string()
      .required('Pilih tanggal periode selesai'),
  })

  const formSubmitHandler = values => {
    modalConfig.type === 'create' 
      ? ProgramAnggaranApi.create(values)
          .then(() => {
            setAlertConfig({
              show: true,
              variant: 'primary',
              text: 'Data berhasil disimpan!'
            })
          })
          .catch(() => {
            setAlertConfig({
              show: true,
              variant: 'danger',
              text: 'Data gagal disimpan!'
            })
          })
          .finally(() => {
            setModalConfig({
              ...modalConfig,
              show: false
            })
            getData()
          })
      : ProgramAnggaranApi.update({...values, id_program: processedData.id_program})
          .then(() => {
            setAlertConfig({
              show: true,
              variant: 'primary',
              text: 'Data berhasil diubah!'
            })
          })
          .catch(() => {
            setAlertConfig({
              show: true,
              variant: 'danger',
              text: 'Data gagal diubah!'
            })
          })
          .finally(() => {
            setModalConfig({
              ...modalConfig,
              show: false
            })
            getData()
          })

  }
  
  const mappingDataKaryawan = data => data.map(val => {
    return {
      label: `${val.nama_karyawan} ${val.nama_jabatan ? `- ${val.nama_jabatan}` : ''}`,
      value: val.id_karyawan,
      idJabatan: val.id_jabatan
    }
  })

  const mappingDataUnitOrganisasi = data => data.map(val => {
    return {
      label: val.nama_unit_organisasi,
      value: val.id_unit_organisasi
    }
  })

  const getInitialDataModal = () => {
    setModalFetchingStatus({
      loading: true,
      success: false
    })

    Axios.all([
      ProgramAnggaranApi.getDropdownKaryawan(),
      ProgramAnggaranApi.getDropdownUnitOrganisasi()
    ])
      .then(Axios.spread((karyawan, unit) => {
        const dataKaryawan = karyawan.data.data
        const dataUnit = unit.data.data
        const mapDataKaryawan = mappingDataKaryawan(dataKaryawan ?? [])
        const mapDataUnitOrganisasi = mappingDataUnitOrganisasi(dataUnit ?? [])

        setDataKaryawan(mapDataKaryawan)
        setDataUnitOrganisasi(mapDataUnitOrganisasi)
        setModalFetchingStatus({
          loading: false,
          success: true
        })
      }))
      .catch(() => {
        setModalFetchingStatus({
          loading: false,
          success: false
        })
      })
  }


  useEffect(() => {
    getInitialDataModal()
  }, [])
  
  const FormSection = ({formik}) => {
    const [isNomorLoading, setIsNomorLoading] = useState(false)
    const {values, errors, touched, setValues, setFieldValue, handleChange, handleSubmit, isSubmitting} = formik

    const getNomorHandler = date => {
      setIsNomorLoading(true)
  
      ProgramAnggaranApi.getNomor({tanggal: date})
        .then(data => {
          const nomor = data?.data?.data ?? ''
  
          setValues({
            ...values,
            tgl_program: date,
            no_program: nomor
          })
        })
        .catch(() => window.alert('Nomor gagal dimuat!'))
        .finally(() => setIsNomorLoading(false))
    }
    
    useEffect(() => {
      modalConfig.type === 'create' && getNomorHandler(today)
    }, [])

    return (
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            {/* Tgl. program */}
            <Col md>
              <DatePicker
                label="Tgl. Program"
                placeholderText="Pilih tanggal program"
                selected={values.tgl_program ? new Date(values.tgl_program) : ''}
                onChange={date => {
                  const newDate = DateConvert(date).default
                  modalConfig.type === 'create' && getNomorHandler(newDate)
                  modalConfig.type === 'update' && setFieldValue('tgl_program', date)
                }}
                error={errors.tgl_program && touched.tgl_program && true}
                errorText={errors.tgl_program && touched.tgl_program && errors.tgl_program}
              />
            </Col>
            {/* No. program */}
            <Col md>
              <Input 
                readOnly
                label="No. Program"
                placeholder="Pilih tgl untuk menentukan nomor"
                value={isNomorLoading ? 'Memuat nomor . . .' : values.no_program}
                error={errors.no_program && touched.no_program && true}
                errorText={errors.no_program && touched.no_program && errors.no_program}
              />
            </Col>
          </Row>
          {/* Nama program */}
          <Input 
            label="Nama Program"
            name="nama_program"
            placeholder="Masukan nama program"
            value={values.nama_program}
            onChange={handleChange}
            error={errors.nama_program && touched.nama_program && true}
                errorText={errors.nama_program && touched.nama_program && errors.nama_program}
          />
          <Row>
            {/* Unit organisasi */}
            <Col md>
              <SelectSearch 
                label="Unit Organisasi"
                placeholder="Pilih unit organisasi"
                option={dataUnitOrganisasi}
                defaultValue={values.id_unit_organisasi
                  ? dataUnitOrganisasi.find(val => val.value === values.id_unit_organisasi)
                  : ''
                }
                onChange={val => setFieldValue('id_unit_organisasi', val.value)}
                error={errors.id_unit_organisasi && touched.id_unit_organisasi && true}
                errorText={errors.id_unit_organisasi && touched.id_unit_organisasi && errors.id_unit_organisasi}
              />
            </Col>
            {/* Penanggung jawab */}
            <Col md>
              <SelectSearch 
                label="Penanggung Jawab"
                placeholder="Pilih penanggung jawab"
                option={dataKaryawan}
                defaultValue={values.id_karyawan
                  ? dataKaryawan.find(val => val.value === values.id_karyawan)
                  : ''
                }
                onChange={val => {
                  setValues({
                    ...values,
                    id_karyawan: val.value,
                    id_jabatan: val.idJabatan
                  })
                }}
                error={errors.id_karyawan && touched.id_karyawan && true}
                errorText={errors.id_karyawan && touched.id_karyawan && errors.id_karyawan}
              />
            </Col>
          </Row>
          <Row>
            {/* Periode mulai */}
            <Col md>
              <DatePicker
                showMonthYearPicker
                showFullMonthYearPicker
                dateFormat="MM/yyyy"
                label="Periode Mulai"
                placeholderText="Pilih tanggal periode mulai"
                selected={values.periode_mulai ? new Date(values.periode_mulai) : ''}
                onChange={date => setFieldValue('periode_mulai', DateConvert(date).default)}
                error={errors.periode_mulai && touched.periode_mulai && true}
                errorText={errors.periode_mulai && touched.periode_mulai && errors.periode_mulai}
              />
            </Col>
            {/* Periode selesai */}
            <Col md>
              <DatePicker
                label="Periode Selesai"
                showMonthYearPicker
                showFullMonthYearPicker
                dateFormat="MM/yyyy"
                placeholderText="Pilih tanggal periode selesai"
                selected={values.periode_selesai ? new Date(values.periode_selesai) : ''}
                onChange={date => setFieldValue('periode_selesai', DateConvert(date).default)}
                error={errors.periode_selesai && touched.periode_selesai && true}
                errorText={errors.periode_selesai && touched.periode_selesai && errors.periode_selesai}
              />
            </Col>
          </Row>
          {/* Deskripsi */}
          <TextArea 
            label="Deskripsi"
            name="deskripsi_program"
            value={values.deskripsi_program}
            placeholder="Masukan deskripsi"
            onChange={handleChange}
          />
        </ModalBody>
        <ModalFooter>
          <ActionButton
            type="submit"
            variant={modalConfig.type === 'update' ? 'success' : 'primary'}
            text={modalConfig.type === 'update' ? 'Ubah Program' : 'Tambah Program'}
            loading={isSubmitting}
          />
        </ModalFooter>
      </form>
    )
  }

  // Menampilkan page loading
  if (modalFetchingStatus.loading) {
    return (
      <Modal
      closeButton
      size="lg"
      show={modalConfig.show && modalConfig.type !== 'delete'}
      title={modalConfig.type === 'update' ? 'Ubah Program' : 'Tambah Program'}
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
      <div className="py-5">
        <DataStatus loading text="Memuat data . . ." />
      </div>
    </Modal>
    )
  }

  // Menampilkan saat gagal memuat data
  if (!modalFetchingStatus.loading && !modalFetchingStatus.success) {
    return (
      <Modal
      closeButton
      size="lg"
      show={modalConfig.show && modalConfig.type !== 'delete'}
      title={modalConfig.type === 'update' ? 'Ubah Program' : 'Tambah Program'}
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
      <div className="py-5">
        <DataStatus text="Data gagal dimuat . . ." />
      </div>
    </Modal>
    )
  }

  return (
    <Modal
      closeButton
      size="lg"
      show={modalConfig.show && modalConfig.type !== 'delete'}
      title={modalConfig.type === 'update' ? 'Ubah Program' : 'Tambah Program'}
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
      <Formik
        initialValues={formInitialValues}
        validationSchema={formValidationSchema}
        onSubmit={formSubmitHandler}
      >
        {formik => <FormSection formik={formik} />}
      </Formik>
    </Modal>
  )
}

export default FormModal
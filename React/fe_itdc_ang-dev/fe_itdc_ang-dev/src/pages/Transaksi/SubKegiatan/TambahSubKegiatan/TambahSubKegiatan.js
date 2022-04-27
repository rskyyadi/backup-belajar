import {
  useState,
  useEffect
} from 'react'
import {
  useHistory
} from 'react-router-dom'
import {
  Card
} from 'react-bootstrap'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {  
  BackButton, 
  DataStatus 
} from 'components'
import {
  SubKegiatanApi
} from 'api'
import {
  InfoSection,
  FormSection,
  TableSection
} from './Section'

const TambahSubKegiatan = ({setNavbarTitle}) => {
  const history = useHistory()
  const [dataInfo, setDataInfo] = useState({})
  const [dataTable, setDataTable] = useState([])
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: true,
    success: false
  })

  // Mapping data
  const mappingDataInfo = data => {
    return {
      id_kegiatan: data.id_kegiatan ?? null,
      tgl_kegiatan: data.tgl_kegiatan ?? null,
      no_kegiatan: data.no_kegiatan ?? '-',
      nama_kegiatan: data.nama_kegiatan ?? '-',
      penanggung_jawab: data.nama_karyawan ?? '-',
      periode_awal: data.periode_mulai ?? null,
      periode_akhir: data.periode_selesai ?? null,
      program: data.nama_program ?? '-'
    }
  }
  const mappingDataTable = data => data.map(val => {
    return {
      is_terdaftar: '',
      id_kategori: '',
      nama_kategori: '',
      id_buaso: '',
      nama_buaso: '',
      id_item: '',
      nama_item: '',
      id_satuan: '',
      nama_satuan: '',
      id_pengadaan: '',
      id_anggaran: '',
      pos_anggaran: '',
      qty_item: '',
      harga: '',
    }
  })

  // Kebutuhan Formik
  const formInitialValues = {
    tgl_sub_kegiatan: '',
    no_sub_kegiatan: '',
    tgl_mulai: '',
    tgl_selesai: '',
    nama_sub_kegiatan: '',
    id_penanggung_jawab: '',
    keterangan: '',
    is_aset: false,
    is_wip: false
  }
  const formValidationSchema = Yup.object().shape({
    tgl_sub_kegiatan: Yup.string().required('Pilih tgl. sub kegiatan'),
    no_sub_kegiatan: Yup.string().required('Pilih tgl. untuk menentukan nomor'),
    tgl_mulai: Yup.string().required('Pilih tgl. mulai'),
    tgl_selesai: Yup.string().required('Pilih tgl. selesai'),
    nama_sub_kegiatan: Yup.string().required('Masukan nama sub kegiatan'),
    id_penanggung_jawab: Yup.string().required('Pilih penanggung jawab')
  })
  const formSubmitHandler = () => {

  }
  
  const getInitialData = () => {
    setFetchingStatus({
      loading: true,
      success: false
    })

    Axios.all([
      SubKegiatanApi.getSingleKegiatan({id_kegiatan: 27})
    ])
      .then(Axios.spread((kegiatan) => {
        const rawKegiatan = kegiatan.data.data
        const mapKegiatan = mappingDataInfo(rawKegiatan ?? {})

        setDataInfo(mapKegiatan)
        setFetchingStatus({
          loading: false,
          success: true
        })
      }))
      .catch(() => {
        setFetchingStatus({
          loading: false,
          success: false
        })
      })
  }

  useEffect(() => {
    setNavbarTitle('Sub Kegiatan')
    getInitialData()
  }, [])

  // Tampilan saat loading atau data gagal dimuat
  if (fetchingStatus.loading || !fetchingStatus.success) {
    return (
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <b>Tambah Sub Kegiatan</b>
          <BackButton size="sm" onClick={() => history.goBack()} />
        </Card.Header>
        <Card.Body>
          {fetchingStatus.loading
            ? <DataStatus loading text="Memuat data . . ." />
            : <DataStatus text="Data gagal dimuat" />
          }
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <b>Tambah Sub Kegiatan</b>
          <BackButton size="sm" onClick={() => history.goBack()} />
        </Card.Header>
        <Card.Body>
          <Formik
            initialValues={formInitialValues}
            validationSchema={formValidationSchema}
            onSubmit={formSubmitHandler}
          >
            {formik => (
              <form>
                <InfoSection dataInfo={dataInfo} />
                <hr />
                <FormSection formik={formik} />
                <hr />
                <TableSection 
                  dataTable={dataTable} 
                  setDataTable={setDataTable}
                />
              </form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </>
  )
}

export default TambahSubKegiatan

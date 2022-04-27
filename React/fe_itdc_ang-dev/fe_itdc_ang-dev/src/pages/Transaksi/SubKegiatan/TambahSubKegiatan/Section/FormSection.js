import {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col
} from 'react-bootstrap'
import Axios from 'axios'
import { 
  DatePicker,
  Input,
  RadioButton,
  SelectSearch,
  TextArea
} from 'components'
import { 
  DateConvert 
} from 'utilities'


const getDummyNomor = date => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: {data: 'DUMMYNO' + date}
    })
  }, 300)
})

const getDummyPenanggungJawab = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: {
        data: [
          {
            id_penanggung_jawab: 1,
            nama_penanggung_jawab: 'Penanggung Jawab 01'
          },
          {
            id_penanggung_jawab: 2,
            nama_penanggung_jawab: 'Penanggung Jawab 02'
          },
          {
            id_penanggung_jawab: 3,
            nama_penanggung_jawab: 'Penanggung Jawab 03'
          },
        ]
      }
    })
  }, 300)
}) 

const FormSection = ({formik}) => {
  const today = DateConvert(new Date()).default
  const {values, errors, touched, handleChange, setFieldValue, setValues} = formik
  const [dataPenanggungJawab, setDataPenanggungJawab] = useState([])
  const [loading, setLoading] = useState({
    nomor: false,
    penanggungJawab: false
  })

  // Mapping data
  const mappingDataPJ = data => data.map(val => {
    return {
      value: val.id_penanggung_jawab,
      label: val.nama_penanggung_jawab
    }
  })

  // Fetch saat pertama kali page dibuka
  const getInitialData = () => {
    setLoading({
      nomor: true,
      penanggungJawab: true
    })

    Axios.all([
      getDummyPenanggungJawab(),
      getDummyNomor(today)
    ])
      .then(Axios.spread((pj, no) => {
        const nomor = no.data.data
        const rawDataPJ = pj.data.data
        const mapDataPJ = mappingDataPJ(rawDataPJ ?? [])

        setDataPenanggungJawab(mapDataPJ)
        setValues({
          ...values,
          no_sub_kegiatan: nomor,
          tgl_sub_kegiatan: today
        })
      }))
      .catch(() => {
        window.alert('Gagal memuat data penanggung jawab & nomor gagal')
      })
      .finally(() => {
        setLoading({
          nomor: false,
          penanggungJawab: false
        })
      })
  }

  // Fetch nomor
  const getNomorHandler = date => {
    setLoading({
      ...loading,
      nomor: true
    })

    getDummyNomor(date)
      .then(res => {
        const nomor = res.data.data

        setValues({
          ...values,
          tgl_sub_kegiatan: date,
          no_sub_kegiatan: nomor
        })
      })
      .catch(() => {
        setValues({
          ...values,
          tgl_sub_kegiatan: '',
          no_sub_kegiatan: ''
        })
      })
      .finally(() => {
        setLoading({
          ...loading,
          nomor: false
        })
      })
  }

  useEffect(() => {
    getInitialData()
  }, [])

  return (
    <>
      <Row>
        <Col md>
          <Row>
            {/* Tanggal Sub Kegiatan */}
            <Col md>
              <DatePicker 
                label="Tgl. Sub Kegiatan"
                placeholderText={loading.nomor ? 'Memuat tanggal . . .' :'Pilih tanggal sub kegiatan'}
                selected={loading.nomor ? '' : values.tgl_sub_kegiatan ? new Date(values.tgl_sub_kegiatan) : ''}
                onChange={date => getNomorHandler(DateConvert(date).default)}
                error={Boolean(errors.tgl_sub_kegiatan && touched.tgl_sub_kegiatan)}
                errorText={Boolean(errors.tgl_sub_kegiatan && touched.tgl_sub_kegiatan) && errors.tgl_sub_kegiatan}
              />
            </Col>

            {/* No Sub Kegiatan */}
            <Col md>
              <Input 
                readOnly
                label="No. Sub Kegiatan"
                placeholder="Pilih tgl. kegiata untuk menentukan nomor"
                value={loading.nomor ? 'Memuat nomor . . .' : values.no_sub_kegiatan}
                error={Boolean(errors.no_sub_kegiatan && touched.no_sub_kegiatan)}
                errorText={Boolean(errors.no_sub_kegiatan && touched.no_sub_kegiatan) && errors.no_sub_kegiatan}
              />
            </Col>
          </Row>
          <Row>
            {/* Tanggal Mulai */}
            <Col md>
              <DatePicker 
                label="Tgl. Mulai"
                placeholderText="Pilih tanggal mulai"
                selected={values.tgl_mulai ? new Date(values.tgl_mulai) : ''}
                onChange={date => setFieldValue('tgl_mulai', DateConvert(date).default)}
                error={Boolean(errors.tgl_mulai && touched.tgl_mulai)}
                errorText={Boolean(errors.tgl_mulai && touched.tgl_mulai) && errors.tgl_mulai}
              />
            </Col>

            {/* Tanggal Selesai */}
            <Col md>
              <DatePicker 
                label="Tgl. Selesai"
                placeholderText="Pilih tanggal selesai"
                selected={values.tgl_selesai ? new Date(values.tgl_selesai) : ''}
                onChange={date => setFieldValue('tgl_selesai', DateConvert(date).default)}
                error={Boolean(errors.tgl_selesai && touched.tgl_selesai)}
                errorText={Boolean(errors.tgl_selesai && touched.tgl_selesai) && errors.tgl_selesai}
              />
            </Col>
          </Row>
        </Col>
        <Col md>
          {/* Nama Sub Kegiatan */}
          <Input 
            label="Nama Sub Kegiatan"
            placeholder="Masukan nama sub kegiatan"
            name="nama_sub_kegiatan"
            value={values.nama_sub_kegiatan}
            onChange={handleChange}
            error={Boolean(errors.nama_sub_kegiatan && touched.nama_sub_kegiatan)}
            errorText={Boolean(errors.nama_sub_kegiatan && touched.nama_sub_kegiatan) && errors.nama_sub_kegiatan}
          />

          {/* Penanggung Jawab */}
          <SelectSearch 
            label="Penanggung Jawab"
            placeholder="Pilih penanggung jawab"
            defaultValue={dataPenanggungJawab.find(val => val.value === values.id_penanggung_jawab) ?? ''}
            option={dataPenanggungJawab}
            error={Boolean(errors.id_penanggung_jawab && touched.id_penanggung_jawab)}
            errorText={Boolean(errors.id_penanggung_jawab && touched.id_penanggung_jawab) && errors.id_penanggung_jawab}
            loading={loading.penanggungJawab}
          />
        </Col>
      </Row>
      <Row>
        <Col md>
          <TextArea 
            label="Keterangan"
            placeholder="Masukan keterangan"
            name="keterangan"
            onChange={handleChange}
            value={values.keterangan}
            rows={4}
          />
        </Col>
          <Col md className="d-flex flex-column pt-md-3">
            {/* Non Aset */}
            <RadioButton 
              label="Non Aset"
              name="type"
              id="non-aset"
              checked={!values.is_aset}
              onChange={() => setValues({
                ...values,
                is_aset: false,
                is_wip: false
              })}
            />

            {/* Aset */}
            <RadioButton 
              label="Aset"
              name="type"
              id="aset"
              checked={values.is_aset}
              onChange={() => setValues({
                ...values,
                is_aset: true,
                is_wip: true
              })}
            />
            <div className="d-flex flex-column ml-4">
              <RadioButton 
                label="WIP"
                name="aset"
                value="wip"
                id="wip"
                checked={values.is_wip && values.is_aset}
                disabled={!values.is_aset}
                onChange={() => setFieldValue('is_wip', true)}
              />
              <RadioButton 
                label="Non WIP"
                name="aset"
                value="non wip"
                id="non-wip"
                checked={!values.is_wip && values.is_aset}
                disabled={!values.is_aset}
                onChange={() => setFieldValue('is_wip', false)}
              />
            </div>
        </Col>
      </Row>
    </>
  )
}

export default FormSection

import React, {
  useState,
  useEffect
} from 'react'
import {
  Card,
  Nav
} from 'react-bootstrap'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlParser from 'html-react-parser'
import {
  Input,
  TextArea,
  TextEditor,
  RadioButtonWrapper,
  RadioButton,
  Select,
  SelectSearch,
  ActionButton
} from 'components'
import {
  DateConvert,
  RupiahConvert
} from 'utilities'

const Dashboard = ({setNavbarTitle}) => {
  
  useEffect(() => {
    setNavbarTitle('Dashboard')
  }, [setNavbarTitle])

  const ContohUtilitas = () => {
    const [date, setDate] = useState('')
    const [nominal, setNominal] = useState('')

    return (
      <div>
        {/* DATE CONVERT */}
        <label>TANGGAL (DateConvert)</label>
        <div className="row">
          <div className="col-4 mb-3">
            <small>Pilih Tanggal</small>
            <input 
              type="date" 
              className="form-control" 
              onChange={e => setDate(e.target.value)}
            />
          </div>
          {/* DETAIL */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).detail</small>
            <p>{date ? DateConvert(new Date(date)).detail : 'Pilih Tanggal'}</p>
          </div>
          {/* DEFAULT */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).default</small>
            <p>{date ? DateConvert(new Date(date)).default : 'Pilih Tanggal'}</p>
          </div>
          {/* DEFAULT DAY */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).defaultDay</small>
            <p>{date ? DateConvert(new Date(date)).defaultDay : 'Pilih Tanggal'}</p>
          </div>
          {/* DEFAULT MONTH */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).defaultMonth</small>
            <p>{date ? DateConvert(new Date(date)).defaultMonth : 'Pilih Tanggal'}</p>
          </div>
          {/* DEFAULT YEAR */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).defaultYear</small>
            <p>{date ? DateConvert(new Date(date)).defaultYear : 'Pilih Tanggal'}</p>
          </div>
          {/* DETAIL DAY */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).detailDay</small>
            <p>{date ? DateConvert(new Date(date)).detailDay : 'Pilih Tanggal'}</p>
          </div>
          {/* DETAIL MONTH */}
          <div className="col-4 mb-3">
            <small>DateConvert(new Date(tanggal)).detailMonth</small>
            <p>{date ? DateConvert(new Date(date)).detailMonth : 'Pilih Tanggal'}</p>
          </div>
        </div>
        <hr />

        {/* RUPIAH CONVERT */}
        <label>RUPIAH (RupiahConvert)</label>
        <div className="row">
          <div className="col">
            <small>Masukan Nominal</small>
            <input 
              type="number"
              placeholder="Masukan nominal"
              className="form-control"
              onChange={e => setNominal(e.target.value)}
            />
          </div>
          {/* DETAIL */}
          <div className="col">
            <small>RupiahConvert(masukan nominal).detail</small>
            <p>{nominal ? RupiahConvert(nominal).detail : 'Masukan nominal'}</p>
          </div>
          {/* DEFAULT */}
          <div className="col">
            <small>RupiahConvert(masukan nominal).default</small>
            <p>{nominal ? RupiahConvert(nominal).default : 'Masukan nominal'}</p>
          </div>
        </div>
      </div>
    )
  }

  // Convert hasil text editor ke html
  const ContohHasilTextEditor = ({value}) => (
    <div className="mb-3">
      <label>Contoh Hasil Text Editor</label>
      <div className="p-3 border">
        {value
          ? htmlParser(value)
          : <div className="text-secondary" style={{opacity: .5}}>Masukan isi text editor</div>
        }
      </div>
    </div>
  )

  const ContohForm = () => {
    // kondisi form (tambah/ubah)
    const isUpdateform = false //ubah untuk mencoba

    // contoh data text editor saat sedang mengubah data
    const textEditorData = '<h1>Tes Text Editor</h1>'

    // state untuk text editor
    const [textEditorState, setTextEditorState] = useState(() => {
      return isUpdateform === true
        ? EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(textEditorData)))
        : EditorState.createEmpty()
    })
    
    // memperbaharui state text editor
    const updateEditorState = (value, setFieldValue) => {
      setTextEditorState(value)

      const convertData = convertToRaw(value.getCurrentContent())

      setFieldValue('contohTextEditor', draftToHtml(convertData))
    }


    // data untuk option select search
    const contohDataSelectSearch = [
      {id: 1, nama: 'dewa'},
      {id: 2, nama: 'ary poyok'},
      {id: 3, nama: 'risky'},
    ]

    const formInitialValues = {
      contohInput: '',
      contohTextArea: '',
      contohTextEditor: '',
      contohRadio: '',
      contohSelect: '',
      contohSelectSearch: ''
    }

    const formValidationSchema = Yup.object().shape({
      contohInput: Yup.string()
        .required('Masukan contoh input'),
      contohTextArea: Yup.string()
        .required('Masukan contoh text area'),
      contohTextEditor: Yup.string()
        .test('checkEmpty', 'Masukan contoh text editor', val => val === undefined ? false : val.trim() !== '<p></p>')
        .required('Masukan isi text editor'),
      contohRadio: Yup.string()
        .required('Masukan contoh radio button'),
      contohSelect: Yup.string()
        .required('Pilih nilai contoh select'),
      contohSelectSearch: Yup.string()
        .required('Plih nilai contoh select search'),
    })

    const formSubmitHandler = (value, {setSubmitting}) => {
      setTimeout(() => {
        alert(JSON.stringify(value))
        setSubmitting(false)
      }, 1000)

    }

    return (
      <Formik
        initialValues={formInitialValues}
        validationSchema={formValidationSchema}
        onSubmit={formSubmitHandler}
      >
        {({values, errors, touched, isSubmitting, setFieldValue, handleChange, handleSubmit}) => (
          <form onSubmit={handleSubmit}>
            
            {/* CONTOH KOMPONEN INPUT */}
            <Input 
              label="Contoh Input"
              type="text"
              placeholder="Masukan contoh input"
              name="contohInput"
              value={values.contohInput}
              onChange={handleChange}
              error={errors.contohInput && touched.contohInput && true}
              errorText={errors.contohInput}
            />
            <hr />

            {/* /CONTOH KOMPONEN TEXT AREA */}
            <TextArea
              label="Contoh Text Area"
              placeholder="Masukan contoh text area"
              name="contohTextArea"
              value={values.contohTextArea}
              onChange={handleChange}
              error={errors.contohTextArea && touched.contohTextArea && true}
              errorText={errors.contohTextArea}
              rows={5} //menentukan tinggi text area
            />
            <hr />

            {/* CONTOH KOMPONEN TEXT EDITOR */}
            <TextEditor 
              label="Contoh Text Editor"
              placeholder="Masukan contoh text editor"
              editorState={textEditorState}
              onEditorStateChange={val => updateEditorState(val, setFieldValue)}
              error={errors.contohTextEditor && touched.contohTextEditor && true}
              errorText={errors.contohTextEditor && touched.contohTextEditor && errors.contohTextEditor}
            />
            <ContohHasilTextEditor value={values.contohTextEditor} />
            <hr />
        
            {/* CONTOH KOMPONEN RADIO BUTTON */}
            <RadioButtonWrapper
              label="Contoh Radio Button"
              errorText={errors.contohRadio && touched.contohRadio && errors.contohRadio}
            >
              <RadioButton 
                id="radioBtn1"
                name="contohRadio"
                label="Radio Button 1"
                value="Radio Button 1"
                onChange={handleChange}
                error={errors.contohRadio && touched.contohRadio && true}
              />
              <RadioButton 
                id="radioBtn2"
                name="contohRadio"
                label="Radio Button 2"
                value="Radio Button 2"
                onChange={handleChange}
                error={errors.contohRadio && touched.contohRadio && true}
              />
            </RadioButtonWrapper>
            <hr />
          
            {/* CONTOH KOMPONEN SELECT */}
            <Select
              label="Contoh Select"
              name="contohSelect"
              onChange={handleChange}
              error={errors.contohSelect && touched.contohSelect && true}
              errorText={errors.contohSelect}
              defaultValue="" // untuk menyesuaikan nilai yang telah dipilih
            >
              <option value="">Pilih Nilai</option>
              <option value="Select 1">Select 1</option>
              <option value="Select 2">Select 2</option>
            </Select>
            <hr />

            {/* CONTOH KOMPONEN SELECT SEARCH */}
            <SelectSearch
              label="Contoh Select Search"
              name="contohSelectSearch"
              placeholder="Pilih orang"
              onChange={val => setFieldValue('contohSelectSearch', val.value)}
              option={contohDataSelectSearch.map(val => {
                return {
                  value: val.id,
                  label: val.nama
                }
              })} //option harus berupa value dan label
              defaultValue="" // default value harus berupa: {{ label: 'masukan label', value: 'masukan value' }}
              error={errors.contohSelectSearch && touched.contohSelectSearch && true}
              errorText={errors.contohSelectSearch && touched.contohSelectSearch && errors.contohSelectSearch}
            />
            <hr />

            {/* CONTOH KOMPONENT ACTION BUTTON */}
            <ActionButton 
              type="submit"
              varian="primary" //warna pada button: primary, success, danger, warning dll (configurasi bootstrap)
              text="Submit"
              disable={false}
              loading={isSubmitting}
            />
          </form>
        )}
      </Formik>
    )
  }

  const ContohTabs = () => {
    const [page, setPage] = useState('page1')

    return (
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="#page1">
            <Nav.Item>
              <Nav.Link 
                href="#page1"
                onClick={() => setPage('page1')}
              >
                Page 1
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                href="#page2"
                onClick={() => setPage('page2')}
              >
                Page 2
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {
            page === 'page1'
              ? <h3 className="text-center">Page 1</h3>
              : <h3 className="text-center">Page 2</h3>
          }
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <h2>Dashboard Anggaran</h2>
          {/* <Card.Title>CONTOH PENGGUNAAN UTILITAS</Card.Title>
          <hr />
          <ContohUtilitas />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>CONTOH PENGGUNAAN KOMPONEN FORM</Card.Title>
          <hr />
          <ContohForm />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>CONTOH PENGGUNAAN KOMPONEN TABS</Card.Title>
          <hr />
          <ContohTabs/> */}
        </Card.Body>
      </Card>
    </>
  )
}

export default Dashboard

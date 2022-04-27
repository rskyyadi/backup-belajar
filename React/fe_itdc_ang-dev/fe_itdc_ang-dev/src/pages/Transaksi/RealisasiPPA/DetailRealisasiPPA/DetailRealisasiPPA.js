import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import {
  useHistory,
  useParams
} from 'react-router-dom'
import ReactToPrint from 'react-to-print'
import {
  ActionButton,
  BackButton,
  DataStatus
} from 'components'
import {
  PPAApi
} from 'api'
import PrintRealisasiPPA from '../PrintRealisasiPPA'

const DetailRealisasiPPA = ({setNavbarTitle}) => {
  const componentRef = useRef()
  const history = useHistory()
  const {id} = useParams()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataPPA, setDataPPA] = useState([])
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: ''
  })
  const [dataStatusConfig, setDataStatusConfig] = useState({
    loading: true,
    text: 'Memuat data . . .'
  })

  const getInitialData = () => {
    setIsPageLoading(true)
    setDataStatusConfig({
      loading: true,
      text: 'Memuat data . . .'
    })

    PPAApi.getDetail({
      id_ppa: id
    })
      .then(({data}) => {
        setDataPPA(data.data)
        setIsPageLoading(false)
      })
      .catch(() => {
        setAlertConfig({
          show: true,
          variant: 'danger',
          text: 'Data gagal dimuat!'
        })
        setDataStatusConfig({
          loading: false,
          text: 'Tidak ada data'
        })
      })
  }

  useEffect(() => {
    setNavbarTitle('Detail Realisasi PPA')
    getInitialData()
    
    return () => {}
  }, [])
  console.log('y', dataPPA)
  return(
    <div>
      <div className="d-flex justify-content-between align-items-center my-3">
        <BackButton onClick={() => history.goBack()} />
        <ReactToPrint 
          trigger={() => <ActionButton text="Cetak PPA" />}
          content={() => componentRef.current}
        />
      </div>
      {
        isPageLoading
          ? <DataStatus 
              loading={dataStatusConfig.loading}
              text={dataStatusConfig.text}
            />
          : <div className="shadow-sm">
              <PrintRealisasiPPA 
                ref={componentRef}
                dataPPA={dataPPA}
              />
            </div>
      }
      </div>
  )
}

export default DetailRealisasiPPA
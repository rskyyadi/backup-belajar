import React, {
  useState,
  useRef,
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
  DataStatus,
  Alert
} from 'components'
import {
  PPAApi
} from 'api'
import PrintPPA from '../PrintPPA'

const CetakPPA = ({setNavbarTitle}) => {
  const {id} = useParams()
  const history = useHistory()
  const componentRef = useRef()
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [dataPPA, setDataPPA] = useState({})
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: ''
  })
  const [dataStatusConfig, setDataStatusConfig] = useState({
    loading: false,
    text: ''
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
    setNavbarTitle('Print PPA')
    getInitialData()

    return () => {
      
    }
  }, [])
  
  return(
    <div>
      <div className="d-flex justify-content-between align-items-center my-3">
        <BackButton onClick={() => history.goBack()} />
        {!isPageLoading && <ReactToPrint 
            trigger={() => <ActionButton text="Cetak PPA" />}
            content={() => componentRef.current}
          />
        }
      </div>
      <Alert 
        show={alertConfig.show}
        variant={alertConfig.variant}
        text={alertConfig.text}
      />
      {isPageLoading
        ? <DataStatus 
            loading={dataStatusConfig.loading}
            text={dataStatusConfig.text}
          />
        : <div className="shadow-sm">
            <PrintPPA 
              ref={componentRef} 
              dataPPA={dataPPA}
            />
          </div>
      }
    </div>
  )
}

export default CetakPPA
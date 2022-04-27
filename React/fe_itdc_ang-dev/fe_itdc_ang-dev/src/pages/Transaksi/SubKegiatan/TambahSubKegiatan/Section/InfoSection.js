import React from 'react'
import {
  Row,
  Col
} from 'react-bootstrap'
import { 
  InfoItemHorizontal 
} from 'components'
import { 
  DateConvert 
} from 'utilities'

const InfoSection = ({dataInfo}) => {
  return (
    <Row>
      <Col md>
        <InfoItemHorizontal 
          width={150}
          label="Tgl. Kegiatan"
          text={dataInfo.tgl_kegiatan ? DateConvert(new Date(dataInfo.tgl_kegiatan)).detail : '-'}
        />
        <InfoItemHorizontal 
          width={150}
          label="No. Kegiatan"
          text={dataInfo.no_kegiatan}
        />
        <InfoItemHorizontal 
          width={150}
          label="Nama. Kegiatan"
          text={dataInfo.nama_kegiatan}
        />
        <InfoItemHorizontal 
          width={150}
          label="Penanggung Jawab"
          text={dataInfo.penanggung_jawab}
        />
      </Col>
      <Col md>
        <InfoItemHorizontal 
          width={150}
          label="Periode Awal"
          text={dataInfo.periode_awal}
        />
        <InfoItemHorizontal 
          width={150}
          label="Periode Akhir"
          text={dataInfo.periode_akhir}
        />
        <InfoItemHorizontal 
          width={150}
          label="Program"
          text={dataInfo.program}
        />
      </Col>
    </Row>
  )
}

export default InfoSection

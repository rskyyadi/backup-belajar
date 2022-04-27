import React, {
  useState,
  useEffect
} from 'react'
import {
  Row,
  Col,
  ModalBody,
  Card
} from 'react-bootstrap'
import {
  Modal,
  InfoItemVertical,
  DataStatus
} from 'components'
import { 
  DateConvert 
} from 'utilities'
import {
  ProgramAnggaranApi
} from 'api'

const DetailModal = ({processedData, modalConfig, setModalConfig}) => {
  const [dataProgram, setDataProgram] = useState({})
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: true,
    success: false
  })

  const getInitialData = () => {
    setFetchingStatus({
      loading: true,
      success: false
    })

    ProgramAnggaranApi.getSingle(processedData.id_program)
      .then(val => {
        setDataProgram(val.data.data ?? {})
        setFetchingStatus({
          loading: false,
          success: true
        })
      })
      .catch(() => {
        setFetchingStatus({
          loading: false,
          success: false
        })
      })
  }

  useEffect(() => {
    getInitialData()
  }, [])

  const CatatanApproval = () => {
    const dataStakeholder = dataProgram.stakeholder ?? []

    const InfoItem = ({ title1, value1, title2, value2 }) => (
      <div className="mb-2">
        <small>{title1}</small>
        <br />
        <b>{value1}</b>
        <div className="mt-1" />
        <small>{title2}</small>
        <br />
        <b>{value2}</b>
      </div>
    )

    return (
      <Card className="mt-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <b>Catatan Approval Program</b>
        </Card.Header>
        <Card.Body>
            {dataStakeholder.length > 1
              ? <Row>
                  {dataStakeholder.map((val, index) => index !== 0 && val.status_approval !== "PEN" && (
                    <Col sm>
                      {console.log('jalan')}
                      <InfoItem
                        title1={
                          val.status_approval === "VER" || val.status_approval === "REV"
                            ? `Pemeriksa ${val.approval_level !== "0" ? val.approval_level : ""}`
                            : val.status_approval === "APP"
                              ? "Pengesah"
                              : "Di Tolak Oleh"
                        }
                        value1={val.nama_karyawan ?? "-"}
                        title2="Catatan"
                        value2={val.catatan ?? "-"}
                      />
                    </Col>
                  ))}
                </Row>
              : <div className="d-flex justify-content-center">
                  <DataStatus text="Tidak ada catatan" />
                </div>
            }
        </Card.Body>
      </Card>
    )
  }

  // Tampilan saat memuat data
  if (fetchingStatus.loading) {
    return (
      <Modal
      closeButton
      size="lg"
      show={modalConfig.show && modalConfig.type === 'read'}
      title="Detail Program"
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
      <ModalBody>
        <DataStatus loading text="Memuat data . . ." />
      </ModalBody>
    </Modal>
    )
  }

  // Tampilan jika data gagal dimuat
  if (!fetchingStatus.loading && !fetchingStatus.success) {
    return (
      <Modal
      closeButton
      size="lg"
      show={modalConfig.show && modalConfig.type === 'read'}
      title="Detail Program"
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
      <ModalBody>
        <DataStatus text="Data gagal dimuat" />
      </ModalBody>
    </Modal>
    )
  }

  return (
    <Modal
      closeButton
      size="xl"
      show={modalConfig.show && modalConfig.type === 'read'}
      title="Detail Program"
      onHide={() => setModalConfig({
        ...modalConfig,
        show: false
      })}
    >
        <ModalBody>
          <Row>
            <Col md>
              {/* Nama program */}
              <InfoItemVertical 
                label="Nama. Program"
                text={dataProgram.nama_program ?? '-'}
              />
              {/* Tgl. program */}
              <InfoItemVertical 
                label="Tgl. Program"
                text={dataProgram.tgl_program ? DateConvert(new Date(dataProgram.tgl_program)).detail : '-'}
              />
              {/* No. program */}
              <InfoItemVertical 
                label="No. Program"
                text={dataProgram.no_program ?? '-'}
              />
              {/* Unit organisasi */}
              <InfoItemVertical 
                label="Unit Organisasi"
                text={dataProgram.nama_unit_organisasi ?? '-'}
              />
            </Col>
            <Col md>
              {/* Penanggung jawab */}
                <InfoItemVertical 
                label="Nama Penanggung Jawab"
                text={dataProgram.nama_karyawan ?? '-'}
              />
              {/* Periode mulai */}
              <InfoItemVertical 
                label="Periode Mulai"
                text={dataProgram.periode_mulai ? `${DateConvert(new Date(dataProgram.periode_mulai)).detailMonth} ${DateConvert(new Date(dataProgram.periode_mulai)).defaultYear}` : '-'}
              />
              {/* Periode selesai */}
              <InfoItemVertical 
                label="Periode Selesai"
                text={dataProgram.periode_selesai ? `${DateConvert(new Date(dataProgram.periode_selesai)).detailMonth} ${DateConvert(new Date(dataProgram.periode_selesai)).defaultYear}` : '-'}
              />
              {/* Deskripsi */}
              <InfoItemVertical 
                label="Deskripsi"
                text={dataProgram.deskripsi_program ?? '-'}
              />
            </Col>
          </Row>
          <CatatanApproval />
        </ModalBody>
    </Modal>
  )
}

export default DetailModal

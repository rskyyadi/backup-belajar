import {
  useState,
  useEffect
} from 'react'
import { 
  Col,
  ModalBody, ModalFooter, Row 
} from 'react-bootstrap'
import {
  Formik
} from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import { 
  ActionButton, 
  DataStatus, 
  Table, 
  Th,
  Td,
  ThFixed,
  DeleteButton,
  Modal,
  SelectSearch,
  RadioButtonWrapper,
  RadioButton,
  Input,
  PopUpAlert,
  DeleteModal
} from 'components'
import { 
  RupiahConvert 
} from 'utilities'

const getDummyKategori = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_kategori: '1',
          nama_kategori: 'Kategori 01'
        },
        {
          id_kategori: '2',
          nama_kategori: 'Kategori 02'
        },
      ]
    })
  }, 300)
})

const getDummyBUASO = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_buaso: '1',
          nama_buaso: 'Buaso 01'
        },
        {
          id_buaso: '2',
          nama_buaso: 'Buaso 02'
        },
      ]
    })
  }, 300)
})

const getDummyItem = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_item: '1',
          nama_item: 'Item 01',
          id_satuan: '1',
          nama_satuan: 'Satuan 01'
        },
        {
          id_item: '2',
          nama_item: 'Item 02',
          id_satuan: '2',
          nama_satuan: 'Satuan 02'
        },
      ]
    })
  }, 300)
})

const getDummySatuan = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_satuan: '1',
          nama_satuan: 'Satuan 01'
        },
        {
          id_satuan: '2',
          nama_satuan: 'Satuan 02'
        },
      ]
    })
  }, 300)
})

const getDummyPengadaan = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_pengadaan: '1',
          nama_pengadaan: 'Pengadaan 01'
        },
        {
          id_pengadaan: '2',
          nama_pengadaan: 'Pengadaan 02'
        },
      ]
    })
  }, 300)
})

const getDummyAnggaran = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      data: [
        {
          id_anggaran: '1',
          nama_anggaran: 'Anggaran 01',
          pos: 'D'
        },
        {
          id_anggaran: '2',
          nama_anggaran: 'Anggaran 02',
          pos: 'K'
        },
      ]
    })
  }, 300)
})


const TableSection = ({dataTable, setDataTable}) => {
  const [deleteStatus, setDeleteStatus] = useState({
    id: '',
    loading: false
  })
  const [modalConfig, setModalConfig] = useState({
    show: false,
    type: 'tambah'
  })
  const [alertConfig, setAlertConfig] = useState({
    show: false,
    type: '',
    title: '',
    text: '',
    hide: () => setAlertConfig({...alertConfig, show: false})
  })

  // Delete data
  const deleteDataHandler = () => {
    setDeleteStatus({
      ...deleteStatus,
      loading: true
    })

    const newData = dataTable.filter((val, index) => index !== deleteStatus.id)

    setTimeout(() => {
      setDataTable(newData)
      setAlertConfig({
        ...alertConfig,
        show: true,
        type: 'success',
        title: 'Hapus Berhasil!',
        text: "Data sumber daya berhasil dihapus!",
      })
      setDeleteStatus({
        loading: false,
        id: ''
      })
      setModalConfig({
        show: false,
        type: ''
      })
    }, 300)
  }

  // Mendapatkan sub total
  const getSubTotal = (qty, harga) => {
    const getQty = qty ? parseFloat(qty) : 0
    const getHarga = harga ? parseFloat(harga) : 0

    return getQty * getHarga
  }

  const ModalSumberDaya = () => {
    const [dataKategori, setDataKategori] = useState([])
    const [dataBUASO, setDataBUASO] = useState([])
    const [dataItem, setDataItem] = useState([])
    const [dataSatuan, setDataSatuan] = useState([])
    const [dataPengadaan, setDataPengadaan] = useState([])
    const [dataAnggaran, setDataAnggaran] = useState([])
    const [modalFetchingStatus, setModalFetchingStatus] = useState({
      loading: false,
      success: true
    })

    // Mapping data
    const mappingDataKategori = data => data.map(val => {
      return {
        value: val.id_kategori_sumber_daya ?? null,
        label: val.nama_kategori_sumber_daya ?? '-',
      }
    })
    const mappingDataBUASO = data => data.map(val => {
      return {
        value: val.id_buaso ?? null,
        label: val.nama_buaso ?? '-',
      }
    })
    const mappingDataItem = data => data.map(val => {
      return {
        value: val.id_item ?? null,
        label: val.nama_item ?? '-',
        id_satuan: val.id_satuan ?? null,
        nama_satuan: val.nama_satuan ?? '-'
      }
    })
    const mappingDataSatuan = data => data.map(val => {
      return {
        value: val.id_satuan ?? null,
        label: val.nama_satuan ?? '-',
      }
    })
    const mappingDataPengadaan = data => data.map(val => {
      return {
        value: val.kode_pengadaan ?? null,
        label: val.nama_pengadaan ?? '-',
      }
    })
    const mappingDataAnggaran = data => data.map(val => {
      return {
        value: val.id_coa ?? null,
        label: val.nama_akun ?? '-',
        pos: val.normal_pos ?? '-'
      }
    })

    // Kebutuhan Formik
    const modalFormInitialValues = {
      is_terdaftar: true,
      id_kategori: '',
      nama_kategori: '',
      id_buaso: '',
      nama_buaso: '',
      id_item: '',
      nama_item: '',
      id_satuan: '',
      nama_satuan: '',
      id_pengadaan: '',
      nama_pengadaan: '',
      id_anggaran: '',
      pos_anggaran: '',
      qty_item: 0,
      harga: 0,
    }
    const modalFormValidationSchema = Yup.object().shape({
      id_kategori: Yup.string().required('Pilih kategori sumber daya'),
      id_satuan: Yup.string().required('Pilih satuan sumber daya'),
      id_pengadaan: Yup.string().required('Pilih sumber pengadaan'),
      id_anggaran: Yup.string().required('Pilih tipe anggaran'),
      nama_item: Yup.string().required(),
      qty_item: Yup.number()
        .required('Masukan qty')
        .positive('Qty harus lebih besar daripada 0')
        .typeError('Qty harus berupa angka')
    })
    const modalFormSubmitHandler = values => {
      setTimeout(() => {
        setDataTable([
          ...dataTable,
          values
        ])

        setModalConfig({show: false})
        setAlertConfig({
          ...alertConfig,
          show: true,
          type: 'success',
          title: 'Tambah Berhasil!',
          text: "Data sumber daya berhasil ditambah!",
        })
      }, 200)
    }

    const getInitialDataModal = () => {
      setModalFetchingStatus({
        loading: true,
        success: false
      })

      Axios.all([
        getDummyKategori(),
        getDummyBUASO(),
        getDummyItem(),
        getDummySatuan(),
        getDummyPengadaan(),
        getDummyAnggaran()
      ])
      .then(Axios.spread((kategori, buaso, item, satuan, pengadaan, anggaran) => {
        const rawKategori = kategori.data
        const rawBUASO = buaso.data
        const rawItem = item.data
        const rawSatuan = satuan.data
        const rawPengadaan = pengadaan.data
        const rawAnggaran = anggaran.data
        const mapKategori = mappingDataKategori(rawKategori ?? [])
        const mapBUASO = mappingDataBUASO(rawBUASO ?? [])
        const mapItem = mappingDataItem(rawItem ?? [])
        const mapSatuan = mappingDataSatuan(rawSatuan ?? [])
        const mapPengadaan = mappingDataPengadaan(rawPengadaan ?? [])
        const mapAnggaran = mappingDataAnggaran(rawAnggaran ?? [])

        setDataKategori(mapKategori)
        setDataBUASO(mapBUASO)
        setDataItem(mapItem)
        setDataSatuan(mapSatuan)
        setDataPengadaan(mapPengadaan)
        setDataAnggaran(mapAnggaran)
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

    const SDATerdaftarSection = ({formik}) => {
      const {values, errors, touched, setValues} = formik

      return (
        <div>
          <SelectSearch 
            label="BUASO"
            placeholder="Pilih BUASO"
            defaultValue={dataBUASO.find(val => val.value === values.id_buaso) ?? ''}
            option={dataBUASO}
            onChange={val => {
              setValues({
                ...values,
                id_buaso: val.value,
                nama_buaso: val.label
              })
            }}
            error={Boolean(!values.id_buaso && touched.id_buaso) && true}
            errorText={Boolean(!values.id_buaso && touched.id_buaso) && 'Pilih BUASO'}
          />
          {console.log(errors)}
          <SelectSearch 
            label="Item Sumber Daya"
            placeholder={values.id_buaso ? "Pilih item sumber daya" : 'Pilih BUASO untuk menentukan item sumber daya'}
            defaultValue={dataItem.find(val => val.value === values.id_item) ?? ''}
            option={dataItem}
            onChange={val => {
              setValues({
                ...values,
                id_item: val.value,
                nama_item: val.label,
                nama_satuan: val.nama_satuan,
                id_satuan: val.id_satuan
              })
            }}
            error={Boolean(errors.nama_item && touched.nama_item)}
            errorText={Boolean(errors.nama_item && touched.nama_item) && 'Pilih item sumber daya'}
            isDisabled={Boolean(!values.id_buaso)}
          />
          <Input 
            readOnly
            label="Satuan Sumber Daya"
            placeholder="Pilih item sumber daya untuk menentukan satuan"
            value={values.nama_satuan}
          />
        </div>
      )
    }

    const SDATidakTerdaftarSection = ({formik}) => {
      const {values, errors, touched, setValues, handleChange} = formik

      return (
        <div>
          <Input 
            label="Item Sumber Daya"
            placeholder="Masukan nama item sumber daya"
            name="nama_item"
            value={values.nama_item}
            onChange={handleChange}
            error={Boolean(errors.nama_item && touched.nama_item)}
            errorText={Boolean(errors.nama_item && touched.nama_item) && 'Masukan nama item sumber daya'}
            required
          />
          <SelectSearch 
            label="Satuan Sumber Daya"
            placeholder="Pilih satuan sumber daya"
            defaultValue={dataSatuan.find(val => val.value === values.id_satuan) ?? ''}
            option={dataSatuan}
            onChange={val => {
              setValues({
                ...values,
                id_satuan: val.value,
                nama_satuan: val.label
              })
            }}
            error={Boolean(errors.id_satuan && touched.id_satuan)}
            errorText={Boolean(errors.id_satuan && touched.id_satuan) && errors.id_satuan}
          />
        </div>
      )
    }

    // Tampilan modal saat loading atau data gagal dimuat
    if (modalFetchingStatus.loading || !modalFetchingStatus.success) {
      return (
        <Modal
          closeButton
          show={modalConfig.show && modalConfig.type === 'create'}
          title="Tambah Item Sumber Daya"
          onHide={() => setModalConfig({
            ...modalConfig,
            show: false
          })}
        >
          <ModalBody className="pb-5">
            {modalFetchingStatus.loading
              ? <DataStatus loading text="Memuat data . . ." />
              : <DataStatus text="Data gagal dimuat" />
            }
          </ModalBody>
        </Modal>
      )
    }


    return (
      <Modal
        closeButton
        show={modalConfig.show && modalConfig.type === 'create'}
        title="Tambah Item Sumber Daya"
        onHide={() => setModalConfig({
          ...modalConfig,
          show: false
        })}
      >
        <Formik
          initialValues={modalFormInitialValues}
          validationSchema={modalFormValidationSchema}
          onSubmit={modalFormSubmitHandler}
        >
          {(formik) => {
            const {values, errors, touched, isSubmitting, setFieldValue, setValues, handleChange, handleSubmit} = formik

            return (
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  {/* Kategori Sumber Daya */}
                  <SelectSearch 
                    label="Kategori Sumber Daya"
                    placeholder="Pilih kategori sumber daya"
                    defaultValue={dataKategori.find(val => val.value === values.id_kategori) ?? ''}
                    option={dataKategori}
                    onChange={val => {
                      setValues({
                        ...values,
                        id_kategori: val.value,
                        nama_kategori: val.label
                      })
                    }}
                    error={Boolean(errors.id_kategori && touched.id_kategori)}
                    errorText={Boolean(errors.id_kategori && touched.id_kategori) && errors.id_kategori}
                  />

                  {/* Tipe Sumber Daya */}
                  <RadioButtonWrapper
                    label="Tipe Sumber Daya"
                    className="mt-3"
                  >
                    <div style={{marginTop: -7}}>
                      <RadioButton 
                        id="terdaftar"
                        label="Telah Terdaftar"
                        name="is_terdaftar"
                        value={true}
                        checked={values.is_terdaftar}
                        onChange={() => setValues({
                          ...values,
                          is_terdaftar: true,
                          id_buaso: '',
                          id_item: '',
                          id_satuan: '',
                          nama_buaso: '',
                          nama_item: '',
                          nama_satuan: ''
                        })}
                      />
                      <RadioButton 
                        id="tidak-terdaftar"
                        label="Belum Terdaftar"
                        name="is_terdaftar"
                        value={false}
                        checked={!values.is_terdaftar}
                        onChange={() => setValues({
                          ...values,
                          is_terdaftar: false,
                          id_buaso: '',
                          id_item: '',
                          id_satuan: '',
                          nama_buaso: '',
                          nama_item: '',
                          nama_satuan: ''
                        })}
                      />
                    </div>
                  </RadioButtonWrapper>
                  <div className="bg-light mb-3 p-2 border rounded">
                    {values.is_terdaftar
                      ? <SDATerdaftarSection formik={formik} />
                      : <SDATidakTerdaftarSection formik={formik} />
                    }
                  </div>

                  {/* Sumber Pengadaan */}
                  <SelectSearch 
                    label="Sumber Pengadaan"
                    placeholder="Pilih sumber pengadaan"
                    defaultValue={dataPengadaan.find(val => val.value === values.id_pengadaan) ?? ''}
                    option={dataPengadaan}
                    onChange={val => {
                      setValues({
                        ...values,
                        id_pengadaan: val.value,
                        nama_pengadaan: val.label
                      })
                    }}
                    error={Boolean(errors.id_pengadaan && touched.id_pengadaan)}
                    errorText={Boolean(errors.id_pengadaan && touched.id_pengadaan) && errors.id_pengadaan}
                  />

                  {/* Tipe Anggaran */}
                  <Row noGutters>
                    <Col xs={10}>
                      <SelectSearch 
                        label="Tipe Anggaran"
                        placeholder="Pilih tipe anggaran"
                        defaultValue={dataAnggaran.find(val => val.value === values.id_anggaran) ?? ''}
                        option={dataAnggaran}
                        onChange={val => {
                          setValues({
                            ...values,
                            id_anggaran: val.value,
                            pos_anggaran: val.pos
                          })
                          setFieldValue('id_anggaran', val.value)
                        }}
                        error={Boolean(errors.id_anggaran && touched.id_anggaran)}
                        errorText={Boolean(errors.id_anggaran && touched.id_anggaran) && errors.id_anggaran}
                      />
                    </Col>
                    <Col xs={2} className="pl-3">
                      <Input 
                        readOnly
                        label="POS"
                        value={values.pos_anggaran}
                      />
                    </Col>
                  </Row>
                  <Row>
                    {/* Qty Sumber Daya */}
                    <Col md>
                      <Input 
                        type="number"
                        label="Qty. Sumber Daya"
                        placeholder="Masukan qty. sumber daya"
                        name="qty_item"
                        value={values.qty_item}
                        onChange={handleChange}
                        error={Boolean(errors.qty_item && touched.qty_item)}
                        errorText={Boolean(errors.qty_item && touched.qty_item) && errors.qty_item}
                      />
                    </Col>

                    {/* Harga Satuan */}
                    <Col md>
                      <Input 
                        label="Harga Satuan"
                        placeholder="Masukan harga satuan"
                        name="harga"
                        value={values.harga ? RupiahConvert(String(values.harga)).detail : RupiahConvert(String(0)).detail}
                        onChange={e => {
                          const rupiah = RupiahConvert(String(e.target.value)).default
                          return rupiah ? setFieldValue('harga', rupiah) : setFieldValue('harga', 0)
                        }}
                        error={Boolean(errors.harga && touched.harga)}
                        errorText={Boolean(errors.harga && touched.harga) && errors.harga}
                      />
                    </Col>
                  </Row>
                  {/* Sub Total */}
                  <Input 
                    readOnly
                    label="Sub Total"
                    value={RupiahConvert(getSubTotal(values.qty_item, values.harga).toString()).detail}
                  />
                </ModalBody>
                <ModalFooter>
                  <ActionButton 
                    type="submit"
                    text="Tambah Sumber Daya"
                    loading={isSubmitting}
                  />
                </ModalFooter>
              </form>
            )
          }}
        </Formik>
      </Modal>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-end mt-4" style={{marginBottom: 10}}>
        <b>List Sumber Daya</b>
        <ActionButton 
          size="sm"
          text="Tambah Sumber Daya"
          onClick={() => setModalConfig({show: true, type: 'create'})}
        />
      </div>
      <Table responsive>
        <thead className="bg-light">
          <tr>
            <ThFixed>No</ThFixed>
            <Th textRight width={140}>Kategori Anggaran</Th>
            <Th style={{minWidth: 200}}>Item Sumber Daya</Th>
            <Th textRight width={150}>Sumber Pengadaan</Th>
            <Th textRight width={130}>Qty. Sumber Daya</Th>
            <Th textRight width={130}>Harga Satuan</Th>
            <Th textRight width={130}>Sub Total</Th>
            <ThFixed>Aksi</ThFixed>
          </tr>
        </thead>
        <tbody>
          {dataTable && dataTable.length > 0
            ? dataTable.map((val, index) => (
              <tr key={index}>
                <Td textCenter>{index + 1}</Td>
                <Td>{val.nama_kategori}</Td>
                <Td>{val.nama_item}</Td>
                <Td>{val.nama_pengadaan}</Td>
                <Td>{val.qty_item} {val.nama_satuan}</Td>
                <Td textRight>{RupiahConvert(String(val.harga)).detail}</Td>
                <Td textRight>{RupiahConvert(getSubTotal(val.qty_item, val.harga).toString()).detail}</Td>
                <Td>
                  <DeleteButton onClick={() => {
                    setDeleteStatus({
                      ...deleteStatus,
                      id: index
                    })
                    setModalConfig({
                      show: true,
                      type: 'delete'
                    })
                  }} />
                </Td>
              </tr>
            ))
            : <tr>
                <td colSpan={8}>
                  <DataStatus text="Tidak ada data" />
                </td>
              </tr>
          }
        </tbody>
      </Table>

      {/* Modal */}
      {modalConfig.show && modalConfig.type === 'create' && <ModalSumberDaya />}
      {modalConfig.show && modalConfig.type === 'delete' && <DeleteModal 
        show={modalConfig.show && modalConfig.type === 'delete'}
        title="Sumber Daya"
        onConfirm={deleteDataHandler}
        onHide={() => {
          setModalConfig({show: false, type: ''})
          setDeleteStatus({
            loading: false,
            id: ''
          })
        }}
        loading={deleteStatus.loading}
      />}

      {/* Alert */}
      <PopUpAlert 
        show={alertConfig.show}
        onConfirm={alertConfig.hide}
        onHide={alertConfig.hide}
        title={alertConfig.title}
        text={alertConfig.text}
        type={alertConfig.type}
      />
    </>
  )
}

export default TableSection

import React, { useState, useEffect } from "react";
import { Card, Container, Col, Row, Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import {
  Alert,
  BackButton,
  CreateButton,
  CRUDLayout,
  Input,
  CreateModal,
  DeleteModal,
  ActionButton,
  DeleteButton,
  DataStatus,
  SelectSearch,
  TextArea,
  DatePicker,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
  InfoItemHorizontal
} from "components";
// import { IoSaveOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { KategoriAnggaranApi, KegiatanAnggaranApi, COAApi, ProgramAnggaranApi } from "api";
import { RupiahConvert, DateConvert } from "utilities";
import { IoSaveOutline } from "react-icons/io5";
// import { ReadModal } from "../../fe_itdc_hrda/src/components";

const AddKegiatan = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);
  // menangani modal form tambah
  const [isCreateForm, setIsCreateForm] = useState(false);
  // menangani modal hapus data
  const [isDeleteData, setIsDeleteData] = useState(false);

  //state data
  const [data, setData] = useState([]);
  const [kode, setKode] = useState("");
  const [dataKategoriSumberDaya, setDataKategoriSumberDaya] = useState([]);
  const [dataSumberDaya, setDataSumberDaya] = useState([]);
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const [dataForm, setDataForm] = useState([]);
  const [dataCOA, setDataCOA] = useState([]);
  const [dataJenisAnggaran, setDataJenisAnggaran] = useState([])
  const [dataKelompokAnggaran, setDataKelompokAnggaran] = useState([])
  const [dataSubKelompokAnggaran, setDataSubKelompokAnggaran] = useState([])

  // menampung data yang akan dihapus
  const [deleteData, setDeleteData] = useState([]);
  // configurasi alert
  const [alertConfig, setAlertConfig] = useState({
    variant: "primary",
    text: "",
  });
  const [createSumberDayaAlertConfig, setCreateSumberDayaAlertConfig] = useState({
    show: false,
    variant: 'primary',
    text: 'tes'
  })
  const [showAlert, setShowAlert] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");

  const { id } = useParams();
  const history = useHistory();

  const mappingDataJenisAnggaran = data => data.map(val => {
    return {
      label: val.nama_jenis_anggaran,
      value: val.id_jenis_anggaran
    }
  })

  const mappingDataKelompokAnggaran = data => data.map(val => {
    return {
      label: val.nama_kelompok_anggaran,
      value: val.id_kelompok_anggaran,
      jenis: val.id_jenis_anggaran
    }
  })
  
  const mappingDataSubKelompokAnggaran = data => data.map(val => {
    return {
      label: val.nama_sub_kelompok_anggaran,
      value: val.id_sub_kelompok_anggaran,
      kelompok: val.id_kelompok_anggaran
    }
  })

  // request data dari server
  const getData = () => {
    setIsLoading(true);

    // request data ke server
    Axios.all([
      ProgramAnggaranApi.getSingle(id),
      KategoriAnggaranApi.get(),
      KegiatanAnggaranApi.getKaryawan(),
      COAApi.get(),
      KegiatanAnggaranApi.getJenisAnggaran(),
      KegiatanAnggaranApi.getKelompokAnggaran(),
      KegiatanAnggaranApi.getSubKelompokAnggaran()
    ])
      .then(
        Axios.spread((ProgramAnggaran, KatgeoriAnggaran, Karyawan, Coa, jenis, kelompok, subKelompok) => {
          const dataJenisAnggaran = mappingDataJenisAnggaran(jenis.data.data ?? [])
          const dataKelompokAnggaran = mappingDataKelompokAnggaran(kelompok.data.data ?? [])
          const dataSubKelompokAnggaran = mappingDataSubKelompokAnggaran(subKelompok.data.data ?? [])
          
          setData(ProgramAnggaran.data.data);
          setDataKategoriSumberDaya(KatgeoriAnggaran.data.data);
          setDataKaryawan(Karyawan.data.data);
          setDataCOA(Coa.data.data);
          setDataJenisAnggaran(dataJenisAnggaran)
          setDataKelompokAnggaran(dataKelompokAnggaran)
          setDataSubKelompokAnggaran(dataSubKelompokAnggaran)
        })
      )
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Tambah Kegiatan");

    // jalankan function request data ke server
    getData();
  }, [setNavbarTitle]);

  // Modal Hapus
  const HapusModal = () => {
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
      return () => {
        setBtnLoading(false);
      };
    }, []);

    const deleteDataHandler = () => {
      setBtnLoading(true);
      dataSumberDaya.splice(deleteData._rowindex, 1);

      setIsDeleteData(false);
      setShowAlert(true);
      setAlertConfig({
        variant: "primary",
        text: "Hapus data berhasil!",
      });
    };

    return (
      <DeleteModal
        show={isDeleteData}
        onHide={() => setIsDeleteData(false)}
        loading={btnLoading}
        onConfirm={deleteDataHandler}
      >
        Nama sumber daya: {deleteData.item_sumber_daya}
      </DeleteModal>
    );
  };

  // Modal Tambah
  const TambahModal = () => {
    // nilai awal form
    const formInitialValues = {
      id_kategori_sumber_daya: "",
      id_coa: "",
      nama_akun: "",
      nomor_akun: "",
      nama_kategori_sumber_daya: "",
      item_sumber_daya: "",
      qty: "",
      satuan: "",
      harga_satuan: "",
    };
    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      id_kategori_sumber_daya: Yup.string().required("Masukan kategori sumber daya"),
      id_coa: Yup.string().required("Pilih tipe anggaran"),
      item_sumber_daya: Yup.string().required("Masukan item sumber daya"),
      qty: Yup.string().required("Masukan qty"),
      satuan: Yup.string().required("Masukan satuan"),
      harga_satuan: Yup.string().required("Masukan harga satuan"),
    });

    const formSubmitHandler = (event) => {
      dataSumberDaya.push(event);
      setDataSumberDaya(dataSumberDaya);
      setIsCreateForm(false);
      setCreateSumberDayaAlertConfig({
        show: true,
        variant: 'primary',
        text: 'Sumber daya berhasil ditambah!'
      })
    };

    return (
      <CreateModal show={isCreateForm} onHide={() => setIsCreateForm(false)} title="Sumber Daya">
        <Formik
          initialValues={formInitialValues}
          validationSchema={formValidationSchema}
          onSubmit={formSubmitHandler}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <SelectSearch
                  label="Kategori Sumber Daya"
                  type="text"
                  name="id_kategori_sumber_daya"
                  placeholder="Pilih kategori sumber daya"
                  option={dataKategoriSumberDaya.map(val => {
                    return {
                      label: val.nama_kategori_sumber_daya,
                      value: val.id_kategori_sumber_daya
                    }
                  })}
                  onChange={(e) => {
                    let label = e.label;
                    let value = e.value;
                    setFieldValue("id_kategori_sumber_daya", value);
                    setFieldValue("nama_kategori_sumber_daya", label);
                  }}
                  error={errors.id_kategori_sumber_daya && touched.id_kategori_sumber_daya && true}
                  errorText={errors.id_kategori_sumber_daya && touched.id_kategori_sumber_daya && errors.id_kategori_sumber_daya}
                />
                <Input
                  label="Item Sumber Daya"
                  type="text"
                  name="item_sumber_daya"
                  placeholder="Masukan item sumber daya"
                  value={values.item_sumber_daya}
                  onChange={handleChange}
                  error={errors.item_sumber_daya && touched.item_sumber_daya && true}
                  errorText={errors.item_sumber_daya}
                />
                <Input
                  label="Satuan"
                  type="text"
                  name="satuan"
                  placeholder="Masukan satuan"
                  value={values.satuan}
                  onChange={handleChange}
                  error={errors.satuan && touched.satuan && true}
                  errorText={errors.satuan}
                />
                <Row>
                  <div className="col-10">
                    <SelectSearch
                      label="Tipe Anggaran"
                      name="id_coa"
                      placeholder="Pilih tipe anggaran"
                      option={
                        dataCOA
                          ? dataCOA
                              .filter((val) => val.normal_pos === "D")
                              .map((val) => {
                                return {
                                  label: `${val.nomor_akun} - ${val.nama_akun}`,
                                  value: val.id_coa,
                                  normal_pos: val.normal_pos,
                                  nomor_akun: val.nomor_akun,
                                };
                              })
                          : {
                              value: "",
                              label: "Pilih tipe anggaran",
                            }
                      }
                      onChange={(val) => {
                        setFieldValue("id_coa", val.value);
                        setFieldValue("nama_akun", val.label);
                        setFieldValue("normal_pos", val.normal_pos);
                        setFieldValue("nomor_akun", val.nomor_akun);
                      }}
                      error={errors.id_coa && touched.id_coa && true}
                      errorText={errors.id_coa && touched.id_coa && errors.id_coa}
                    />
                  </div>
                  <Col>
                    <Input
                      label="Pos"
                      readOnly={true}
                      value={values.normal_pos ? values.normal_pos : "-"}
                    />
                  </Col>
                </Row>
                <Input
                  label="Qty"
                  type="text"
                  name="qty"
                  placeholder="Masukan Qty"
                  value={values.qty}
                  onChange={handleChange}
                  error={errors.qty && touched.qty && true}
                  errorText={errors.qty}
                />
                <Input
                  label="Harga Satuan"
                  type="text"
                  name="harga_satuan"
                  placeholder="Masukan harga satuan"
                  value={RupiahConvert(values.harga_satuan.toString()).detail}
                  onChange={e => {
                    const val =  e.target.value
                    const convert = RupiahConvert(val.toString()).default
                    setFieldValue('harga_satuan', Number.isInteger(convert) ? convert : "")
                  }}
                  error={errors.harga_satuan && touched.harga_satuan && true}
                  errorText={errors.harga_satuan}
                />
              </Modal.Body>
              <Modal.Footer>
                <ActionButton
                  type="submit"
                  variant="primary"
                  text="Tambah"
                  className="mt-2 px-4"
                  loading={isSubmitting}
                />
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </CreateModal>
    );
  };
  // nilai awal form
  const formInitialValues = {
    id_program: data?.id_program,
    id_jabatan: "",
    id_karyawan: "",
    id_sub_kelompok_anggaran: '',
    tgl_kegiatan: "",
    no_kegiatan: "",
    nama_kegiatan: "",
    deskripsi_kegiatan: "",
    periode_mulai: "",
    periode_selesai: "",
  };

  // skema validasi form
  const formValidationSchema = Yup.object().shape({
    tgl_kegiatan: Yup.string().required("Masukan tanggal"),
    no_kegiatan: Yup.string().required("Masukan no kegiatan"),
    nama_kegiatan: Yup.string().required("Masukan nama kegiatan"),
    id_karyawan: Yup.string().required("Masukan nama karyawan"),
    periode_mulai: Yup.string().required("Masukan tanggal mulai"),
    periode_selesai: Yup.string().required("Masukan tanggal selesai"),
    id_sub_kelompok_anggaran: Yup.string().required("Pilih sub kelompok anggaran")
  });

  const formSubmitedHandler = (values, {setSubmitting}) => {
    KegiatanAnggaranApi.create(values)
      .then(() => {
        history.push('/anggaran/transaksi/kegiatan', {
          showAlert: true,
          alertText: 'Data berhasil ditambah!',
          alertVariant: 'primary'
        })
      })
      .catch((err) => {
        setAlertConfig({
          variant: "danger",
          text: `Tambah data gagal!`,
        });
      })
      .finally(() => {
        setShowAlert(true)
        setSubmitting(false)
      });
  };

  const FormKegiatanSection = ({formik}) => {
    const today = DateConvert(new Date()).default
    const [isNomorLoading, setIsNomorLoading] = useState(false)
    const {values, errors, touched, setValues, setFieldValue} = formik

    const getNoKegiatan = (value) => {
      setIsNomorLoading(true);
  
      KegiatanAnggaranApi.getKode(value)
        .then(({ data }) => {
          setValues({
            ...values,
            no_kegiatan: data.data,
            tgl_kegiatan: value
          })
        })
        .catch((err) => {
          alert("Gagal mengambil nomor realisasi")
          setValues({
            ...value,
            tgl_kegiatan: value,
            no_kegiatan: ''
          })
        })
        .finally(() => setIsNomorLoading(false));
    }

    useEffect(() => {
      getNoKegiatan(today)
    }, [])

    return (
      <>
        <Row>
          <Col lg="6">
            <DatePicker
              label="Tanggal Kegiatan"
              type="date"
              name="tgl_kegiatan"
              placeholderText="Pilih tanggal"
              selected={values.tgl_kegiatan ? new Date(values.tgl_kegiatan) : ''}
              onChange={(date) => {
                const value = DateConvert(new Date(date)).default;
                setFieldValue("tgl_kegiatan", value);
              }}
              error={errors.tgl_kegiatan && touched.tgl_kegiatan && true}
              errorText={errors.tgl_kegiatan}
            />
          </Col>
          <Col lg="6">
            <Input
              label="No. Kegiatan"
              type="text"
              value={isNomorLoading ? 'Memuat . . .' : values.no_kegiatan}
              placeholder="Pilih tanggal untuk menentukan nomor"
              name="no_kegiatan"
              error={errors.no_kegiatan && touched.no_kegiatan && true}
              errorText={errors.no_kegiatan}
              readOnly
            />
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Input
              label="Nama Kegiatan"
              type="text"
              placeholder="Masukan nama kegiatan"
              name="nama_kegiatan"
              value={values.nama_kegiatan}
              onChange={(e) => {
                setFieldValue("nama_kegiatan", e.target.value);
              }}
              error={errors.nama_kegiatan && touched.nama_kegiatan && true}
              errorText={errors.nama_kegiatan}
            />
          </Col>
          <Col lg="6">
            <TextArea
              label="Keterangan"
              placeholder="Masukan keterangan"
              name="deskripsi_kegiatan"
              value={values.deskripsi_kegiatan}
              onChange={(e) => {
                setFieldValue("deskripsi_kegiatan", e.target.value);
              }}
              error={
                errors.deskripsi_kegiatan && touched.deskripsi_kegiatan && true
              }
              errorText={errors.deskripsi_kegiatan}
              rows={2}
            />
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <SelectSearch
              label="Penanggung Jawab"
              name="id_karyawan"
              placeholder="Pilih penanggung jawab"
              onChange={(val) => {
                setValues({
                  ...values,
                  id_karyawan: val.value,
                  nama_karyawan: val.label,
                  id_jabatan: val.jabatan
                })
              }}
              defaultValue={values.id_karyawan 
                ? dataKaryawan.find(val => values.id_karyawan === val.value)
                : ''
              }
              option={dataKaryawan.map((val) => {
                return {
                  value: val.id_karyawan,
                  label: val.nama_karyawan,
                  jabatan: val.id_jabatan,
                };
              })} //option harus berupa value dan label
              error={errors.id_karyawan && touched.id_karyawan && true}
              errorText={errors.id_karyawan && touched.id_karyawan && true}
            />
          </Col>
          <Col lg="3">
            <DatePicker
              showMonthYearPicker
              showTwoColumnMonthYearPicker
              dateFormat="MM/yyyy"
              label="Periode Mulai"
              selected={values.periode_mulai ? new Date(values.periode_mulai) : ''}
              onChange={(date) => {
                const newDate = DateConvert(new Date(date)).default;
                setFieldValue("periode_mulai", newDate);
              }}
              placeholderText="Pilih periode mulai"
              error={errors.periode_mulai && touched.periode_mulai && true}
              errorText={errors.periode_mulai}
            />
          </Col>
          <Col lg="3">
            <DatePicker
              showMonthYearPicker
              showTwoColumnMonthYearPicker
              dateFormat="MM/yyyy"
              label="Periode Selesai"
              selected={values.periode_selesai ? new Date(values.periode_selesai) : ''}
              onChange={(date) => {
                const newDate = DateConvert(new Date(date)).default;
                setFieldValue("periode_selesai", newDate);
              }}
              placeholderText="Pilih periode selesai"
              error={errors.periode_selesai && touched.periode_selesai && true}
              errorText={errors.periode_selesai}
            />
          </Col>
        </Row>
      </>
    )
  }

  const FormTipeAnggaranSection = ({formik}) => {
    const {values, errors, touched, setFieldValue} = formik
    const [dataFilterKelompokAnggaran, setDataFilterKelompokAnggaran] = useState([])
    const [dataFilterSubKelompokAnggaran, setDataFilterSubKelompokAnggaran] = useState([])
    const [disable, setDisable] = useState({
      jenis: false,
      kelompok: true,
      subKelompok: true
    })
    const [loading, setLoading] = useState({
      jenis: false,
      kelompok: false,
      subKelompok: false
    })

    const onJenisChange = val => {
      setDataFilterSubKelompokAnggaran([])
      setLoading({
        ...loading,
        kelompok: true
      })
      setDisable({
        ...disable,
        kelompok: false,
        subKelompok: true
      })
      setFieldValue('id_sub_kelompok_anggaran', '')

      setTimeout(() => {
        const newDataKelompok = dataKelompokAnggaran.filter(fil => fil.jenis === val)
        setDataFilterKelompokAnggaran(newDataKelompok)
        setLoading({
          ...loading,
          kelompok: false
        })
      }, 300)
    }

    const onKelompokChange = val => {
      setLoading({
        ...loading,
        subKelompok: true
      })
      setDisable({
        ...disable,
        subKelompok: false
      })
      setFieldValue('id_sub_kelompok_anggaran', '')

      setTimeout(() => {
        const newDataSubKelompok = dataSubKelompokAnggaran.filter(fil => fil.kelompok === val)
        setDataFilterSubKelompokAnggaran(newDataSubKelompok)
        setLoading({
          ...loading,
          subKelompok: false
        })
      }, 300)
    }

    return (
      <Row>
        <Col md>
          <SelectSearch 
            label="Jenis Anggaran"
            placeholder="Pilih jenis anggaran"
            option={dataJenisAnggaran}
            onChange={val => onJenisChange(val.value)}
          />
        </Col>
        <Col md>
          <SelectSearch 
            label="Kelompok Anggaran"
            placeholder="Pilih kelompok anggaran"
            option={dataFilterKelompokAnggaran}
            isDisabled={disable.kelompok}
            loading={loading.kelompok}
            onChange={val => onKelompokChange(val.value)}
          />
        </Col>
        <Col md>
          <SelectSearch 
            label="Sub Kelompok Anggaran"
            placeholder="Pilih sub kelompok anggaran"
            defaultValue={disable ? '' : {}}
            option={dataFilterSubKelompokAnggaran}
            isDisabled={disable.subKelompok}
            loading={loading.subKelompok}
            onChange={val => setFieldValue('id_sub_kelompok_anggaran', val.value)}
            error={errors.id_sub_kelompok_anggaran && touched.id_sub_kelompok_anggaran && true}
            errorText={errors.id_sub_kelompok_anggaran && touched.id_sub_kelompok_anggaran && errors.id_sub_kelompok_anggaran}
          />
        </Col>
      </Row>
    )
  }

  return (
    <CRUDLayout>
      {/* Head */}
      <CRUDLayout.Head>{/* Button Section */}</CRUDLayout.Head>

      {/* ALert */}
      <Alert
        show={showAlert}
        showCloseButton={true}
        variant={alertConfig.variant}
        text={alertConfig.text}
      />

      {/* Table Section */}
      {
        // cek apakah data sedang dimuat (loading)
        isLoading === true ? (
          // loading
          <DataStatus loading={true} text="Memuat data..." />
        ) : // Cek apakah ada data
        data !== null ? (
          // Ada data
          <Card className="pb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <b>Tambah Data</b>
              <Link to="/anggaran/transaksi/kegiatan">
                <BackButton size="sm" />
              </Link>
            </Card.Header>
            <Card.Body>
              <Container>
                {/* FormInput */}
                <>
                  <Row>
                    <Col md>
                      {/* Nama program */}
                      <InfoItemHorizontal 
                        label="Nama. Program"
                        text={data.nama_program ?? '-'}
                      />
                      {/* Tgl. program */}
                      <InfoItemHorizontal 
                        label="Tgl. Program"
                        text={data.tgl_program ? DateConvert(new Date(data.tgl_program)).detail : '-'}
                      />
                      {/* No. program */}
                      <InfoItemHorizontal 
                        label="No. Program"
                        text={data.no_program ?? '-'}
                      />
                      {/* Unit organisasi */}
                      <InfoItemHorizontal 
                        label="Unit Organisasi"
                        text={data.nama_unit_organisasi ?? '-'}
                      />
                    </Col>
                    <Col md>
                      {/* Penanggung jawab */}
                        <InfoItemHorizontal 
                        label="Nama Penanggung Jawab"
                        text={data.nama_karyawan ?? '-'}
                      />
                      {/* Periode mulai */}
                      <InfoItemHorizontal 
                        label="Periode Mulai"
                        text={data.periode_mulai ? `${DateConvert(new Date(data.periode_mulai)).detailMonth} ${DateConvert(new Date(data.periode_mulai)).defaultYear}` : '-'}
                      />
                      {/* Periode selesai */}
                      <InfoItemHorizontal 
                        label="Periode Selesai"
                        text={data.periode_selesai ? `${DateConvert(new Date(data.periode_selesai)).detailMonth} ${DateConvert(new Date(data.periode_selesai)).defaultYear}` : '-'}
                      />
                      {/* Deskripsi */}
                      <InfoItemHorizontal 
                        label="Deskripsi"
                        text={data.deskripsi_program ?? '-'}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Formik
                    initialValues={formInitialValues}
                    validationSchema={formValidationSchema}
                    onSubmit={formSubmitedHandler}
                  >
                    {(formik) => (
                      <form onSubmit={formik.handleSubmit}>
                        {/* Form Kegiatan Section */}
                        <FormKegiatanSection formik={formik} />

                        {/* Tipe Anggaran Section */}
                        <FormTipeAnggaranSection formik={formik} />
                        <hr />
                        <div className="d-flex justify-content-end my-4">
                          <ActionButton
                            type="submit"
                            variant="primary"
                            text="Simpan Kegiatan"
                            className="px-3"
                            loading={formik.isSubmitting}
                          />
                        </div>
                      </form>
                    )}
                  </Formik>
                </>
                {/* formInput */}
              </Container>
            </Card.Body>
          </Card>
        ) : (
          // Tidak ada data
          <DataStatus text="Tidak ada data" />
        )
      }

      <TambahModal />
      <HapusModal />
    </CRUDLayout>
  );
};

export default AddKegiatan;

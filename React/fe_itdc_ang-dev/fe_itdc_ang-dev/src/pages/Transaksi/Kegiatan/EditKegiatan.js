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
  Select,
  CreateModal,
  DeleteModal,
  ActionButton,
  DeleteButton,
  DataStatus,
  SelectSearch,
  SelectMonth,
  DatePicker,
  Table,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
  InfoItemHorizontal,
  InfoItemVertical
} from "components";
import { IoSaveOutline } from "react-icons/io5";
import TextArea from "components/TextArea/TextArea";
// import { IoSaveOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { KegiatanAnggaranApi, KategoriAnggaranApi, COAApi } from "api";
import { RupiahConvert, DateConvert } from "utilities";

const EditKegiatan = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);
  // menangani modal form tambah
  const [isCreateForm, setIsCreateForm] = useState(false);
  // menangani modal hapus data
  const [updateData, setUpdateData] = useState([]);
  const [isDeleteData, setIsDeleteData] = useState(false);
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
  // Fetch data
  const [data, setData] = useState([]);
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const [dataKategoriSumberDaya, setDataKategoriSumberDaya] = useState([]);
  const [dataCOA, setDataCOA] = useState([]);
  const { id } = useParams();
  const [dataJenisAnggaran, setDataJenisAnggaran] = useState([])
  const [dataKelompokAnggaran, setDataKelompokAnggaran] = useState([])
  const [dataSubKelompokAnggaran, setDataSubKelompokAnggaran] = useState([])

  const mappingDataKaryawan = data => data.map(val => {
    return {
      label: val.nama_karyawan,
      value: val.id_karyawan,
      jabatan: val.id_jabatan
    }
  })

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
      KegiatanAnggaranApi.getSingle({id_kegiatan: id}),
      KategoriAnggaranApi.get(),
      KegiatanAnggaranApi.getKaryawan(),
      KegiatanAnggaranApi.getJenisAnggaran(),
      KegiatanAnggaranApi.getKelompokAnggaran(),
      KegiatanAnggaranApi.getSubKelompokAnggaran()
    ])
      .then(
        Axios.spread((ProgramAnggaran, KatgeoriAnggaran, Karyawan, jenis, kelompok, subKelompok) => {
          const mapDataKaryawan = mappingDataKaryawan(Karyawan.data.data ?? [])
          const mapDataJenisAnggaran = mappingDataJenisAnggaran(jenis.data.data ?? [])
          const mapDataKelompokAnggaran = mappingDataKelompokAnggaran(kelompok.data.data ?? [])
          const mapDataSubKelompokAnggaran = mappingDataSubKelompokAnggaran(subKelompok.data.data ?? [])
          
          setData(ProgramAnggaran.data.data);
          setDataKategoriSumberDaya(KatgeoriAnggaran.data.data);
          setDataKaryawan(mapDataKaryawan);
          setDataJenisAnggaran(mapDataJenisAnggaran)
          setDataKelompokAnggaran(mapDataKelompokAnggaran)
          setDataSubKelompokAnggaran(mapDataSubKelompokAnggaran)
        })
      )
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Edit Kegiatan");

    // jalankan function request data ke server
    getData();
  }, [setNavbarTitle]);

  // nilai awal form
  const formInitialValues = {
    id_kegiatan: data.id_kegiatan,
    id_program: data.id_program ?? null,
    id_jabatan: data.id_jabatan ?? null,
    id_karyawan: data.id_karyawan ?? null,
    id_jenis_anggaran: data.id_jenis_anggaran ?? null,
    id_kelompok_anggaran: data.id_kelompok_anggaran ?? null,
    id_sub_kelompok_anggaran: data.id_sub_kelompok_anggaran ?? null,
    tgl_kegiatan: data.tgl_kegiatan ?? null,
    no_kegiatan: data.no_kegiatan ?? null,
    nama_kegiatan: data.nama_kegiatan ?? null,
    deskripsi_kegiatan: data.deskripsi_kegiatan ?? null,
    periode_mulai: data.periode_mulai ?? null,
    periode_selesai: data.periode_selesai ?? null,
    id_sub_kelompok_anggaran: data.id_sub_kelompok_anggaran ?? null
  };

  // skema validasi form
  const formValidationSchema = Yup.object().shape({
    tgl_kegiatan: Yup.string().required("Masukan tanggal"),
    no_kegiatan: Yup.string().required("Masukan no kegiatan"),
    nama_kegiatan: Yup.string().required("Masukan nama kegiatan"),
    id_karyawan: Yup.string().required("Masukan nama karyawan"),
    periode_mulai: Yup.string().required("Masukan tanggal mulai"),
    periode_selesai: Yup.string().required("Masukan tanggal selesai"),
    id_sub_kelompok_anggaran: Yup.string().required("Pilih sub kelompok anggaran").nullable()
  });

  const formSubmitedHandler = (values, {setSubmitting}) => {
    KegiatanAnggaranApi.update(values)
      .then(() => {
        // konfigurasi alert
        setAlertConfig({
          variant: "primary",
          text: "Ubah data berhasil!",
        });
      })
      .catch((err) => {
        // konfigurasi alert
        setAlertConfig({
          variant: "danger",
          text: `Ubah data gagal! (${err})`,
        });
      })
      .finally(() => {
        setShowAlert(true)
        setSubmitting(false)
        getData()
      });
  };

  const InfoSection = () => {
    return (
      <Row>
        <Col md>
          {/* Nama program */}
          <InfoItemHorizontal 
            label="Nama. Program"
            text={data.program.nama_program ?? '-'}
          />
          {/* Tgl. program */}
          <InfoItemHorizontal 
            label="Tgl. Program"
            text={data.program.tgl_program ? DateConvert(new Date(data.program.tgl_program)).detail : '-'}
          />
          {/* No. program */}
          <InfoItemHorizontal 
            label="No. Program"
            text={data.program.no_program ?? '-'}
          />
          {/* Unit organisasi */}
          <InfoItemHorizontal 
            label="Unit Organisasi"
            text={data.program.nama_unit_organisasi ?? '-'}
          />
        </Col>
        <Col md>
          {/* Penanggung jawab */}
            <InfoItemHorizontal 
            label="Nama Penanggung Jawab"
            text={data.program.nama_karyawan ?? '-'}
          />
          {/* Periode mulai */}
          <InfoItemHorizontal 
            label="Periode Mulai"
            text={data.program.periode_mulai ? `${DateConvert(new Date(data.program.periode_mulai)).detailMonth} ${DateConvert(new Date(data.program.periode_mulai)).defaultYear}` : '-'}
          />
          {/* Periode selesai */}
          <InfoItemHorizontal 
            label="Periode Selesai"
            text={data.program.periode_selesai ? `${DateConvert(new Date(data.program.periode_selesai)).detailMonth} ${DateConvert(new Date(data.program.periode_selesai)).defaultYear}` : '-'}
          />
          {/* Deskripsi */}
          <InfoItemHorizontal 
            label="Deskripsi"
            text={data.program.deskripsi_program ?? '-'}
          />
        </Col>
      </Row>
    )
  }

  const FormKegiatanSection = ({formik}) => {
    const {values, errors, touched, setValues, setFieldValue} = formik

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
              value={values.no_kegiatan}
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
              option={dataKaryawan}
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

    const getInitialDropdownAnggaran = () => {
      setLoading({
        jenis: true,
        kelompok: true,
        subKelompok: true
      })

      const newDataKelompok = dataKelompokAnggaran.filter(fil => fil.jenis === values.id_jenis_anggaran)
      const newDataSubKelompok = dataSubKelompokAnggaran.filter(fil => fil.kelompok === values.id_kelompok_anggaran)
      setDataFilterKelompokAnggaran(newDataKelompok)
      setDataFilterSubKelompokAnggaran(newDataSubKelompok)
      
      setTimeout(() => {
        setLoading({
          jenis: false,
          kelompok: false,
          subKelompok: false
        })
        setDisable({
          jenis: false,
          kelompok: false,
          subKelompok: false
        })
      }, 300);
    }

    useEffect(() => {
      getInitialDropdownAnggaran()
    }, [])

    return (
      <Row>
        <Col md>
          <SelectSearch 
            label="Jenis Anggaran"
            placeholder="Pilih jenis anggaran"
            option={dataJenisAnggaran}
            defaultValue={values.id_jenis_anggaran ? dataJenisAnggaran.filter(fil => fil.value === values.id_jenis_anggaran) : ''}
            onChange={val => onJenisChange(val.value)}
          />
        </Col>
        <Col md>
          <SelectSearch 
            label="Kelompok Anggaran"
            placeholder="Pilih kelompok anggaran"
            option={dataFilterKelompokAnggaran}
            defaultValue={values.id_kelompok_anggaran ? dataFilterKelompokAnggaran.filter(fil => fil.value === values.id_kelompok_anggaran) : ''}
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
            defaultValue={values.id_sub_kelompok_anggaran ? dataFilterSubKelompokAnggaran.filter(fil => fil.value === values.id_sub_kelompok_anggaran) : ''}
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
        showCloseButton={false}
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
            <Card.Header className="d-flex justify-content-between">
              <b>Edit Data</b>
              <Link to="/anggaran/transaksi/kegiatan">
                <BackButton size="sm" />
              </Link>
            </Card.Header>
            <Card.Body>
              <Container>
                <InfoSection />
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
                      <div className="my-3 d-flex justify-content-end">
                        <ActionButton
                          type="submit"
                          text="Ubah Kegiatan"
                          variant="success"
                          loading={formik.isSubmitting}
                        >
                        </ActionButton>
                      </div>
                    </form>
                  )}
                </Formik>
              </Container>
            </Card.Body>
          </Card>
        ) : (
          // Tidak ada data
          <DataStatus text="Tidak ada data" />
        )
      }
    </CRUDLayout>
  );
};

export default EditKegiatan;

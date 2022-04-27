import React, { useState, useEffect } from "react";
import { Modal, Row, Col, ButtonGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import {
  CRUDLayout,
  InputSearch,
  CreateButton,
  UpdateButton,
  ActionButton,
  DeleteButton,
  DataStatus,
  CreateModal,
  UpdateModal,
  DeleteModal,
  Alert,
  Input,
  Pagination,
  Select,
  TextArea,
  Switch,
  THead,
  TBody,
  Tr,
  ThFixed,
  TdFixed,
  Th,
  Td,
} from "components";
import { KelompokAnggaranApi, JenisAnggaranApi } from "api";
import { TableNumber } from "utilities";

const KelompokAnggaran = ({ setNavbarTitle }) => {
  const title = "Kelompok Anggaran";
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);

  // menampung value dari search form
  const [isSearching, setIsSearching] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  // menangani modal form tambah
  const [isCreateForm, setIsCreateForm] = useState(false);
  // menangani modal form ubah
  const [isUpdateform, setIsUpdateform] = useState(false);
  // menangani modal hapus data
  const [isDeleteData, setIsDeleteData] = useState(false);

  // data
  const [data, setData] = useState([]);
  const [dataJenisAnggaran, setDataJenisAnggaran] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataLength, setDataLength] = useState(10);
  const [dataCount, setDataCount] = useState(0);
  const [kode, setKode] = useState("");

  // menampung data yang akan diubah
  const [updateData, setUpdateData] = useState([]);
  // menampung data yang akan dihapus
  const [deleteData, setDeleteData] = useState([]);

  // menampilkan alert
  const [showAlert, setShowAlert] = useState(false);
  // configurasi alert
  const [alertConfig, setAlertConfig] = useState({
    variant: "primary",
    text: "",
  });

  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setIsSearching(false);

    // request data ke server
    Axios.all([
      KelompokAnggaranApi.getPage(page, dataLength, searchKey),
      JenisAnggaranApi.get(),
      KelompokAnggaranApi.getKode(),
    ])
      .then(
        Axios.spread((kelompokAnggaran, jenisAnggaran, kode) => {
          setData(kelompokAnggaran.data.data);
          setTotalPage(kelompokAnggaran.data.total_page);
          setDataCount(kelompokAnggaran.data.data_count);
          setDataJenisAnggaran(jenisAnggaran.data.data);
          setKode(kode.data.data);
        })
      )
      .catch(() => {
        setAlertConfig({
          variant: "danger",
          text: "Data gagal dimuat",
        });
        setShowAlert(true);
      })
      .finally(() => {
        setIsLoading(false)
      });
  };

  // fungsi show/ hide
  const changeDataStatus = (status, id) => {
    setIsLoading(true);
    setShowAlert(false);

    const value = {
      id_kelompok_anggaran: id,
    };

    const onLoadedSuccess = () => {
      setIsSearching(false);
      setAlertConfig({
        variant: "primary",
        text: "Ubah status data berhasil",
      });
      setShowAlert(true);
    };

    const onLoadedFailed = () => {
      setIsSearching(false);
      setAlertConfig({
        variant: "danger",
        text: "Ubah status data gagal",
      });
      setShowAlert(true);
    };

    status === true
      ? KelompokAnggaranApi.show(value)
        .then(() => onLoadedSuccess())
        .catch(() => onLoadedFailed())
        .finally(() => getData())
      : KelompokAnggaranApi.hide(value)
        .then(() => onLoadedSuccess())
        .catch(() => onLoadedFailed())
        .finally(() => getData());
  };

  // menangani prev pagination
  const prevPageHandler = () => {
    setPage(page - 1);
  };

  // menangani next pagination
  const nextPageHandler = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Kelompok Anggaran");

    // jalankan function request data ke server
    getData();

    return () => {
      setIsLoading(false);
      setIsSearching(false);
    };
  }, [setNavbarTitle, page, dataLength, searchKey]);

  // Modal Tambah
  const TambahModal = () => {
    // nilai awal form
    const formInitialValues = {
      kode_kelompok_anggaran: kode,
      nama_kelompok_anggaran: "",
      id_jenis_anggaran: "",
      keterangan: "",
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      kode_kelompok_anggaran: Yup.number()
        .required("Masukan kode")
        .typeError("Kode hanya dapat berupa angka"),
      nama_kelompok_anggaran: Yup.string().required("Masukan nama kelompok anggaran"),
      id_jenis_anggaran: Yup.string().required("Pilih jenis anggaran"),
    });

    // request tambah data ke server
    const formSubmitHandler = (value) => {
      KelompokAnggaranApi.create(value)
        .then(() => {
          setAlertConfig({
            variant: "primary",
            text: "Tambah data berhasil!",
          });
        })
        .catch(() => {
          setAlertConfig({
            variant: "danger",
            text: `Tambah data gagal!`,
          });
        })
        .finally(() => {
          // menampilkan alert
          setShowAlert(true);
          // menutup modal tambah
          setIsCreateForm(false);
          // request data baru ke server
          getData();
        });
    };

    return (
      <CreateModal show={isCreateForm} onHide={() => setIsCreateForm(false)} title={title}>
        <Formik
          initialValues={formInitialValues}
          validationSchema={formValidationSchema}
          onSubmit={formSubmitHandler}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Input
                  label="Kode"
                  type="text"
                  name="kode_kelompok_anggaran"
                  placeholder="Masukan kode"
                  readOnly={true}
                  value={values.kode_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.kode_kelompok_anggaran && touched.kode_kelompok_anggaran && true}
                  errorText={errors.kode_kelompok_anggaran}
                />
                <Input
                  label="Nama Kelompok Anggaran"
                  type="text"
                  name="nama_kelompok_anggaran"
                  placeholder="Masukan nama kelompok anggaran"
                  value={values.nama_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.nama_kelompok_anggaran && touched.nama_kelompok_anggaran && true}
                  errorText={errors.nama_kelompok_anggaran}
                />
                <Select
                  label="Jenis Anggaran"
                  type="text"
                  name="id_jenis_anggaran"
                  value={values.id_jenis_anggaran}
                  onChange={handleChange}
                  error={errors.id_jenis_anggaran && touched.id_jenis_anggaran && true}
                  errorText={errors.id_jenis_anggaran}
                >
                  <option value="">Pilih jenis anggaran</option>
                  {dataJenisAnggaran
                    .filter((res) => res.is_hidden === false)
                    .map((res, index) => (
                      <option key={index} value={res.id_jenis_anggaran}>
                        {res.nama_jenis_anggaran}
                      </option>
                    ))}
                </Select>
                <TextArea
                  label="Keterangan"
                  type="text"
                  name="keterangan"
                  placeholder="Masukan keterangan"
                  value={values.keterangan}
                  onChange={handleChange}
                  error={errors.keterangan && touched.keterangan && true}
                  errorText={errors.keterangan}
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

  // Modal Ubah
  const UbahModal = () => {
    // nilai awal form
    const formInitialValues = {
      id_kelompok_anggaran: updateData.id_kelompok_anggaran,
      kode_kelompok_anggaran: updateData.kode_kelompok_anggaran,
      nama_kelompok_anggaran: updateData.nama_kelompok_anggaran,
      id_jenis_anggaran: updateData.id_jenis_anggaran,
      keterangan: updateData.keterangan,
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      kode_kelompok_anggaran: Yup.number()
        .required("Masukan kode")
        .typeError("Kode hanya dapat berupa angka"),
      nama_kelompok_anggaran: Yup.string().required("Masukan nama kelompok anggaran"),
      id_jenis_anggaran: Yup.string().required("Pilih jenis anggaran"),
    });

    // request ubah data ke server
    const formSubmitHandler = (value) => {
      KelompokAnggaranApi.update(value)
        .then(() => {
          setAlertConfig({
            variant: "primary",
            text: "Ubah data berhasil!",
          });
        })
        .catch(() => {
          setAlertConfig({
            variant: "danger",
            text: `Ubah data gagal!`,
          });
        })
        .finally(() => {
          // menampilkan alert
          setShowAlert(true);
          // menutup modal ubah
          setIsUpdateform(false);
          // request data baru ke server
          getData();
        });
    };

    return (
      <UpdateModal show={isUpdateform} onHide={() => setIsUpdateform(false)} title={title}>
        <Formik
          initialValues={formInitialValues}
          validationSchema={formValidationSchema}
          onSubmit={formSubmitHandler}
        >
          {({ values, errors, touched, isSubmitting, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Input
                  label="Kode"
                  type="text"
                  name="kode_kelompok_anggaran"
                  placeholder="Masukan kode"
                  readOnly={true}
                  value={values.kode_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.kode_kelompok_anggaran && touched.kode_kelompok_anggaran && true}
                  errorText={errors.kode_kelompok_anggaran}
                />
                <Input
                  label="Nama Kelompok Anggaran"
                  type="text"
                  name="nama_kelompok_anggaran"
                  placeholder="Masukan nama kelompok anggaran"
                  value={values.nama_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.nama_kelompok_anggaran && touched.nama_kelompok_anggaran && true}
                  errorText={errors.nama_kelompok_anggaran}
                />
                <Select
                  label="Jenis Anggaran"
                  type="text"
                  name="id_jenis_anggaran"
                  defaultValue={values.id_jenis_anggaran}
                  onChange={handleChange}
                  error={errors.id_jenis_anggaran && touched.id_jenis_anggaran && true}
                  errorText={errors.id_jenis_anggaran}
                >
                  <option value="">Pilih jenis anggaran</option>
                  {dataJenisAnggaran
                    .filter((res) => res.is_hidden === false)
                    .map((res, index) => (
                      <option key={index} value={res.id_jenis_anggaran}>
                        {res.nama_jenis_anggaran}
                      </option>
                    ))}
                </Select>
                <TextArea
                  label="Keterangan"
                  type="text"
                  name="keterangan"
                  placeholder="Masukan keterangan"
                  value={values.keterangan}
                  onChange={handleChange}
                  error={errors.keterangan && touched.keterangan && true}
                  errorText={errors.keterangan}
                />
              </Modal.Body>
              <Modal.Footer>
                <ActionButton
                  type="submit"
                  variant="success"
                  text="Ubah"
                  className="mt-2 px-4"
                  loading={isSubmitting}
                />
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </UpdateModal>
    );
  };

  // Modal Hapus
  const HapusModal = () => {
    // id dari data yang ingin dihapus
    const idData = deleteData.id_kelompok_anggaran;
    const value = { id_kelompok_anggaran: idData };
    // menangani delete button loading
    const [btnLoading, setBtnLoading] = useState(false);

    // request hapus data ke server

    const deleteDataHandler = () => {
      // set delete button loading
      setBtnLoading(true);
      KelompokAnggaranApi.delete(value)
        .then(() => {
          setAlertConfig({
            variant: "primary",
            text: "Hapus data berhasil!",
          });
        })
        .catch(() => {
          setAlertConfig({
            variant: "danger",
            text: `Hapus data gagal!`,
          });
        })
        .finally(() => {
          // menampilkan alert
          setShowAlert(true);
          // menutup hapus modal
          setIsDeleteData(false);
          // request data baru ke server
          getData();
        });
    };

    return (
      <DeleteModal
        show={isDeleteData}
        onHide={() => setIsDeleteData(false)}
        loading={btnLoading}
        onConfirm={deleteDataHandler}
        title={title}
      >
        <span>Nama Kelompok Anggaran : {deleteData.nama_kelompok_anggaran}</span>
      </DeleteModal>
    );
  };

  // Tabel
  const Table = () => (
    <>
      <CRUDLayout.Table>
        <THead>
          <Tr>
            <ThFixed>No</ThFixed>
            <ThFixed>Aksi</ThFixed>
            <ThFixed>Kode</ThFixed>
            <Th>Nama Kelompok Anggaran</Th>
            <Th>Jenis Anggaran</Th>
            <Th>Keterangan</Th>
          </Tr>
        </THead>
        <TBody>
          {data.map((val, index) => (
            <Tr key={index}>
              <TdFixed textCenter>{TableNumber(page, dataLength, index)}</TdFixed>
              <TdFixed>
                <div className="d-flex justify-content-center">
                  <ButtonGroup size="sm" className="mr-1">
                    <UpdateButton
                      onClick={() => {
                        setUpdateData(val);
                        setIsUpdateform(true);
                      }}
                    />
                    <DeleteButton
                      onClick={() => {
                        setDeleteData(val);
                        setIsDeleteData(true);
                      }}
                    />
                  </ButtonGroup>
                  <Switch
                    id={toString(index + 1)}
                    checked={val.is_hidden === false ? true : false}
                    onChange={() => changeDataStatus(val.is_hidden, val.id_kelompok_anggaran)}
                  />
                </div>
              </TdFixed>
              <TdFixed>{val.kode_kelompok_anggaran}</TdFixed>
              <Td>{val.nama_kelompok_anggaran}</Td>
              <Td>{val.nama_jenis_anggaran}</Td>
              <Td>{val.keterangan}</Td>
            </Tr>
          ))}
        </TBody>
      </CRUDLayout.Table>
      {!isSearching && (
        <Pagination
          dataLength={dataLength}
          dataNumber={page * dataLength - dataLength + 1}
          dataPage={dataCount < dataLength ? dataCount : page * dataLength}
          dataCount={dataCount}
          currentPage={page}
          totalPage={totalPage}
          onPaginationChange={({ selected }) => setPage(selected + 1)}
          onDataLengthChange={(e) => {
            setPage(1)
            setDataLength(e.target.value)
          }}
        />
      )}
    </>
  );
  return (
    <CRUDLayout>
      {/* Head */}
      <CRUDLayout.Head>
        {/* Search Section */}
        <CRUDLayout.HeadSearchSection>
          <Row>
            <Col md="8">
              <InputSearch
                onChange={(e) => {
                  setTimeout(() => {
                    setSearchKey(e.target.value)
                    setPage(1)
                  }, 1000);
                }}
                onSubmit={(e) => e.preventDefault()}
              />
            </Col>
          </Row>
        </CRUDLayout.HeadSearchSection>

        {/* Button Section */}
        <CRUDLayout.HeadButtonSection>
          <CreateButton onClick={() => setIsCreateForm(true)} />
        </CRUDLayout.HeadButtonSection>
      </CRUDLayout.Head>

      {/* ALert */}
      <Alert
        show={showAlert}
        showCloseButton={true}
        variant={alertConfig.variant}
        text={alertConfig.text}
        onClose={() => setShowAlert(false)}
      />

      {/* Table Section */}
      {
        isLoading === true 
          ? <DataStatus loading={true} text="Memuat data..." />
          : !data || data.length < 1
            ? <DataStatus text="Tidak ada data" />
            : <Table />
      }

      {/* Modal */}
      <TambahModal />
      <UbahModal />
      <HapusModal />
    </CRUDLayout>
  );
};

export default KelompokAnggaran;
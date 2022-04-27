import React, { useState, useEffect } from "react";
import { Modal, Col, Row, ButtonGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import {
  CRUDLayout,
  InputSearch,
  CreateButton,
  DeleteButton,
  UpdateButton,
  ActionButton,
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
import { KelompokAnggaranApi, SubkelompokAnggaranApi } from "api";
import { TableNumber } from "utilities";

const SubkelompokAnggaran = ({ setNavbarTitle }) => {
  const title = "Sub Kelompok Anggaran";
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
  const [dataKelompokAnggaran, setDataKelompokAnggaran] = useState([]);
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
  // request data dari server
  const getData = () => {
    setIsLoading(true);
    setIsSearching(false);

    // request data ke server
    Axios.all([
      SubkelompokAnggaranApi.getPage(page, dataLength, searchKey),
      KelompokAnggaranApi.get(),
      SubkelompokAnggaranApi.getKode(),
    ])
      .then(
        Axios.spread((subkelompokAnggaran, kelompokAnggaran, kode) => {
          console.log(subkelompokAnggaran)
          setData(subkelompokAnggaran.data.data);
          setTotalPage(subkelompokAnggaran.data.total_page);
          setDataCount(subkelompokAnggaran.data.data_count);
          setDataKelompokAnggaran(kelompokAnggaran.data.data);
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
      id_sub_kelompok_anggaran: id,
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
      ? SubkelompokAnggaranApi.show(value)
        .then(() => onLoadedSuccess())
        .catch(() => onLoadedFailed())
        .finally(() => getData())
      : SubkelompokAnggaranApi.hide(value)
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
    setNavbarTitle("Subkelompok Anggaran");

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
      kode_sub_kelompok_anggaran: kode,
      nama_sub_kelompok_anggaran: "",
      keterangan: "",
      id_kelompok_anggaran: "",
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      kode_sub_kelompok_anggaran: Yup.number()
        .required("Masukan kode")
        .typeError("Kode hanya dapat berupa angka"),
      nama_sub_kelompok_anggaran: Yup.string().required("Masukan sub kelompok anggaran"),
    });

    // request tambah data ke server
    const formSubmitHandler = (value) => {
      SubkelompokAnggaranApi.create(value)
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
                  name="kode_sub_kelompok_anggaran"
                  placeholder="Masukan kode"
                  readOnly={true}
                  value={values.kode_sub_kelompok_anggaran}
                  onChange={handleChange}
                  error={
                    errors.kode_sub_kelompok_anggaran && touched.kode_sub_kelompok_anggaran && true
                  }
                  errorText={errors.kode_sub_kelompok_anggaran}
                />
                <Input
                  label="Nama Sub Kelompok Anggaran"
                  type="text"
                  name="nama_sub_kelompok_anggaran"
                  placeholder="Masukan nama sub kelompok anggaran"
                  value={values.nama_sub_kelompok_anggaran}
                  onChange={handleChange}
                  error={
                    errors.nama_sub_kelompok_anggaran && touched.nama_sub_kelompok_anggaran && true
                  }
                  errorText={errors.nama_sub_kelompok_anggaran}
                />
                <Select
                  label="Kelompok Anggaran"
                  name="id_kelompok_anggaran"
                  value={values.id_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.id_kelompok_anggaran && touched.id_kelompok_anggaran && true}
                  errorText={errors.id_kelompok_anggaran}
                >
                  <option value="">Pilih kelompok anggaran</option>
                  {dataKelompokAnggaran
                    .filter((val) => val.is_hidden === false)
                    .map((val, index) => (
                      <option key={index} value={val.id_kelompok_anggaran}>
                        {val.nama_kelompok_anggaran}
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
      id_sub_kelompok_anggaran: updateData.id_sub_kelompok_anggaran,
      kode_sub_kelompok_anggaran: updateData.kode_sub_kelompok_anggaran,
      nama_sub_kelompok_anggaran: updateData.nama_sub_kelompok_anggaran,
      keterangan: updateData.keterangan,
      id_kelompok_anggaran: updateData.id_kelompok_anggaran,
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      kode_sub_kelompok_anggaran: Yup.number()
        .required("Masukan kode")
        .typeError("Kode hanya dapat berupa angka"),
      nama_sub_kelompok_anggaran: Yup.string().required("Masukan sub kelompok anggaran"),
    });

    // request ubah data ke server
    const formSubmitHandler = (value) => {
      SubkelompokAnggaranApi.update(value)
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
                  name="kode_sub_kelompok_anggaran"
                  placeholder="Masukan kode"
                  readOnly={true}
                  value={values.kode_sub_kelompok_anggaran}
                  onChange={handleChange}
                  error={
                    errors.kode_sub_kelompok_anggaran && touched.kode_sub_kelompok_anggaran && true
                  }
                  errorText={errors.kode_sub_kelompok_anggaran}
                />
                <Input
                  label="Nama Sub Kelompok Anggaran"
                  type="text"
                  name="nama_sub_kelompok_anggaran"
                  placeholder="Masukan nama sub kelompok anggaran"
                  value={values.nama_sub_kelompok_anggaran}
                  onChange={handleChange}
                  error={
                    errors.nama_sub_kelompok_anggaran && touched.nama_sub_kelompok_anggaran && true
                  }
                  errorText={errors.nama_sub_kelompok_anggaran}
                />
                <Select
                  label="Kelompok Anggaran"
                  name="id_kelompok_anggaran"
                  defaultValue={values.id_kelompok_anggaran}
                  onChange={handleChange}
                  error={errors.id_kelompok_anggaran && touched.id_kelompok_anggaran && true}
                  errorText={errors.id_kelompok_anggaran}
                >
                  <option value="">Pilih kelompok anggaran</option>
                  {dataKelompokAnggaran
                    .filter((val) => val.is_hidden === false)
                    .map((val, index) => (
                      <option key={index} value={val.id_kelompok_anggaran}>
                        {val.nama_kelompok_anggaran}
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
    const idData = deleteData.id_sub_kelompok_anggaran;
    const value = { id_sub_kelompok_anggaran: idData };
    console.log(value);

    // menangani delete button loading
    const [btnLoading, setBtnLoading] = useState(false);

    // request hapus data ke server

    const deleteDataHandler = () => {
      // set delete button loading
      setBtnLoading(true);
      SubkelompokAnggaranApi.delete(value)
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
        <span>Nama Sub Kelompok Anggaran : {deleteData.nama_sub_kelompok_anggaran}</span>
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
            <ThFixed className="text-center">Aksi</ThFixed>
            <ThFixed>Kode</ThFixed>
            <Th>Nama Sub Kelompok Anggaran</Th>
            <Th>Kelompok Anggaran</Th>
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
                    onChange={() => changeDataStatus(val.is_hidden, val.id_sub_kelompok_anggaran)}
                  />
                </div>
              </TdFixed>
              <TdFixed>{val.kode_sub_kelompok_anggaran}</TdFixed>
              <Td>{val.nama_sub_kelompok_anggaran}</Td>
              <Td>{val.nama_kelompok_anggaran}</Td>
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

export default SubkelompokAnggaran;

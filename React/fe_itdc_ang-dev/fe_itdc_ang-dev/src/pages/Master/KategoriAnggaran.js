import React, { useState, useEffect } from "react";
import { Modal, Col, Row, ButtonGroup } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
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
import { KategoriAnggaranApi } from "api";
import { TableNumber } from "utilities";

const KategoriAnggaran = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const title = "Kategori Anggaran";
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
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [dataLength, setDataLength] = useState(10);
  const [dataCount, setDataCount] = useState(0);

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
    KategoriAnggaranApi.getPage(page, dataLength, searchKey)
      .then((res) => {
        setData(res.data.data);
        setTotalPage(res.data.total_page);
        setDataCount(res.data.data_count);
      })
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
      id_kategori_sumber_daya: id,
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
      ? KategoriAnggaranApi.show(value)
        .then(() => onLoadedSuccess())
        .catch(() => onLoadedFailed())
        .finally(() => getData())
      : KategoriAnggaranApi.hide(value)
        .then(() => onLoadedSuccess())
        .catch(() => onLoadedFailed())
        .finally(() => getData());
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Kategori Anggaran");

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
      nama_kategori_sumber_daya: "",
      keterangan: "",
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      nama_kategori_sumber_daya: Yup.string().required("Masukan kategori anggaran"),
    });

    // request tambah data ke server
    const formSubmitHandler = (values) => {
      KategoriAnggaranApi.create(values)
        .then(() => {
          // konfigurasi alert
          setAlertConfig({
            variant: "primary",
            text: "Tambah data berhasil!",
          });
        })
        .catch(() => {
          // konfigurasi alert
          setAlertConfig({
            variant: "danger",
            text: `Tambah data gagal!`,
          });
        })
        .finally(() => {
          // menutup modal
          setIsCreateForm(false);
          // menampilkan alert
          setShowAlert(true);
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
                  label="Nama Kategori Anggaran"
                  type="text"
                  name="nama_kategori_sumber_daya"
                  placeholder="Masukan nama kategori anggaran"
                  value={values.nama_kategori_sumber_daya}
                  onChange={handleChange}
                  error={
                    errors.nama_kategori_sumber_daya && touched.nama_kategori_sumber_daya && true
                  }
                  errorText={errors.nama_kategori_sumber_daya}
                />
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
      id_kategori_sumber_daya: updateData.id_kategori_sumber_daya,
      nama_kategori_sumber_daya: updateData.nama_kategori_sumber_daya,
      keterangan: updateData.keterangan,
    };

    // skema validasi form
    const formValidationSchema = Yup.object().shape({
      nama_kategori_sumber_daya: Yup.string().required("Masukan kategori anggaran"),
    });

    // request ubah data ke server
    const formSubmitHandler = (values) => {
      const finalValues = {
        id_kategori_sumber_daya: updateData.id_kategori_sumber_daya,
        ...values,
      };

      KategoriAnggaranApi.update(finalValues)
        .then(() => {
          // konfigurasi alert
          setAlertConfig({
            variant: "primary",
            text: "Ubah data berhasil!",
          });
        })
        .catch(() => {
          // konfigurasi alert
          setAlertConfig({
            variant: "danger",
            text: `Ubah data gagal!`,
          });
        })
        .finally(() => {
          // // stop loading pada button pada modal
          // setSubmitting(false)
          // menutup modal
          setIsUpdateform(false);
          // menampilkan alert
          setShowAlert(true);
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
                  label="Nama Kategori Anggaran"
                  type="text"
                  name="nama_kategori_sumber_daya"
                  placeholder="Masukan nama kategori anggaran"
                  value={values.nama_kategori_sumber_daya}
                  onChange={handleChange}
                  error={
                    errors.nama_kategori_sumber_daya && touched.nama_kategori_sumber_daya && true
                  }
                  errorText={errors.nama_kategori_sumber_daya}
                />
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
    const idData = deleteData.id_kategori_sumber_daya;
    const value = { id_kategori_sumber_daya: idData };

    // menangani delete button loading
    const [btnLoading, setBtnLoading] = useState(false);

    // request hapus data ke server

    const deleteDataHandler = () => {
      // set delete button loading
      setBtnLoading(true);
      KategoriAnggaranApi.delete(value)
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
      >
        <span>Nama Kategori Anggaran : {deleteData.nama_kategori_sumber_daya}</span>
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
            <Th>Nama Kategori Anggaran</Th>
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
                    onChange={() => changeDataStatus(val.is_hidden, val.id_kategori_sumber_daya)}
                  />
                </div>
              </TdFixed>
              <Td>{val.nama_kategori_sumber_daya}</Td>
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

export default KategoriAnggaran;

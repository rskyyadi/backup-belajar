import React, { useState, useEffect } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useParams } from "react-router-dom";
import {
  BackButton,
  CRUDLayout,
  DataStatus,
  THead,
  TBody,
  ThFixed,
  TdFixed,
  Tr,
  Th,
  Td,
  InfoItemVertical,
  InfoItemHorizontal
} from "components";
import { Link } from "react-router-dom";
import { KegiatanAnggaranApi } from "api";
import { DateConvert, RupiahConvert } from "utilities";

const DetailKegiatan = ({ setNavbarTitle }) => {
  // indikator pemanggilan data sedang dimuat di server (loading)
  const [isLoading, setIsLoading] = useState(true);
  // configurasi alert
  // Fetch data
  const [data, setData] = useState([]);
  const [dataKaryawan, setDataKaryawan] = useState([]);
  const { id } = useParams();
  // request data dari server
  const getData = () => {
    setIsLoading(true);

    // request data ke server
    Axios.all([
      KegiatanAnggaranApi.getSingle({id_kegiatan: id})
    ])
      .then(
        Axios.spread((kegiatan) => {
          setData(kegiatan.data.data ?? {});
        })
      )
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // set Judul di Navbar
    setNavbarTitle("Detail Kegiatan");

    // jalankan function request data ke server
    getData();
  }, [setNavbarTitle]);

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

  const DetailData = () => {
    const totalSumberDaya = () => {
      let total = 0;

      data.sumber_daya.map((val) => {
        const subTotal = parseInt(val.harga_satuan) * parseInt(val.qty);
        total = total + subTotal;
      });

      return total;
    };

    return (
      <>
        <Row>
          <Col lg={6}>
            <InfoItemHorizontal
              label="Tanggal Kegiatan :"
              text={data.tgl_kegiatan ? DateConvert(new Date(data.tgl_kegiatan)).detail : '-'}
            />
            <InfoItemHorizontal label="No. kegiatan :" text={data.no_kegiatan ?? '-'} />
            <InfoItemHorizontal label="Nama Kegiatan :" text={data.nama_kegiatan} />
            <InfoItemHorizontal
              label="Penanggung Jawab :"
              text={data.nama_karyawan}
            />
          </Col>
          <Col lg={6}>
            <InfoItemHorizontal
              label="Periode Mulai :"
              text={data.periode_mulai ? DateConvert(new Date(data.periode_mulai)).detail : '-'}
            
            />
            <InfoItemHorizontal
              label="Periode Selesai :"
              text={data.periode_selesai ? DateConvert(new Date(data.periode_selesai)).detail : '-'}
            />
            <InfoItemHorizontal label="Keterangan :" text={data.deskripsi_kegiatan ?? '-'} />
          </Col>
        </Row>
        <hr />
        <InfoItemHorizontal
          label="Jenis Anggaran :"
          text={data.jenis_anggaran ?? '-'}
        />
        <InfoItemHorizontal 
          label="Kelompok Anggaran :" 
          text={data.nama_kelompok_anggaran ?? '-'} 
        />
        <InfoItemHorizontal
          label="Sub Kelompok Anggaran :"
          text={data.nama_sub_kelompok_anggaran ?? '-'}
        />
      </>
    );
  };

  const CatatanApproval = () => {
    const dataStakeholder = data.stakeholder ?? []

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

  return (
    <CRUDLayout>
      {/* Head */}
      <CRUDLayout.Head>{/* Button Section */}</CRUDLayout.Head>

      {/* Table Section */}
      {
        // cek apakah data sedang dimuat (loading)
        isLoading === true ? (
          // loading
          <DataStatus loading={true} text="Memuat data..." />
        ) : // Cek apakah ada data
        data !== null ? (
          // Ada data
          <>
            <Card className="pb-3">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <b>Detail Data Kegiatan</b>
                <Link to="/anggaran/transaksi/kegiatan">
                  <BackButton size="sm" />
                </Link>
              </Card.Header>
              <Card.Body>
                <Container>
                  <InfoSection />
                  <hr />
                  <DetailData />
                </Container>
              </Card.Body>
            </Card>
            <CatatanApproval />
          </>
        ) : (
          // Tidak ada data
          <DataStatus text="Tidak ada data" />
        )
      }
    </CRUDLayout>
  );
};

export default DetailKegiatan;
import { DataStatus } from 'components'
import React, { 
  PureComponent
} from 'react'
import {
  Table
} from 'react-bootstrap'
import {
  RupiahConvert
} from 'utilities'

const PrintContent = ({dataPPA}) => {
  console.log(dataPPA)
  const HeadSection = () => (
    <div className="d-flex flex-column align-items-center mb-4">
      <b>PT. ITDC NUSANTARA UTILITAS</b>
      <b>PERSETUJUAN PRINSIP PENGADAAN BARANG DAN JASA</b>
      <b>SERTA PEMBAYARAN</b>
    </div>
  )

  const InfoSection = () => {
    const InfoItem = ({title, value}) => (
      <tr>
        <th>{title}</th>
        <td className="pl-5 pr-2">:</td>
        <td>{value}</td>
      </tr>
    )

    return (
      <>
        <table className="mt-4">
          <tbody>
            <InfoItem title="Tanggal Realisasi PPA" value={dataPPA?.realisasi?.tgl_ppa_realisasi} />
            <InfoItem title="No. Realisasi PPA" value={dataPPA?.realisasi?.no_ppa_realisasi} />
          </tbody>
        </table>
        <tr />
        <div className="d-flex flex-column align-items-center mb-4">
          <b className="mb-2">Jurnal Akutansi</b>
          <table>
            <tbody>
              <InfoItem title="Tipe Anggaran" value={dataPPA?.ppa?.tipe_anggaran} />
              <InfoItem title="COA Kredit" value={dataPPA?.realisasi?.coa_kredit} />
            </tbody>
          </table>
        </div>
        <div className="d-flex flex-column align-items-center mb-4">
          <b className="py-2">Bukti Transaksi</b>
          {dataPPA?.realisasi?.bukti
            ? <img 
                src={process.env.REACT_APP_API_FILE_URL + dataPPA?.realisasi?.bukti}
                alt="bukti transaksi" 
                height="250px"
              />
            : <DataStatus text="Tidak ada bukti" />
          }
        </div>
        <hr />
        <table className="mt-4">
          <tbody>
            <InfoItem title="Tanggal PPA" value={dataPPA?.ppa?.tgl_ppa} />
            <InfoItem title="No. PPA" value={dataPPA?.ppa?.no_ppa} />
            <InfoItem title="Dari" value={dataPPA?.ppa?.dari} />
            <InfoItem title="Program" value={dataPPA?.ppa?.nama_program} />
            <InfoItem title="Kegiatan" value={dataPPA?.ppa?.nama_kegiatan} />
            <InfoItem title="Sumber Daya" value={dataPPA?.ppa?.sumber_daya} />
          </tbody>
        </table>
      </>
    )
  }

  const AnggaranSection = () => {
    const AnggaranItem = ({title, value}) => (
      <tr>
        <th>{title}</th>
        <td className="pl-5 pr-2">:</td>
        <td className="text-right pl-2">{value}</td>
      </tr>
    )

    return (
      <div className="d-flex flex-column align-items-center mb-4">
        <b className="mb-2">Mata Anggaran</b>
        <table>
          <tr>
            <AnggaranItem title="Pos" value={dataPPA?.ppa?.tipe_anggaran} />
            <AnggaranItem title="Nilai" value={dataPPA?.mata_anggaran?.nominal_anggaran ? RupiahConvert(dataPPA.mata_anggaran.nominal_anggaran.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Realisasi" value={dataPPA?.mata_anggaran?.nominal_terealisasi ? RupiahConvert(dataPPA.mata_anggaran.nominal_terealisasi.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Sisa" value={dataPPA?.mata_anggaran?.nominal_sisa ? RupiahConvert(dataPPA.mata_anggaran.nominal_sisa.toString()).detail : RupiahConvert('0').detail} />
            <AnggaranItem title="Jumlah Transaksi" value={dataPPA?.mata_anggaran?.jumlah_transaksi ? RupiahConvert(dataPPA.mata_anggaran.jumlah_transaksi.toString()).detail : RupiahConvert('0').detail} />
          </tr>
        </table>
      </div>
    )
  }

  const PersetujuanSection = () => {
    const HeadItem = ({top, bottom}) => (
      <th 
        className="text-center bg-light"
        style={{width: '33.3%'}}
      >
        <div>{top}</div>
        <div>{bottom}</div>
      </th>
    )
    
    const InfoItem = ({nama, tanggal}) => (
      <div style={{fontSize: '14px'}}>
        <div className="d-flex pb-1">
          <div style={{width: '50px'}}>Nama</div>
          <div className="pl-3 pr-2">:</div>
          <div>{nama}</div>
        </div>
        <div className="d-flex">
          <div style={{width: '50px'}}>Tanggal</div>
          <div className="pl-3 pr-2">:</div>
          <div>{tanggal}</div>
        </div>
      </div>
    )

    return (
      <div className="mt-4 pb-3">
        <div className="text-center">
          <b>PERSETUJUAN PRINSIP</b>
        </div>
        <Table 
          bordered
          className="mt-4"
        >
          <thead>
            <tr>
              <HeadItem top="Setuju Diadakan" bottom="(Approved)" />
              <HeadItem top="Diperiksa" bottom="(Checker)" />
              <HeadItem top="Pembuat" bottom="(Maker)" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_approver}
                    width="100"
                  />
                </div>
              </td>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_checker}
                    width="100"
                  />
                </div>
              </td>
              <td style={{height: '150px'}}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={dataPPA?.persetujuan?.ttd_maker}
                    width="100"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <InfoItem nama={dataPPA?.persetujuan?.approver} tanggal={dataPPA?.persetujuan?.tgl_approver} />
              </td>
              <td>
                <InfoItem nama={dataPPA?.persetujuan?.checker} tanggal={dataPPA?.persetujuan?.tgl_checker} />
              </td>
              <td>
                <InfoItem nama={dataPPA?.persetujuan?.maker} tanggal={dataPPA?.persetujuan?.tgl_maker} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }

  const CatatanSection = () => {
    return (
      <div className="pt-3">
        <b>Catatan :</b>
        <ul>
          <li className="pt-3">
            PPA ini adalah PPA manual yang mengacu pada draft RKAP yang belum melalui RUPS RKAP 2021. Bila terjadi perubahan nilai setelah RUPS dilakukan, maka akan terdapat penyesuaian dalam sistem anggaran.
          </li>
          <li className="pt-3">
            PPA manual ini sebagai dasar proses pengadaan pekerjaan maupun pembayaran & akan diganti dengan PPA di sistem setelah RUPS & upload anggaran selesai dilakukan.
          </li>
        </ul>
      </div>
    )
  }

  return (
    <>
      <HeadSection />
      <hr />
      <InfoSection />
      <AnggaranSection />
      <hr />
      <PersetujuanSection />
      <hr />
      <CatatanSection />
    </>
  )
}

export default class PrintPPA extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="p-5 bg-white">
        <PrintContent 
          dataPPA={this.props.dataPPA}
        />
      </div>
    )
  }
}
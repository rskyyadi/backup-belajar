import {
  // Dashboard
  Dashboard,

  // 404
  NotFound,

  // Login
  Login,

// MASTER
  JenisAnggaran,
  KelompokAnggaran,
  SubkelompokAnggaran,
  KategoriAnggaran,

// TRANSAKSI
  // Program
  Program,

  // Kegiatan
  Kegiatan,
  ListProgram,
  AddKegiatan,
  EditKegiatan,
  DetailKegiatan,

  // Sub Kegiatan
  ListSubKegiatan,
  ListKegiatanSubKegiatan,
  DetailSubKegiatan,
  TambahSubKegiatan,
  UbahSubKegiatan,

  // PPA
  PPA,
  DetailPPA,
  CetakPPA,
  SumberDayaPPA,

  // Realisasi PPA
  RealisasiPPA,
  ApprovedPPA,
  DetailRealisasiPPA,
  TambahRealisasiPPA,
  UbahRealisasiPPA,
} from "pages"

/* 
  MENU REQUIREMENTS
    > EXACT = OPTIONAL (TRUE/FALSE)
    > PATH  = REQUIRED
    > PAGE  = REQUIRED
    > HAK   = REQUIRED (HARUS BERBENTUK ARRAY)
*/

export default [
// MASTER
  // Jenis Anggaran
  {
    exact: true,
    path: '/anggaran/master/jenis-anggaran',
    page: JenisAnggaran,
    hak: ['ANG', 'ANG_MAS_JEN']
  },
  // Kelompok Anggaran
  {
    exact: true,
    path: '/anggaran/master/kelompok-anggaran',
    page: KelompokAnggaran,
    hak: ['ANG', 'ANG_MAS_KEL']
  },
  // Sub Kelompok Anggaran
  {
    exact: true,
    path: '/anggaran/master/subkelompok-anggaran',
    page: SubkelompokAnggaran,
    hak: ['ANG', 'ANG_MAS_SUB']
  },
  // Kategori Anggaran
  {
    exact: true,
    path: '/anggaran/master/kategori-anggaran',
    page: KategoriAnggaran,
    hak: ['ANG', 'ANG_MAS_KAT']
  },

// TRANSAKSI
  // Program
  {
    exact: true,
    path: '/anggaran/transaksi/program',
    page: Program,
    hak: ['ANG', 'ANG_TRN_PRO']
  },

  // Kegiatan
  {
    exact: true,
    path: '/anggaran/transaksi/kegiatan',
    page: Kegiatan,
    hak: ['ANG', 'ANG_TRN_KEG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/kegiatan/list-program',
    page: ListProgram,
    hak: ['ANG', 'ANG_TRN_KEG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/kegiatan/tambah-kegiatan/:id',
    page: AddKegiatan,
    hak: ['ANG', 'ANG_TRN_KEG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/kegiatan/edit-kegiatan/:id',
    page: EditKegiatan,
    hak: ['ANG', 'ANG_TRN_KEG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/kegiatan/detail-kegiatan/:id',
    page: DetailKegiatan,
    hak: ['ANG', 'ANG_TRN_KEG']
  },

  // Sub Kegiatan
  {
    exact: true,
    path: '/anggaran/transaksi/sub-kegiatan',
    page: ListSubKegiatan,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/sub-kegiatan/kegiatan',
    page: ListKegiatanSubKegiatan,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/sub-kegiatan/detail/:id',
    page: DetailSubKegiatan,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/sub-kegiatan/tambah/:id',
    page: TambahSubKegiatan,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/sub-kegiatan/ubah/:id',
    page: UbahSubKegiatan,
    hak: ['ANG']
  },

  // PPA
  {
    exact: true,
    path: '/anggaran/transaksi/ppa',
    page: PPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/ppa/detail/:id',
    page: DetailPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/ppa/cetak/:id',
    page: CetakPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/ppa/sumber-daya',
    page: SumberDayaPPA,
    hak: ['ANG']
  },

  // Realisasi PPA
  {
    exact: true,
    path: '/anggaran/transaksi/realisasi-ppa',
    page: RealisasiPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/realisasi-ppa/approved',
    page: ApprovedPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/realisasi-ppa/detail/:id',
    page: DetailRealisasiPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/realisasi-ppa/tambah/:id',
    page: TambahRealisasiPPA,
    hak: ['ANG']
  },
  {
    exact: true,
    path: '/anggaran/transaksi/realisasi-ppa/ubah/:id',
    page: UbahRealisasiPPA,
    hak: ['ANG']
  },
]

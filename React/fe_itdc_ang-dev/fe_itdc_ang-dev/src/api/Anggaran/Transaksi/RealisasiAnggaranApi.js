import Services from "services"

class KegiatanAnggaranApi {
  getRealisasi(page, dataLength) {
    return Services.get(`/kegiatan/page/?page=${page}&per_page=${dataLength}&kode_status=APP&is_close=true`)
  }

  getListKegiatanRealisasi(page, dataLength) {
    return Services.get(`/kegiatan/page/?page=${page}&per_page=${dataLength}&kode_status=APP&is_close=false`)
  }
  
  getKegiatanRealisasi(id) {
    return Services.get("/kegiatan_realisasi/form?id_kegiatan=" + id);
  }

  getNomorRealisasi(value) {
    return Services.get("/kegiatan_realisasi/no_baru?tanggal=" + value)
  }

  changeStatusOpen(value) {
    return Services.put("/kegiatan/open", value)
  }

  changeStatusClose(value) {
    return Services.put("/kegiatan/close", value)
  }

  createKegiatanRealisasi(value) {
    return Services.post("/kegiatan_realisasi", value)
  }

  updateRealisasiWaktu(value) {
    return Services.post("/kegiatan_realisasi/waktu", value)
  }

  uploadBukti(value) {
    return Services.post("/upload/bukti", value)
  }

  deleteKegiatanSumberDayaRealisasi(id) {
    return Services.post("/kegiatan_realisasi/delete", id)
  }
}

export default new KegiatanAnggaranApi()

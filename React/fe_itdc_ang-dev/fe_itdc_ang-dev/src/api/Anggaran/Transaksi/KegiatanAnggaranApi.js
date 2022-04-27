import Services from "services";

class KegiatanAnggaranApi {
  get() {
    return Services.get("/kegiatan");
  }

  getSingle(params) {
    return Services.get("/kegiatan/single", {params});
  }

  getPage(page, dataLength, key) {
    return Services.get(`/kegiatan/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  getKode(value) {
    return Services.get("/kegiatan/no_baru?tanggal=" + value);
  }

  getKaryawan() {
    return Services.get("/karyawan");
  }

  getCOA() {
    return Services.get("/karyawan");
  }

  getJenisAnggaran(params) {
    return Services.get('/jenis_anggaran', {params})
  }
  
  getKelompokAnggaran(params) {
    return Services.get('/kelompok_anggaran', {params})
  }

  getSubKelompokAnggaran(params) {
    return Services.get('/sub_kelompok_anggaran', {params})
  }

  create(value) {
    return Services.post("/kegiatan/form", value);
  }
  update(value) {
    return Services.post("/kegiatan/form", value);
  }
  delete(id) {
    return Services.post("/kegiatan/delete", id);
  }
}

export default new KegiatanAnggaranApi();

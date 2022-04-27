import Services from "services";

class KelompokAnggaranAPi {
  get() {
    return Services.get("/kelompok_anggaran");
  }

  getPage(page, dataLength, key) {
    return Services.get(`/kelompok_anggaran/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  getKode() {
    return Services.get("/kelompok_anggaran/no_baru");
  }

  show(value) {
    return Services.put("/kelompok_anggaran/show", value);
  }

  hide(value) {
    return Services.put("/kelompok_anggaran/hide", value);
  }

  create(value) {
    return Services.post("/kelompok_anggaran", value);
  }

  update(value) {
    return Services.put("/kelompok_anggaran", value);
  }

  delete(value) {
    return Services.post("/kelompok_anggaran/delete", value);
  }
}

export default new KelompokAnggaranAPi();

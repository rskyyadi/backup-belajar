import Services from "services";

class JenisAnggaranAPi {
  get() {
    return Services.get("/jenis_anggaran");
  }

  getPage(page, dataLength, key) {
    return Services.get(`/jenis_anggaran/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  getKode() {
    return Services.get("/jenis_anggaran/no_baru");
  }

  show(value) {
    return Services.put("/jenis_anggaran/show", value);
  }

  hide(value) {
    return Services.put("/jenis_anggaran/hide", value);
  }

  create(value) {
    return Services.post("/jenis_anggaran", value);
  }

  update(value) {
    return Services.put("/jenis_anggaran", value);
  }

  delete(value) {
    return Services.post("/jenis_anggaran/delete", value);
  }
}

export default new JenisAnggaranAPi();

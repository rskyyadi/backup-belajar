import Services from "services";

class SubkelompokAnggaranAPi {
  get() {
    return Services.get("/sub_kelompok_anggaran");
  }

  getPage(page, dataLength, key) {
    return Services.get(`/sub_kelompok_anggaran/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  getKode() {
    return Services.get("/sub_kelompok_anggaran/no_baru");
  }

  show(value) {
    return Services.put("/sub_kelompok_anggaran/show", value);
  }

  hide(value) {
    return Services.put("/sub_kelompok_anggaran/hide", value);
  }

  create(value) {
    return Services.post("/sub_kelompok_anggaran", value);
  }

  update(value) {
    return Services.put("/sub_kelompok_anggaran", value);
  }

  delete(value) {
    return Services.post("/sub_kelompok_anggaran/delete", value);
  }
}

export default new SubkelompokAnggaranAPi();

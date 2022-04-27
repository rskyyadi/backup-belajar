import Services from "services";

class KategoriAnggaranAPi {
  get() {
    return Services.get("/kategori_sumber_daya");
  }

  getPage(page, dataLength, key) {
    return Services.get(`/kategori_sumber_daya/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  show(value) {
    return Services.put("/kategori_sumber_daya/show", value);
  }

  hide(value) {
    return Services.put("/kategori_sumber_daya/hide", value);
  }

  create(value) {
    return Services.post("/kategori_sumber_daya", value);
  }

  update(value) {
    return Services.put("/kategori_sumber_daya", value);
  }

  delete(value) {
    return Services.post("/kategori_sumber_daya/delete", value);
  }
}

export default new KategoriAnggaranAPi();

import Services from "services"

class RealisasiPPAApi {
  getPage(params) {
    return Services.get("/ppa_realisasi/page", {params})
  }

  getKode(date) {
    return Services.get("/ppa_realisasi/no_baru", {
      params: {
        tanggal: date
      }
    })
  }

  uploadBukti(value) {
    return Services.post("/upload/bukti", value)
  }

  createOrUpdate(values) {
    return Services.post("/ppa_realisasi", values)
  }

  delete(data) {
    return Services.post("/ppa/delete", data)
  }
}

export default new RealisasiPPAApi()

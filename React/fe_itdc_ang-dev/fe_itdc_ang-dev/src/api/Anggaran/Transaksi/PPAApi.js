import Services from "services"

class PPAApi {
  getPage(params) {
    return Services.get("/ppa/page", {params: params})
  }

  getKode(date) {
    return Services.get("/ppa/no_baru", {
      params: {
        tanggal: date
      }
    })
  }

  getDetail(params) {
    return Services.get("/ppa_realisasi/single", {params})
  }

  getSumberDaya(params) {
    return Services.get("/ppa/sumber_daya", {params})
  }

  createOrUpdate(values) {
    return Services.post("/ppa", values)
  }
}

export default new PPAApi()

import Services from "services";

class ProgramAnggaranApi {
  get() {
    return Services.get("/program");
  }

  getSingle(id) {
    return Services.get("/program/single/?id_program=" + id);
  }

  getPage(page, dataLength, key) {
    return Services.get(`/program/page/?per_page=${dataLength}&page=${page}&q=${key}`);
  }

  getNomor(params) {
    return Services.get("/program/no_baru", {params})
  }

  getDropdownUnitOrganisasi(params) {
    return Services.get("/unit_organisasi", {params})
  }

  getDropdownKaryawan(params) {
    return Services.get("/karyawan", {params})
  }

  checkNama(params) {
    return Services.get("/program/nama_program_cek", {params})
  }


  create(value) {
    return Services.post("/program", value);
  }

  update(value) {
    return Services.put("/program", value);
  }

  delete(value) {
    return Services.post("/program/delete", value);
  }
}

export default new ProgramAnggaranApi();

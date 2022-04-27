import Services from "services";

class UnitOrganisasiAnggaranApi {
  get() {
    return Services.get("/unit_organisasi");
  }
  create(value) {
    return Services.post("/unit_organisasi", value);
  }

  update(value) {
    return Services.put("/unit_organisasi", value);
  }
}

export default new UnitOrganisasiAnggaranApi();

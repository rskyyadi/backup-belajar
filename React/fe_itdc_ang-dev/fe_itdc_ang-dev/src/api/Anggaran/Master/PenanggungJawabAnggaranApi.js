import Services from "services";

class PenanggungJawabAnggaranApi {
  get() {
    return Services.get("/jabatan");
  }
  create(value) {
    return Services.post("/jabatan", value);
  }

  update(value) {
    return Services.put("/jabatan", value);
  }
}

export default new PenanggungJawabAnggaranApi();

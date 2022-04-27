import Services from "services";

class COAApi {
  get() {
    return Services.get("/coa");
  }
}

export default new COAApi();

import Services from "services";

class KegiatanAnggaranApi {
  get() {
    return Services.get("/kegiatan");
  }
  
  getSingleKegiatan({params}) {
    return Services.get("/kegiatan/single", {params});
  }

  getNomor({params}) {
    return Services.get("/sub_kegiatan/nomor", {params});
  }
}

export default new KegiatanAnggaranApi();

import { CategoryXSupplyRep } from "../repositories/CategoryXSupply.repository.js";

export class RemoveCategoryXSupplySrv {

  constructor() {
    this.CategoryXSupplyRep = new CategoryXSupplyRep();
  }

  exe = async (dto) => {
    try {
      const { cxs_id } = dto;

      if (!cxs_id || cxs_id <= 0)
        throw { statusCode: 400, message: "Invalid cxs_id", errCode: "" };

      const exist = await this.CategoryXSupplyRep.findByID({ cxs_id });

      if (!exist)
        throw {
          statusCode: 404,
          message: `CategoryXSupply w/ ID ${cxs_id} does not exist`,
          errCode: "",
        };

      await this.CategoryXSupplyRep.remove({ cxs_id });

      return { removed: true };

    } catch (err) {
      console.log("ERR:", err);
      throw err;
    }
  };
}

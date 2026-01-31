import { ECategoryXSupply } from "../Entity/CategoryXSupply.entity.js";
import { CategoryXSupplyRep } from "../repositories/CategoryXSupply.repository.js";

export class UpdateCategoryXSupplyQuantitySrv {

  constructor() {
    this.ECategoryXSupply = ECategoryXSupply;
    this.CategoryXSupplyRep = new CategoryXSupplyRep();
  }

  exe = async (dto) => {
    try {
      const { cxs_id, cxs_quantity } = dto;

      if (!cxs_id || cxs_id <= 0)
        throw { statusCode: 400, message: "Invalid cxs_id", errCode: "" };

      const eCXS = new this.ECategoryXSupply({ cxs_quantity });

      eCXS.validateQuantity();

      const exist = await this.CategoryXSupplyRep.findByID({ cxs_id });

      if (!exist)
        throw {
          statusCode: 404,
          message: `CategoryXSupply w/ ID ${cxs_id} does not exist`,
          errCode: "",
        };

      await this.CategoryXSupplyRep.updateQuantity({ cxs_id, cxs_quantity });

      return { updated: true };

    } catch (err) {
      throw err;
    }
  };
}

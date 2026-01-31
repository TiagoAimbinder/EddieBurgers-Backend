

import { ECategoryXSupply } from "../Entity/CategoryXSupply.entity.js";
import { CategoryXSupplyRep } from "../repositories/CategoryXSupply.repository.js";

export class CreateCategoryXSupplySrv {

  constructor() {
    this.ECategoryXSupply = ECategoryXSupply;
    this.CategoryXSupplyRep = new CategoryXSupplyRep();
  }

  exe = async (dto) => {
    try {
      const { cat_id, sup_id, cxs_quantity } = dto;

      const eCXS = new this.ECategoryXSupply({ cat_id, sup_id, cxs_quantity });

      // Validar
      eCXS.validateIDs();
      eCXS.validateQuantity();

      const exist = await this.CategoryXSupplyRep.findByCategoryAndSupply({ cat_id, sup_id });

      if (exist)
        throw {
          statusCode: 400,
          message: `Supply ${sup_id} is already linked with Category ${cat_id}`,
          errCode: "",
        };

      const created = await this.CategoryXSupplyRep.create(eCXS.dto);

      return created;

    } catch (err) {
      console.log("ERR:", err);
      throw err;
    }
  };
}

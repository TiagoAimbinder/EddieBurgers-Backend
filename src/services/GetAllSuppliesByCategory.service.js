import { CategoryXSupplyRep } from "../repositories/CategoryXSupply.repository.js";

export class GetAllSuppliesByCategorySrv {

  constructor() {
    this.CategoryXSupplyRep = new CategoryXSupplyRep();
  }

  exe = async (dto) => {
    try {
      const { cat_id } = dto;

      if (!cat_id || cat_id <= 0)
        throw { statusCode: 400, message: "Invalid cat_id", errCode: "" };

      const data = await this.CategoryXSupplyRep.findAllByCategory({ cat_id });

      if (!data || data.length === 0)
        return [];

      return data;

    } catch (err) {
      throw err;
    }
  };
}

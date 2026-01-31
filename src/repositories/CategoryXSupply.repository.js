import { Database } from "../config/db.js";

export class CategoryXSupplyRep {

  constructor() {}

  get models() { return Database.models }
  get sequelize() { return Database.sequelize }

  create = async ({ sup_id, cat_id, cxs_quantity }, t = null) => {
    const created = await this.models.CategoryXSupply.create(
      { sup_id, cat_id, cxs_quantity },
      { transaction: t }
    );
    return created.dataValues;
  }

  // AGREGAR ESTO EN: src/repositories/CategoryXSupply.repository.js

  findByCategoryAndSupply = async ({ cat_id, sup_id }, t = null) => {
    const found = await this.models.CategoryXSupply.findOne({
      where: { 
          cat_id: cat_id, 
          sup_id: sup_id 
      },
      transaction: t
    });

    return found ? found.dataValues : null;
  }

  findByID = async ({ cxs_id }, t = null) => {
    const found = await this.models.CategoryXSupply.findOne({
      where: { cxs_id },
      transaction: t
    });

    return found ? found.dataValues : null;
  }


  findAllByCategory = async ({ cat_id }, t = null) => {
    const found = await this.models.CategoryXSupply.findAll({
      where: { cat_id },
      transaction: t
    });

    return found ? found.map(v => v.dataValues) : [];
  }

  findAllBySupply = async ({ sup_id }, t = null) => {
    const found = await this.models.CategoryXSupply.findAll({
      where: { sup_id },
      transaction: t
    });
    return found ? found.map(v => v.dataValues) : [];
  }

  updateQuantity = async ({ cxs_id, cxs_quantity }, t = null) => {
    const updated = await this.models.CategoryXSupply.update(
      { cxs_quantity },
      { where: { cxs_id }, transaction: t }
    );

    return updated;
  }

  remove = async ({ cxs_id }, t = null) => {
    const removed = await this.models.CategoryXSupply.destroy({
      where: { cxs_id },
      transaction: t
    });

    return removed; 
  }
}

export class ECategoryXSupply {

  constructor({ cat_id, sup_id, cxs_quantity }) {
    this.cat_id = cat_id;
    this.sup_id = sup_id;
    this.cxs_quantity = cxs_quantity;
  }

  validateIDs() {
    if (!this.cat_id || this.cat_id <= 0)
      throw { statusCode: 400, message: "Invalid cat_id", errCode: "" };

    if (!this.sup_id || this.sup_id <= 0)
      throw { statusCode: 400, message: "Invalid sup_id", errCode: "" };
  }

  validateQuantity() {
    if (!this.cxs_quantity || this.cxs_quantity <= 0)
      throw { statusCode: 400, message: "Quantity must be > 0", errCode: "" };
  }

  get dto() {
    return {
      cat_id: this.cat_id,
      sup_id: this.sup_id,
      cxs_quantity: this.cxs_quantity
    };
  }
}

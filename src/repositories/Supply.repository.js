import { Database } from "../config/db.js";


export class SupplyRep {

  constructor() {
  }

  get models() { return Database.models }
  get sequelize() { return Database.sequelize }

  create = async ({ sup_name, sup_price }, t = null) => {
    const created = await this.models.Supply.create({ sup_name, sup_price }, { transaction: t });
    return created.dataValues; 
  };

  findByName = async ({ sup_name }, t = null) => {
    const found = await this.models.Supply.findOne({
      where: this.sequelize.where(
        this.sequelize.fn("LOWER", this.sequelize.col("sup_name")),
        sup_name
      ),
      transaction: t
    });

    return found ? found.dataValues : null;   
  }

  findByID = async ({ sup_id }, t = null ) => {
    const found = await this.models.Supply.findOne({ where: { sup_id }, transaction: t})
    return found ? found.dataValues : null; 
  }

  findAllActive = async (t = null) => {
    const found = await this.models.Supply.findAll({ where: { isActive: true }, transaction: t });
    return found ? found.map((val) => val.dataValues) : null; 
  }

  // Agrega esto dentro de la clase SupplyRep:

update = async ({ sup_id, sup_name, sup_price, isActive }, t = null) => {
    
    // Preparamos los datos a actualizar
    const dataToUpdate = { sup_name, sup_price };
    
    // Solo si mandamos isActive, lo agregamos al objeto (para reactivar)
    if (isActive !== undefined) {
        dataToUpdate.isActive = isActive;
    }

    const updated = await this.models.Supply.update(
      dataToUpdate,
      { where: { sup_id }, transaction: t }
    );
    return updated;
  };

  remove = async ({ sup_id }, t = null) => {
    const removed = await this.models.Supply.update(
      { isActive: false }, 
      { where: { sup_id }, transaction: t }
    );

    return removed;
  } 

} 
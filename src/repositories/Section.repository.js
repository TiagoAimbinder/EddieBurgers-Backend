import { Database } from "../config/db.js";

export class SectionRep { 

    get models() { return Database.models }

    create = async ({ sec_name }, transaction = null) => {
        return await this.models.Section.create({ sec_name }, { transaction });
    }

    getAll = async (transaction = null) => {
        // Incluimos las categorías dentro de cada sección para que el front lo tenga fácil
        // Ej: Sección Bebidas -> [Coca Cola, Sprite]
        return await this.models.Section.findAll({ 
            include: [{
                model: this.models.Category,
                as: 'categories'
            }],
            transaction 
        });
    }

    findByID = async (sec_id, transaction = null) => {
        return await this.models.Section.findByPk(sec_id, { transaction });
    }

    // Actualizar Sección
  update = async ({ sec_id, sec_name }, t = null) => {
    const updated = await this.models.Section.update(
      { sec_name },
      { where: { sec_id }, transaction: t }
    );
    return updated;
  };

  // Eliminar Sección
  delete = async (sec_id, t = null) => {
    const deleted = await this.models.Section.destroy({
      where: { sec_id },
      transaction: t
    });
    return deleted;
  };
}
import { Database } from '../config/db.js'
import { CategoryRep } from '../repositories/Category.repository.js';
import { UserRep } from '../repositories/User.repository.js';
// Borramos el import de CategoryXSupplyModel porque ya usamos this.models

export class CategorySrv {

  constructor() {
    this.CategoryRep = new CategoryRep();
    this.UserRep = new UserRep();
  }

  get sequelize() { return Database.sequelize }
  get models() { return Database.models }

  /**
   * Crea una categoría, la asigna a una sección y guarda sus insumos.
   */
  create = async (usu_id, cat_name, sec_id, cat_profit_percent, suppliesList = []) =>  {

    const transaction = await this.sequelize.transaction();

    try {
      // 1. Validar Usuario
      const user = await this.UserRep.findByID(usu_id, transaction);
      if (!user) throw { statusCode: 404, message: 'El usuario no existe' }

      // 2. Validar que la Sección exista
      const section = await this.models.Section.findByPk(sec_id, { transaction });
      if (!section) throw { statusCode: 404, message: 'La sección indicada no existe' };

      // 3. Validar Nombre duplicado
      const catByName = await this.CategoryRep.findByName(cat_name, transaction);
      if (catByName) throw { statusCode: 400, message: 'Ya existe una categoría con ese nombre' };

      // 4. CREAR LA CATEGORÍA
      const newCategory = await this.CategoryRep.create({ 
          cat_name, 
          sec_id, 
          cat_profit_percent: cat_profit_percent || 30 
      }, transaction);

      // 5. GUARDAR LOS INSUMOS (Si hay lista)
      if (suppliesList && suppliesList.length > 0) {
          const ingredientsData = suppliesList.map(item => ({
              cat_id: newCategory.cat_id,
              sup_id: item.sup_id,
              cxs_quantity: item.quantity || 1 
          }));

          await this.models.CategoryXSupply.bulkCreate(ingredientsData, { transaction });
      }

      await transaction.commit();
      return newCategory;
    }
    catch (err) {
      await transaction.rollback()
      throw err; 
    }
  }; 

  // --- ELIMINÉ EL "};" QUE ESTABA AQUÍ CORTANDO LA CLASE ---

  update = async (data) => {

    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.UserRep.findByID(data.usu_id, transaction);
      if (!user) throw { statusCode: 404, message: 'El usuario no existe', code: '' }

      const category = await this.CategoryRep.findByID(data.cat_id, transaction);
      if (!category) throw { message: 'La categoría no existe', statusCode: 404, code: '' }

      const cat_profit_percent = (data.cat_profit_percent === null || data.cat_profit_percent === undefined) 
                                 ? category.cat_profit_percent 
                                 : data.cat_profit_percent;

      const cat = { 
          cat_id: data.cat_id, 
          cat_name: data.cat_name, 
          cat_profit_percent: cat_profit_percent 
      };

      await this.CategoryRep.update(cat, transaction); 

      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback()
      throw err
    }
  };

  getAll = async (usu_id) => { 
    try {
      const user = await this.UserRep.findByID(usu_id);
      if (!user) throw { statusCode: 404, message: 'El usuario no existe', code: '' }

      const categories = await this.CategoryRep.getAll();
      if (!categories || categories.length === 0 ) throw { statusCode: 404, message: 'No se encontraron categorías', code: '' }
      return categories; 
    } catch (err) {
      throw err; 
    }
  }

  deleteCategory = async (usu_id, cat_id) => {

    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.UserRep.findByID(usu_id, transaction); 
      if (!user) throw { statusCode: 404, message: 'El usuario no existe', code: '' }

      const category = await this.CategoryRep.findByID(cat_id, transaction);
      if (!category) throw { statusCode: 404, message: 'La categoría no existe', code: '' }; 

      await this.CategoryRep.delete(cat_id, transaction);
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err
    }
  };
};
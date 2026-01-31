import { CategorySrv } from '../services/Category.service.js';

export class CategoryController {

  constructor() {
    this.CategorySrv = new CategorySrv()
  }; 
  
  /**
  * REFACTORIZED: 
  * - ✅ | Create category 
  * - ✅ | Update category 
  * - ✅ | Get all categories 
  * - ✅ | Delete category 
  */

createCategory = async (req, res) => {
    // Ahora esperamos sec_id y supplies (array) en el body
    const { usu_id, cat_name, sec_id, cat_profit_percent, supplies } = req.body; 

    try {
      // Pasamos todos los argumentos al servicio
      await this.CategorySrv.create(usu_id, cat_name, sec_id, cat_profit_percent, supplies); 
      
      res.status(201).json({ message: 'Categoría creada con sus insumos correctamente.', success: true });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al crear la categoría.', success: false });
    }
  };

  updateCategory = async (req, res) => {
    const { cat_name, cat_profit_percent } = req.body;
    const { cat_id, usu_id } = req.params

    try {
      const data = { cat_id, usu_id, cat_name,cat_profit_percent }; 
      await this.CategorySrv.update(data);
      res.status(200).json({ message: 'Categoría actualizada correctamente', success: true, code: '' });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al actualizar la categoría', success: false, code: '' })
    }
  }

  getAllCategories = async (req, res) => {
    const { usu_id } = req.params

    try {
      const categories = await this.CategorySrv.getAll(usu_id);
      res.status(200).json({ message: 'Categorías obtenidas correctamente', success: true, code: '', categories: categories })
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener las categorías', success: false, code: '' })
    }
  }

  deleteCategory = async (req, res) => {
    const { usu_id, cat_id } = req.params;

    try {
      await this.CategorySrv.deleteCategory(usu_id, cat_id);
      res.status(200).json({ message: 'Categoría eliminada correctamente', success: true, code: '' });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al eliminar la categoría', success: false, code: '' })
    }
  }
}; 
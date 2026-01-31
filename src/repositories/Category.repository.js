import { col, fn, where } from "sequelize";
import { Database } from "../config/db.js"

export class CategoryRep { 

    get models() { return Database.models }

    // ✅ CORREGIDO: Ahora extraemos todo lo necesario
    create = async (data, transaction = null) => {
        const { cat_name, sec_id, cat_profit_percent } = data; 
        
        return await this.models.Category.create({ 
            cat_name, 
            sec_id, 
            cat_profit_percent 
        }, { transaction })
    }

    // Asegúrate de actualizar también el update si quieres permitir cambiar de sección a futuro
    update = async (cat, transaction) => {
        const { cat_id, cat_name, sec_id, cat_profit_percent } = cat; 
        
        return await this.models.Category.update({ 
            cat_name, 
            sec_id, 
            cat_profit_percent 
        }, { where: { cat_id }, transaction });
    }

    findByName = async (cat_name, transaction = null) => { 
        return await this.models.Category.findOne({ where: where(fn('LOWER', col('cat_name')), cat_name.toLowerCase().trim()), transaction });
    }

    findByID = async (cat_id, transaction = null) => {
        const category = await this.models.Category.findOne({ where: { cat_id }, transaction }); 
        return category ? category.dataValues : null; 
    }

    getAll = async (transaction = null) => {
        const categories = await this.models.Category.findAll({transaction});
        return categories.map(category => category.dataValues);
    }

    delete = async (cat_id, transaction = null) => {
        return await this.models.Category.destroy({ where: { cat_id: cat_id }, transaction });
    }
}

import { Database } from "../config/db.js";


export class ManangementWeekRep {


  constructor() {

  }

  get models() { return Database.models }


  create = async (movement, transaction = null) => {
    const { hw_date, hw_amount, hw_description, hw_type, usu_id, cur_id } = movement; 
    await this.models.ManangementWeek.create({ hw_date, hw_amount, hw_description, hw_type, usu_id, cur_id, hw_status: true,
    }, { transaction })
  }

  update = async (hw_id, updatedFields, transaction = null) => {
    await this.models.ManangementWeek.update(updatedFields, { where: { hw_id }, transaction });
  }

  getAll = async (transaction = null) => {
    const movements = await this.models.ManangementWeek.findAll({ where: { hw_status: true }, transaction }); 
    return movements ? movements.map((movement) => movement.dataValues) : null; 
  }; 

  deleteByID = async (hw_id, transaction = null) => {
    await this.models.ManangementWeek.update( { hw_status: false }, { where: { hw_id }, transaction })
  }; 

  findByID = async (hw_id, transaction = null) => {
    const movement = await this.models.ManangementWeek.findByPk(hw_id, { transaction });
    return movement ? movement.dataValues : null;
  };  

  
  deleteAll = async (transaction = null) => {
    await this.models.ManangementWeek.destroy({ where: {  }, transaction })
  }
}
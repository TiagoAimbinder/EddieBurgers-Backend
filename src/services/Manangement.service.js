

import { ManangementRep } from '../repositories/Manangement.repository.js';



export class ManangementService {

  constructor() {
    this.ManangementRep = new ManangementRep();
  }

  create = async (movement) => {
    const { his_amount } = movement;
    try {
      if (!Number.isFinite(his_amount) || his_amount <= 0) throw { message: "Monto debe ser un número positivo", statusCode: 400 };
      await this.ManangementRep.create(movement)
    } catch (err) {
      throw err
    }
  };

getAll = async () => {
    try {
      return await this.ManangementRep.getAll();
    } catch (err) {
      throw err; 
    }
  }; 

  delete = async (his_id) => { 
    try {
      await this.ManangementRep.delete(his_id);
    } catch (err) {
      throw err; 
    }
  }

  update = async (data) => {

    const { his_id, his_amount, his_description, his_type, cur_id, usu_id } = data;
    const toUpdate = { his_amount, his_description, his_type, cur_id }

    try {

      /**
       * Update only not nulls values
       */
      const updatedFields = {};
      const fieldsToUpdate = ['his_amount', 'his_description', 'his_type', 'cur_id'];
      fieldsToUpdate.forEach(field => {
          if (toUpdate[field] !== null && toUpdate[field] !== undefined) {
              updatedFields[field] = toUpdate[field];
          }
      });

      /**
       * Void object
       */
      if (Object.keys(updatedFields).length === 0) throw { message: 'No se proporcionaron datos para actualizar.' , statusCode: 400, code: '' }


      const his = await this.ManangementRep.findByID(his_id);
      if (!his) throw { message: 'El movimiento no existe.', statusCode: 404, code: ''}


      /**
       * Only creator of movement can update it. 
       */
      if (Number(usu_id) !== his.usu_id) throw { message: 'No tiene permisos para actualizar este movimiento. Solo el creador del movimiento puede modificarlo.', statusCode: 403, code: ''} 
      await this.ManangementRep.update(his_id, updatedFields);
    } catch (err) {
      throw err; 
    }
  }
}
import { Database } from "../config/db.js";
import { ManangementWeekRep } from "../repositories/ManangementWeek.repository.js";
import { UserRep } from "../repositories/User.repository.js";
import { ManangementRep } from "../repositories/Manangement.repository.js";


export class ManangementWeekService {

  constructor() {
    this.ManangementWeekRep = new ManangementWeekRep();
    this.ManangementRep = new ManangementRep();
    this.UserRep = new UserRep();
  }

  get sequelize() { return Database.sequelize }

    create  = async (movement) => {
      const { hw_amount } = movement;
      try {
        if (!Number.isFinite(hw_amount) || hw_amount <= 0) throw { message: "Monto debe ser un número positivo", statusCode: 400 };
        await this.ManangementWeekRep.create(movement);
      } 
      catch (err) {
        throw err; 
      }
    }

    getAll = async () => {
      try {
        const movements = await this.ManangementWeekRep.getAll();
        if (!movements) throw { message: "No existen movimientos.", statusCode: 404 }; 
        return movements;
      } catch (err) {
        throw err; 
      }
    }; 

    delete = async (hw_id) => {
      try {
        await this.ManangementWeekRep.deleteByID(hw_id);
      } catch (err) {
        throw err
      }
    } 

    update = async (hw_id, usu_id, updatedFields) => {
      const { hw_amount, hw_description, hw_type, cur_id } = updatedFields

      try {
        const toUpdate = { hw_amount, hw_description, hw_type, cur_id }
  
        const updatedFields = {};
        const fieldsToUpdate = ['hw_amount', 'hw_description', 'hw_type', 'cur_id'];
        fieldsToUpdate.forEach(field => { 
          if (toUpdate[field] !== null && toUpdate[field] !== undefined) {
            updatedFields[field] = toUpdate[field];
          }
        });
  
        if (Object.keys(updatedFields).length === 0) throw { message: 'No se proporcionaron datos para actualizar.' , statusCode: 400, code: '' }

        const hw = await this.ManangementWeekRep.findByID(hw_id);
        if (!hw) throw { message: 'El movimiento no existe.', statusCode: 404, code: ''}

  
        if (Number(usu_id) !== hw.usu_id) throw { message: 'No tiene permisos para actualizar este movimiento. Solo el creador del movimiento puede modificarlo.', statusCode: 403, code: ''} 

        await this.ManangementWeekRep.update(hw_id, updatedFields);
      }
      catch (err) {
        throw err
      } 
    }

goToGeneral = async (usu_id) => {
    const transaction = await this.sequelize.transaction();
    
    try {
      // 1. Validaciones de Usuario
      const user = await this.UserRep.findByID(usu_id, transaction)
      if (!user) throw { message: 'El usuario no existe.', statusCode: 404, code: '' }
      
      // Nota: Asegúrate de que este ID 5 es correcto para tu lógica de admin
      if (Number(usu_id) !== 5) throw { message: 'No tiene permisos para realizar esta accion', statusCode: 403, code: ''};

      // 2. Obtener gastos semanales
      const tempExpenses = await this.ManangementWeekRep.getAll(transaction);
  
      // BLINDAJE: Si no hay gastos, cancelamos operación sin error
      if (!tempExpenses || tempExpenses.length === 0) {
          await transaction.commit(); // Cerramos transacción limpia
          return { message: "No había datos para migrar." };
      }

      // 3. Mapear datos
      const generalExpensesData = tempExpenses.map(expense => ({
        his_amount: expense.hw_amount,
        his_description: expense.hw_description,
        his_type: expense.hw_type,
        his_date: expense.hw_date,
        his_status: expense.hw_status, // Asegúrate de que el historial general acepte booleanos o 1/0
        usu_id: expense.usu_id,
        cur_id: expense.cur_id,
      }));

      // 4. Insertar en Historial General
      // CORRECCIÓN: Usamos 'insertData' que es como lo llamaste en tu Repo
      await this.ManangementRep.insertData(generalExpensesData, transaction); 

      // 5. Borrar tabla semanal
      await this.ManangementWeekRep.deleteAll(transaction);
      
      await transaction.commit();
      return { message: "Migración exitosa" };

    } catch (error) { // Usamos 'error' consistentemente
      console.error("Error en migración:", error); // Log para ver el error real
      await transaction.rollback();
      throw error; // Lanzamos 'error', no 'err'
    }
  };
  
};
  


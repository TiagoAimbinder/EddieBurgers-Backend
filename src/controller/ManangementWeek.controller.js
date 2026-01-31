import { ManangementWeekService } from "../services/ManangementWeek.service.js";

  export class ManangementWeekController {


    constructor() {
      this.ManangementWeekSrv = new ManangementWeekService();
    }

    create = async (req, res) => {
      const { hw_amount, hw_description, hw_type, usu_id, cur_id, hw_date} = req.body;
      const movement = { hw_amount, hw_description, hw_type, usu_id, cur_id, hw_date };

      try {
        await this.ManangementWeekSrv.create(movement);
        res.status(200).json({ message: "Movimiento creado correctamente", success: true, code: '' }); 
      } catch (err) {
        res.status(err.statusCode || 500).json({ message: "Error al crear el movimiento", success: false, code: err.code || '' }); 
      }
    }

    getAll = async (req, res) => {
      try {
        const manangement = await this.ManangementWeekSrv.getAll();
        res.status(200).json({ message: "Movimientos obtenidos correctamente", success: true, code: '', manangement: manangement })
      } catch (err) {
        res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener todos los movimientos semanales', code: err.code || '', success: false})
      }

    };
  
    deleteMovement = async (req, res) => {
      const { id } = req.params;
      try {
        await this.ManangementWeekSrv.delete(id);
        res.status(200).json({ message: "Movimiento eliminado correctamente", success: true, code: '' });
      } catch (error) {
        res.status(err.statusCode || 500).json({ message: "Error al eliminar el movimiento", success: false, code: err.code || '' });
      }
    };
  
    updateMovement = async (req, res) => {
  
      const { hw_id, usu_id } = req.params; 
      const { hw_amount, hw_description, hw_type, cur_id } = req.body; 
      const movement = { hw_amount, hw_description, hw_type, cur_id }
      try {
        await this.ManangementWeekSrv.update(hw_id, usu_id, movement);
        res.status(200).json({ message: "Movimiento actualizado correctamente", success: true, code: '' })
      } catch (err) {
        res.status(err.statusCode || 500).json({ message: "Error al actualizar el movimiento", success: false, code: err.code || '' });
      }
    }

    goToGeneral = async (req,res) => {
      const { usu_id } = req.params;
      try {
        await this.ManangementWeekSrv.goToGeneral(usu_id);
        res.status(200).json({ message: "Registros migrados al general", success: true, code: ''});
      } catch (err) {
        res.status(err.statusCode || 500).json({ message: "Error al migrar los registros", success: false, code: err.code || '' })
      }
    }
  }; 
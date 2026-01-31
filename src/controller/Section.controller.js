import { SectionSrv } from '../services/Section.service.js';

export class SectionController {

  constructor() {
    this.SectionSrv = new SectionSrv();
  }; 

  create = async (req, res) => {
    const { sec_name } = req.body; 

    try {
      await this.SectionSrv.create(sec_name); 
      res.status(201).json({ message: 'Sección creada correctamente.', success: true });
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al crear la sección.', success: false });
    }
  };

  getAll = async (req, res) => {
    try {
      const sections = await this.SectionSrv.getAll();
      res.status(200).json({ message: 'Secciones obtenidas correctamente', success: true, data: sections })
    } catch (err) {
      res.status(err.statusCode || 500).json({ message: err.message || 'Error al obtener las secciones', success: false })
    }
  }

  // EDITAR (CORREGIDO)
  update = async (req, res) => {
    try {
      const { sec_id } = req.params;
      const { sec_name } = req.body;
      
      // USAMOS EL SERVICIO, NO EL REPO DIRECTO
      await this.SectionSrv.update({ sec_id, sec_name }); 

      res.status(200).json({ success: true, message: 'Sección actualizada' });
    } catch (err) {
      console.log(err); // Para ver el error en consola si falla
      res.status(err.statusCode || 500).json({ success: false, message: 'Error al actualizar' });
    }
  };

  // ELIMINAR (CORREGIDO)
  delete = async (req, res) => {
    try {
      const { sec_id } = req.params;
      
      // USAMOS EL SERVICIO
      await this.SectionSrv.delete(sec_id);

      res.status(200).json({ success: true, message: 'Sección eliminada' });
    } catch (err) {
      console.log(err);
      res.status(err.statusCode || 500).json({ success: false, message: 'Error al eliminar' });
    }
  };
};
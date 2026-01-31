import { SectionRep } from '../repositories/Section.repository.js';

export class SectionSrv {

  constructor() {
    this.SectionRep = new SectionRep();
  }

  create = async (sec_name) => {
    try {
        if (!sec_name) throw { statusCode: 400, message: 'El nombre de la sección es obligatorio' };
        const section = await this.SectionRep.create({ sec_name });
        return section;
    } catch (err) {
        throw err;
    }
  }

  getAll = async () => {
    try {
      const sections = await this.SectionRep.getAll();
      if (!sections || sections.length === 0) return []; 
      return sections;
    } catch (err) {
      throw err;
    }
  }

  // --- AGREGAR ESTO ---
  update = async ({ sec_id, sec_name }) => {
    try {
        // Podrías validar aquí si el nombre viene vacío
        if (!sec_name) throw { statusCode: 400, message: 'El nombre es obligatorio' };
        
        const updated = await this.SectionRep.update({ sec_id, sec_name });
        return updated;
    } catch (err) {
        throw err;
    }
  }

  delete = async (sec_id) => {
    try {
        const deleted = await this.SectionRep.delete(sec_id);
        return deleted;
    } catch (err) {
        throw err;
    }
  }
}
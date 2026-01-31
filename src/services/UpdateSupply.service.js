import { SupplyRep } from '../repositories/Supply.repository.js';
import { ESupply } from '../Entity/Supply.entity.js'; // Asegúrate de tener la entidad importada

export class UpdateSupplySrv {
  constructor() {
    this.SupplyRep = new SupplyRep();
    this.ESupply = ESupply;
  }

  exe = async (dto) => {
    try {
      const { sup_id, sup_name, sup_price } = dto;
      
      // Validaciones básicas
      if (!sup_id) throw { statusCode: 400, message: "ID requerido" };

      // Validamos datos usando tu Entidad (opcional, pero recomendado)
      const eS = new this.ESupply({ sup_id, sup_name, sup_price });
      eS.validatePrice();
      eS.validateName();

      // Verificar que exista
      const exists = await this.SupplyRep.findByID({ sup_id });
      if (!exists) throw { statusCode: 404, message: "El insumo no existe" };

      // Actualizar
      await this.SupplyRep.update({ sup_id, sup_name, sup_price });

      return { message: "Insumo actualizado" };
    } catch (err) {
      throw err;
    }
  };
}
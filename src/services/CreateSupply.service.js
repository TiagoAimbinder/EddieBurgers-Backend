import { ESupply } from '../Entity/Supply.entity.js'
import { SupplyRep } from '../repositories/Supply.repository.js';

export class CreateSupplySrv {

  constructor() {
    this.ESupply = ESupply; 
    this.SupplyRep = new SupplyRep(); 
  }

  exe = async (dto) => {
    try {
      const { sup_name, sup_price } = dto; 
      
      // 1. Validaciones de la entidad
      const eS = new this.ESupply({ sup_name, sup_price });
      eS.validatePrice(); 
      eS.validateName();

      // 2. Buscar si ya existe (aunque esté borrado)
      const existByName = await this.SupplyRep.findByName({ sup_name });
      
      if (existByName) {
          // CASO A: Existe y está ACTIVO -> Error real (Duplicado)
          if (existByName.isActive) {
              throw { statusCode: 400, message: `El insumo "${sup_name}" ya existe y está activo.`, errCode: ''}; 
          } 
          
          // CASO B: Existe pero está INACTIVO (Borrado) -> ¡LO REACTIVAMOS!
          else {
              await this.SupplyRep.update({
                  sup_id: existByName.sup_id, // Usamos el ID del viejo
                  sup_name: sup_name,
                  sup_price: sup_price, // Actualizamos al precio nuevo
                  isActive: true // <--- ¡MAGIA! Lo revivimos
              });
              
              return { message: "Insumo recuperado y actualizado exitosamente" };
          }
      }

      // 3. Si no existe de ninguna forma, lo creamos de cero
      const created = await this.SupplyRep.create(eS.dto);
      return created; 

    } catch (err) {
      console.log('ERR: ', err);
      throw err; 
    }
  }

}
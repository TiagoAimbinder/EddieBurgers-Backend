import { ESupply } from "../Entity/Supply.entity.js";
import { SupplyRep } from "../repositories/Supply.repository.js";


export class RemoveSupplySrv {

  constructor() {
    this.SupplyRep = new SupplyRep();
    this.ESupply = ESupply; 
  }

  exe = async (dto) => {
    try {
      const { sup_id } = dto; 

      const eS = new this.ESupply({ sup_id });
      eS.validateID();

      const exist = await this.SupplyRep.findByID({ sup_id });
      if (!exist) throw { message: `Supply w/ ID ${sup_id} doesn't exist`, errCode: 'NOT-FOUND', statusCode: 404 }
      if (!exist.isActive) throw { message: `Supply w/ ID ${sup_id} is already inactive`, errCode: 'INACTIVE', statusCode: 400 }

      await this.SupplyRep.remove({ sup_id });      

    } catch (err) {
      throw err; 
    }
  }


}
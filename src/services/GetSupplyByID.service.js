import { ESupply } from "../Entity/Supply.entity.js";
import { SupplyRep } from "../repositories/Supply.repository.js";



export class GetSupplyByIDSrv {

  constructor() {
    this.SupplyRep = new SupplyRep(); 
    this.ESupply = ESupply; 
  }

  exe = async (dto) => {
    try {
      const { sup_id } = dto; 

      const eS = new this.ESupply({ sup_id });
      eS.validateID();

      const supply = await this.SupplyRep.findByID({ sup_id });
      if (!supply) throw { message: `Supply w/ ID ${sup_id} doesn't exist`, errCode: 'NOT-FOUND', statusCode: 404 }
      if (supply.isActive === false) throw { message: `Supply w/ ID ${sup_id} is inactive`, errCode: 'NOT-FOUND', statusCode: 404 }

      return supply;
    } catch (err) {
      throw err; 
    }
  }


}
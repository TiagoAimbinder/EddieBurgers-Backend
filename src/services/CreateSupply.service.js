
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
      const eS = new this.ESupply({ sup_name, sup_price });
      eS.validatePrice(); 
      eS.validateName();

      const existByName = await this.SupplyRep.findByName({ sup_name });
      if (existByName) throw { statusCode: 400, message: `Supply w/ name ${ sup_name } already exist`, errCode: ''}; 

      const created = await this.SupplyRep.create(eS.dto);
      return created; 
    } catch (err) {
      console.log('ERR: ', err);
      throw err; 
    }
  }

}
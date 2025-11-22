import { SupplyRep } from "../repositories/Supply.repository.js";



export class GetAllSuppliesSrv {

  constructor() {
    this.SupplyRep = new SupplyRep();
  }

  exe = async () => {
    try {
      const data = await this.SupplyRep.findAllActive();      
      if (!data || !Array.isArray(data) || data.length <= 0 ) throw { message: `Supplies don't exist`}; 
      return data; 
    } catch (err) {
      throw err;
    }
  }



}
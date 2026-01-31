import { Database } from "../config/db.js";


export class ManangementRep { 

    get models() { return Database.models}


    create = async (movement, transaction = null) => {
        await this.models.ManangementHistory.create(
            { 
                ...movement,
                his_status: true,
            }, 
            { transaction } 
        )    
    }; 

    insertData = async (generalData, transaction = null) => {
        await this.models.ManangementHistory.bulkCreate(generalData, { transaction });
    }

    getAll = async () => {
        const movs = await this.models.ManangementHistory.findAll({ where: { his_status: 1 } })
        return movs.map( (mov) => mov.dataValues)
    }

    delete = async (his_id, transaction = null) => {
        await this.models.ManangementHistory.update(
            { his_status: false },
            { where: { his_id: his_id }, transaction}
        )
    }

    update = async (his_id, updatedFields, transaction = null) => {
        await this.models.ManangementHistory.update(
            updatedFields, 
            {
                where: { his_id: his_id },
                transaction
            }
        )
    };

    findByID = async (his_id, transaction = null) => {
        const movement = await this.models.ManangementHistory.findOne({ where: { his_id }, transaction })
        return movement ? movement.dataValues : null; 
    }; 


}
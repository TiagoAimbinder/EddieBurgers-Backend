  

import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Supply extends Model {}
      Supply.init({
        sup_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        sup_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        sup_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        }
      },
      {
          sequelize,
          modelName: 'Supply',
          timestamps: true, 
      });

    return Supply; 
}
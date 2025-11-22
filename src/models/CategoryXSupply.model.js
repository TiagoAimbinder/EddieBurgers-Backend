import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class CategoryXSupply extends Model {}
    CategoryXSupply.init({
      cxs_id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          autoIncrement: true, 
          allowNull: false, 
      },
      sup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }, 
      cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cxs_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      }
    },
    {
        sequelize,
        modelName: 'CategoryXSupply',
        timestamps: true, 
    });

    return CategoryXSupply; 
}
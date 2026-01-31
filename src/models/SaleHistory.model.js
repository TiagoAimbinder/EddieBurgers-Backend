import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class SaleHistory extends Model {}
    SaleHistory.init({
      sal_id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          autoIncrement: true, 
          allowNull: false, 
      },
      usu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sal_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sal_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sal_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sal_type: {
        type: DataTypes.INTEGER, 
        allowNull: true,
      },
      sal_local: {
        type: DataTypes.INTEGER,
        allowNull: true, // O false si es obligatorio
      }
    },
    {
        sequelize,
        modelName: 'saleHistory',
        timestamps: false, 
    });

    return SaleHistory; 
}
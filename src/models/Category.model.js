import { DataTypes, Model } from 'sequelize'; 

export default (sequelize)  => {
    class Category extends Model {}
    Category.init({
      cat_id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          autoIncrement: true, 
          allowNull: false, 
      },
      sec_id: { // <--- NUEVO CAMPO (Foreign Key)
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cat_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cat_profit_percent: {
        type: DataTypes.FLOAT, // Usamos FLOAT para decimales (ej: 30.5)
        allowNull: false,
        defaultValue: 21, // Valor por defecto si te olvidas de mandarlo
      }
    },
    {
        sequelize,
        modelName: 'category',
        timestamps: true, 
    });

    return Category; 
}
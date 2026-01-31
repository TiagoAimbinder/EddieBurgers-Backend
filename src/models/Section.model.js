import { DataTypes, Model } from 'sequelize'; 

export default (sequelize) => {
    class Section extends Model {}
    Section.init({
      sec_id: {
          type: DataTypes.INTEGER,
          primaryKey: true, 
          autoIncrement: true, 
          allowNull: false, 
      },
      sec_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    },
    {
        sequelize,
        modelName: 'section',
        timestamps: true, 
    });

    return Section; 
}
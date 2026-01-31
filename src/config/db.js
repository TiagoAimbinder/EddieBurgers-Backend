import { config as dotEnvConfig } from "dotenv";
import { Configuration } from "./config.js";
import Sequelize from 'sequelize';


import UserModel from '../models/User.model.js';
import ManangementHistoryModel from '../models/ManangementHistory.model.js';
import ManangementWeekModel from '../models/ManangementWeek.model.js';
import CurrencyTypeModel from '../models/CurrencyType.model.js';
import LogHistoryModel from '../models/LogHistory.model.js';
import ExpensesModel from '../models/Expenses.model.js';
import CategoryModel from '../models/Category.model.js'; 
import SaleHistoryModel from '../models/SaleHistory.model.js';
import SupplyModel from "../models/Supply.model.js";
import CategoryXSupplyModel from "../models/CategoryXSupply.model.js";
import SectionModel from '../models/Section.model.js'


export class Database {

  static sequelize = null; 
  static models = {};
  
  constructor() {
    dotEnvConfig(); 
    this.config = new Configuration();
    this.ENV = process.env.NODE_ENV || 'prod';

    const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = this.config.DBConecction[this.ENV];
    this.DB_HOST = DB_HOST;
    this.DB_USER = DB_USER;
    this.DB_PASSWORD = DB_PASSWORD;
    this.DB_DATABASE = DB_DATABASE;
  };

  // Add prod environment -> dev: mssql | prod: mysql
  sequelizeInit = () => {
    Database.sequelize = new Sequelize(this.DB_DATABASE, this.DB_USER, this.DB_PASSWORD, {
      host: this.DB_HOST,
      dialect: 'mysql',
      dialectOptions: {
          options: {
              encrypt: false,
          },
      },
      define: { timestamps: true },
      logging: false, 
    });  
  }

  createConnection = async () => {
    try {
        await Database.sequelize.authenticate();
        console.log('✅ | Database connection');
    } catch (err) {
        console.error('❌ | Database connection ', err.message);
    }
  };

  modelsInit = () => {
    try {
      const models = {
        User: UserModel(Database.sequelize),
        ManangementHistory: ManangementHistoryModel(Database.sequelize),
        ManangementWeek: ManangementWeekModel(Database.sequelize),
        CurrencyType: CurrencyTypeModel(Database.sequelize),
        LogHistory: LogHistoryModel(Database.sequelize),
        Expenses: ExpensesModel(Database.sequelize),
        Section: SectionModel(Database.sequelize),
        Category: CategoryModel(Database.sequelize),
        SaleHistory: SaleHistoryModel(Database.sequelize),
        Supply: SupplyModel(Database.sequelize),
        CategoryXSupply: CategoryXSupplyModel(Database.sequelize),
      };

      Database.models = models;

      // 2. DEFINIR ASOCIACIONES (EL PEGAMENTO)
      // Una Sección tiene muchas Categorías
      models.Section.hasMany(models.Category, { foreignKey: 'sec_id', as: 'categories' });
      models.Category.belongsTo(models.Section, { foreignKey: 'sec_id', as: 'section' });

      // Una Categoría tiene muchos Insumos (Relación Muchos a Muchos)
      models.Category.belongsToMany(models.Supply, { 
          through: models.CategoryXSupply, 
          foreignKey: 'cat_id',
          otherKey: 'sup_id',
          as: 'supplies' // Así se llamará el array cuando consultes la API
      });

      models.Supply.belongsToMany(models.Category, { 
          through: models.CategoryXSupply, 
          foreignKey: 'sup_id',
          otherKey: 'cat_id'
      });

      return models

    } catch (err) {
      console.error('❌ | Init models', err);
    }
  }; 

  sequelizeSync = async () => {
    try {
        await Database.sequelize.sync({ alter: true }); // { alter: true }
        console.log('✅ | Models synchronized w/ database');
    } catch (err) {
        console.error('❌ | Synchronized models w/ database', err);
    }
  };
}
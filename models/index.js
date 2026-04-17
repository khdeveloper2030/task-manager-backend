'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// ១. បន្ថែមការ Require pg នៅទីនេះ
const pg = require('pg'); 

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    // ២. បន្ថែមបន្ទាត់នេះ ដើម្បីប្រាប់ Sequelize ឱ្យប្រើ pg ដែលយើង require ខាងលើ
    dialectModule: pg, 
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false 
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ... កូដផ្នែកខាងក្រោម (fs.readdirSync...) រក្សាទុកដដែល ...
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
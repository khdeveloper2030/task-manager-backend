'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// ១. កែសម្រួលការបង្កើត Connection (Logic ថ្មីសម្រាប់ Vercel/Neon)
if (process.env.DATABASE_URL) {
  // ប្រសិនបើមាន DATABASE_URL (នៅលើ Vercel) ប្រើវាភ្លាមជាមួយ SSL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // សំខាន់ណាស់សម្រាប់ Neon Postgres
      }
    },
    logging: false // បិទការបង្ហាញ Query ក្នុង Logs ដើម្បីឱ្យស្អាត
  });
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // ប្រើការកំណត់ក្នុង config.json ធម្មតា (សម្រាប់ Localhost)
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ២. ការទាញយក Model (រក្សាទុកកូដដើមរបស់អ្នក)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
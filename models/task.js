'use strict';
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {}
  };
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.STRING,
    priority: DataTypes.STRING,
    startDate: DataTypes.DATE, // បន្ថែមចំណុចនេះ
    endDate: DataTypes.DATE    // បន្ថែមចំណុចនេះ
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
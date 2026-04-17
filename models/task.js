'use strict';
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    priority: { type: DataTypes.STRING, defaultValue: 'medium' },
    status: { type: DataTypes.STRING, defaultValue: 'todo' },
    startDate: { type: DataTypes.DATE, allowNull: true },
    endDate: { type: DataTypes.DATE, allowNull: true }
  });
  return Task;
};
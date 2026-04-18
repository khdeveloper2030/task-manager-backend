"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define("Task", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.STRING,
      defaultValue: "medium",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "todo",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // កែសម្រួលត្រង់នេះ៖ ប្តូរមក true សិន ដើម្បីការពារ Error 400 ពេល Sync ជាមួយទិន្នន័យចាស់
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Task;
};

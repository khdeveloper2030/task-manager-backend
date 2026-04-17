'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tasks', 'startDate', { type: Sequelize.DATE });
    await queryInterface.addColumn('Tasks', 'endDate', { type: Sequelize.DATE });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tasks', 'startDate');
    await queryInterface.removeColumn('Tasks', 'endDate');
  }
};
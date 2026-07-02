'use strict';

/** @type {import('sequelize-cli').Migration} */
const TABLES = ['commands', 'tables', 'items', 'categories'];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of TABLES) {
      await queryInterface.addColumn(table, 'deleted_at', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      });
    }
  },

  async down(queryInterface) {
    for (const table of TABLES) {
      await queryInterface.removeColumn(table, 'deleted_at');
    }
  }
};

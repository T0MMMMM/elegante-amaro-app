'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('state_commands', 'color', { type: Sequelize.STRING(20), allowNull: true, defaultValue: null });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('state_commands', 'color');
  }
};

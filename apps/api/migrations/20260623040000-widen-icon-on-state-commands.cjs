'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('state_commands', 'icon', { type: Sequelize.STRING(20), allowNull: true, defaultValue: null });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('state_commands', 'icon', { type: Sequelize.STRING(10), allowNull: true, defaultValue: null });
  }
};

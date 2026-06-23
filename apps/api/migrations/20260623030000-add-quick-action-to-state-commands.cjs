'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('state_commands', 'quick_action_enabled', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await queryInterface.addColumn('state_commands', 'icon', { type: Sequelize.STRING(10), allowNull: true, defaultValue: null });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('state_commands', 'quick_action_enabled');
    await queryInterface.removeColumn('state_commands', 'icon');
  }
};

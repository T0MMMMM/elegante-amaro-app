'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('item_options', 'deleted_at', { type: Sequelize.DATE, allowNull: true, defaultValue: null });
    await queryInterface.addColumn('state_commands', 'deleted_at', { type: Sequelize.DATE, allowNull: true, defaultValue: null });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('item_options', 'deleted_at');
    await queryInterface.removeColumn('state_commands', 'deleted_at');
  }
};

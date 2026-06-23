'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('state_commands', 'position', { type: Sequelize.INTEGER, allowNull: true, defaultValue: null });
    await queryInterface.sequelize.query(
      'UPDATE state_commands SET position = id WHERE position IS NULL'
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('state_commands', 'position');
  }
};

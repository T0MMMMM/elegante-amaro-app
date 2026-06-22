'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('items', 'created_at', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('items', 'updated_at', { type: Sequelize.DATE, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('items', 'created_at');
    await queryInterface.removeColumn('items', 'updated_at');
  }
};

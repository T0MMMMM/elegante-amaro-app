'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('state_commands', 'visible_on_mobile', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });
    await queryInterface.addColumn('state_commands', 'is_final', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });

    // Statuts terminaux pré-existants : la commande est considérée close (mobile + tableau de suivi).
    await queryInterface.bulkUpdate('state_commands', { is_final: true }, { state: ['livrée', 'annulée'] });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('state_commands', 'visible_on_mobile');
    await queryInterface.removeColumn('state_commands', 'is_final');
  }
};

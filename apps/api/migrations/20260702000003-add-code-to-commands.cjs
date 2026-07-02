'use strict';

/** Même formule que shared/utils et src/utils/orderNumber.js. */
function formatOrderNumber(id) {
  const n = Math.max(1, Math.floor(Number(id) || 0));
  const PER_BLOCK = 999;
  const seq = ((n - 1) % PER_BLOCK) + 1;
  let block = Math.floor((n - 1) / PER_BLOCK);
  let letters = '';
  for (let i = 0; i < 3; i++) {
    letters = String.fromCharCode(65 + (block % 26)) + letters;
    block = Math.floor(block / 26);
  }
  return `${letters}${String(seq).padStart(3, '0')}`;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('commands', 'code', {
      type: Sequelize.STRING(12),
      allowNull: true
    });

    // Backfill des commandes déjà présentes.
    const [rows] = await queryInterface.sequelize.query('SELECT id FROM commands WHERE code IS NULL');
    for (const { id } of rows) {
      await queryInterface.sequelize.query('UPDATE commands SET code = ? WHERE id = ?', {
        replacements: [formatOrderNumber(id), id]
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('commands', 'code');
  }
};

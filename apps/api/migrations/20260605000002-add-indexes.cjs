'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('items', ['category_id']);
    await queryInterface.addIndex('commands', ['user_id']);
    await queryInterface.addIndex('commands', ['state_command_id']);
    await queryInterface.addIndex('commands', ['table_id']);
    await queryInterface.addIndex('commands_items', ['command_id']);
    await queryInterface.addIndex('commands_items', ['item_id']);
    await queryInterface.addIndex('commands_items_options', ['commands_items_id']);
    await queryInterface.addIndex('items_item_options', ['item_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('items', ['category_id']);
    await queryInterface.removeIndex('commands', ['user_id']);
    await queryInterface.removeIndex('commands', ['state_command_id']);
    await queryInterface.removeIndex('commands', ['table_id']);
    await queryInterface.removeIndex('commands_items', ['command_id']);
    await queryInterface.removeIndex('commands_items', ['item_id']);
    await queryInterface.removeIndex('commands_items_options', ['commands_items_id']);
    await queryInterface.removeIndex('items_item_options', ['item_id']);
  }
};

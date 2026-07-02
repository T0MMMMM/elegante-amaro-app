'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Categories
    await queryInterface.bulkInsert('categories', [
      { name: 'Boissons chaudes' },
      { name: 'Boissons froides' },
      { name: 'Pâtisseries' },
      { name: 'Snacks' }
    ]);

    // Item options
    await queryInterface.bulkInsert('item_options', [
      { name: 'Lait végétal', extra_price: 0.50 },
      { name: 'Double shot', extra_price: 0.80 },
      { name: 'Sans sucre', extra_price: 0.00 },
      { name: 'Chantilly', extra_price: 0.60 },
      { name: 'Sirop caramel', extra_price: 0.50 }
    ]);

    // Items
    await queryInterface.bulkInsert('items', [
      { name: 'Espresso', slug: 'espresso', price: 2.50, category_id: 1 },
      { name: 'Cappuccino', slug: 'cappuccino', price: 3.80, category_id: 1 },
      { name: 'Latte', slug: 'latte', price: 4.00, category_id: 1 },
      { name: 'Thé Earl Grey', slug: 'the-earl-grey', price: 3.00, category_id: 1 },
      { name: 'Limonade maison', slug: 'limonade-maison', price: 4.50, category_id: 2 },
      { name: 'Ice Coffee', slug: 'ice-coffee', price: 4.80, category_id: 2 },
      { name: 'Jus d\'orange', slug: 'jus-orange', price: 3.50, category_id: 2 },
      { name: 'Croissant', slug: 'croissant', price: 2.20, category_id: 3 },
      { name: 'Pain au chocolat', slug: 'pain-au-chocolat', price: 2.50, category_id: 3 },
      { name: 'Tarte aux pommes', slug: 'tarte-aux-pommes', price: 4.20, category_id: 3 },
      { name: 'Sandwich jambon', slug: 'sandwich-jambon', price: 5.50, category_id: 4 },
      { name: 'Cookie chocolat', slug: 'cookie-chocolat', price: 1.80, category_id: 4 }
    ]);

    // Items <-> ItemOptions (associations)
    await queryInterface.bulkInsert('items_item_options', [
      { item_id: 1, item_option_id: 2 }, // Espresso + Double shot
      { item_id: 1, item_option_id: 3 }, // Espresso + Sans sucre
      { item_id: 2, item_option_id: 1 }, // Cappuccino + Lait végétal
      { item_id: 2, item_option_id: 4 }, // Cappuccino + Chantilly
      { item_id: 2, item_option_id: 5 }, // Cappuccino + Sirop caramel
      { item_id: 3, item_option_id: 1 }, // Latte + Lait végétal
      { item_id: 3, item_option_id: 5 }, // Latte + Sirop caramel
      { item_id: 6, item_option_id: 4 }, // Ice Coffee + Chantilly
    ]);

    // State commands
    await queryInterface.bulkInsert('state_commands', [
      { state: 'en attente',     is_final: false },
      { state: 'en préparation', is_final: false },
      { state: 'prête',          is_final: false },
      { state: 'livrée',         is_final: true },
      { state: 'annulée',        is_final: true }
    ]);

    // Commands types
    await queryInterface.bulkInsert('commands_types', [
      { name: 'sur place' },
      { name: 'à emporter' }
    ]);

    // Tables
    await queryInterface.bulkInsert('tables', [
      { numero: 1 }, { numero: 2 }, { numero: 3 }, { numero: 4 }, { numero: 5 },
      { numero: 6 }, { numero: 7 }, { numero: 8 }, { numero: 9 }, { numero: 10 }
    ]);

    // Users
    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@elegante-amaro.fr',
        password_hash: '$2b$10$examplehashadmin',
        fidelity_points: 0,
        roles: JSON.stringify(['admin'])
      },
      {
        name: 'Serveur 1',
        email: 'serveur1@elegante-amaro.fr',
        password_hash: '$2b$10$examplehashserveur1',
        fidelity_points: 0,
        roles: JSON.stringify(['serveur'])
      },
      {
        name: 'Alice Martin',
        email: 'alice@example.com',
        password_hash: '$2b$10$examplehashalice',
        fidelity_points: 120,
        roles: JSON.stringify(['client'])
      },
      {
        name: 'Bob Dupont',
        email: 'bob@example.com',
        password_hash: '$2b$10$examplehashbob',
        fidelity_points: 45,
        roles: JSON.stringify(['client'])
      }
    ]);

    // Commands
    const now = new Date();
    await queryInterface.bulkInsert('commands', [
      {
        code: 'AAA001',
        user_id: 3,
        type_id: 1,
        state_command_id: 4,
        total_price: 8.70,
        tva_rate: 10.00,
        table_id: 3,
        created_at: new Date(now - 3600000),
        updated_at: new Date(now - 1800000)
      },
      {
        code: 'AAA002',
        user_id: 4,
        type_id: 2,
        state_command_id: 3,
        total_price: 7.10,
        tva_rate: 10.00,
        table_id: null,
        created_at: new Date(now - 1200000),
        updated_at: new Date(now - 600000)
      },
      {
        code: 'AAA003',
        user_id: 3,
        type_id: 1,
        state_command_id: 2,
        total_price: 13.76,
        tva_rate: 10.00,
        table_id: 5,
        created_at: new Date(now - 300000),
        updated_at: new Date(now - 300000)
      }
    ]);

    // Commands items
    await queryInterface.bulkInsert('commands_items', [
      { item_id: 2, command_id: 1, quantity: 1, unit_price: 3.80, line_total: 3.80, size: 'moyen' },
      { item_id: 8, command_id: 1, quantity: 2, unit_price: 2.20, line_total: 4.40, size: null },
      { item_id: 3, command_id: 2, quantity: 1, unit_price: 4.80, line_total: 4.80, size: 'grand' },
      { item_id: 12, command_id: 2, quantity: 1, unit_price: 1.80, line_total: 1.80, size: null },
      { item_id: 1, command_id: 3, quantity: 2, unit_price: 2.13, line_total: 4.26, size: 'petit' },
      { item_id: 10, command_id: 3, quantity: 1, unit_price: 4.20, line_total: 4.20, size: null },
      { item_id: 5, command_id: 3, quantity: 1, unit_price: 4.50, line_total: 4.50, size: null }
    ]);

    // Commands items options
    await queryInterface.bulkInsert('commands_items_options', [
      { commands_items_id: 1, item_options_id: 1, extra_price: 0.50 }, // Cappuccino + Lait végétal
      { commands_items_id: 3, item_options_id: 5, extra_price: 0.50 }, // Latte + Sirop caramel
      { commands_items_id: 5, item_options_id: 2, extra_price: 0.80 }  // Espresso + Double shot
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('commands_items_options', null, {});
    await queryInterface.bulkDelete('commands_items', null, {});
    await queryInterface.bulkDelete('commands', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('tables', null, {});
    await queryInterface.bulkDelete('commands_types', null, {});
    await queryInterface.bulkDelete('state_commands', null, {});
    await queryInterface.bulkDelete('items_item_options', null, {});
    await queryInterface.bulkDelete('items', null, {});
    await queryInterface.bulkDelete('item_options', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};

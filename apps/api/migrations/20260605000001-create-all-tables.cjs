'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(55), allowNull: false, unique: true }
    });

    await queryInterface.createTable('item_options', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(55), allowNull: true },
      extra_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true }
    });

    await queryInterface.createTable('items', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(55), allowNull: true },
      slug: { type: Sequelize.STRING(150), allowNull: true, unique: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      image: { type: Sequelize.STRING(255), allowNull: true },
      category_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'categories', key: 'id' }
      }
    });

    await queryInterface.createTable('items_item_options', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      item_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'items', key: 'id' }
      },
      item_option_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'item_options', key: 'id' }
      }
    });

    await queryInterface.createTable('state_commands', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      state: { type: Sequelize.STRING(55), allowNull: false, unique: true }
    });

    await queryInterface.createTable('commands_types', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      name: { type: Sequelize.STRING(55), allowNull: false, unique: true }
    });

    await queryInterface.createTable('tables', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      numero: { type: Sequelize.INTEGER, allowNull: false, unique: true }
    });

    await queryInterface.createTable('commands', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'users', key: 'id' }
      },
      type_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'commands_types', key: 'id' }
      },
      state_command_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'state_commands', key: 'id' }
      },
      total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      tva_rate: { type: Sequelize.DECIMAL(5, 2), allowNull: true },
      table_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'tables', key: 'id' }
      },
      created_at: { type: Sequelize.DATE, allowNull: true },
      updated_at: { type: Sequelize.DATE, allowNull: true }
    });

    await queryInterface.createTable('commands_items', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      item_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'items', key: 'id' }
      },
      command_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'commands', key: 'id' }
      },
      quantity: { type: Sequelize.INTEGER, allowNull: true },
      unit_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      line_total: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      size: { type: Sequelize.ENUM('petit', 'moyen', 'grand'), allowNull: true }
    });

    await queryInterface.createTable('commands_items_options', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      commands_items_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'commands_items', key: 'id' }
      },
      item_options_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'item_options', key: 'id' }
      },
      extra_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('commands_items_options');
    await queryInterface.dropTable('commands_items');
    await queryInterface.dropTable('commands');
    await queryInterface.dropTable('tables');
    await queryInterface.dropTable('commands_types');
    await queryInterface.dropTable('state_commands');
    await queryInterface.dropTable('items_item_options');
    await queryInterface.dropTable('items');
    await queryInterface.dropTable('item_options');
    await queryInterface.dropTable('categories');
  }
};

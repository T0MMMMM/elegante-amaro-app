'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.createTable("users", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: true,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      fidelity_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      roles: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  }
};

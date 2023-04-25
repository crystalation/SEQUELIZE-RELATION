'use strict';
/** @type {import('sequelize/types').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false, // NOT NULL
        autoIncrement: true, // AUTO_INCREMENT
        primaryKey: true, // Primary Key (기본키)
        type: Sequelize.INTEGER,
      },
      email: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: false, // NOT NULL
        type: Sequelize.STRING,
      },
      // passwordConfirm: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },
      createdAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};

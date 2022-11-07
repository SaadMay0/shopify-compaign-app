"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("Campaign", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
        defaultValue: Sequelize.UUIDV4,
      },
      campaignName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // campaignOrders: {
      //   type: Sequelize.INTEGER,
      // },
      // campaignSales: {
      //   type: Sequelize.FLOAT,
      // },
      campaignStatus: {
        type: Sequelize.STRING,
      },
      campaignStart: {
        type: Sequelize.DATE,
      },
      campaignEnd: {
        type: Sequelize.DATE,
      },
      campaignInfo: {
        type: Sequelize.TEXT,
      },
      storeId: {
        type: Sequelize.STRING,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "store",
          key: "id",
          as: "storeId",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('Table Name');
     */

    // await queryInterface.dropAllTables();
    await queryInterface.dropTable("Campaign");

  },
};

"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /**
       *  define association here Like This
       *
       * Campaign.belongsTo(models.Preferences, {
       *   foreignKey: { name: "storeId", allowNull: true },
       *   onDelete: "CASCADE",
       * })
       */
      Campaign.belongsTo(models.Preferences, {
        foreignKey: { name: "storeId", allowNull: true },
        onDelete: "CASCADE",
      });
    }
  }
  Campaign.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      campaignName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // campaignOrders: {
      //   type: DataTypes.INTEGER,
      // },
      // campaignSales: {
      //   type: DataTypes.FLOAT,
      // },
      campaignStatus: {
        type: DataTypes.STRING,
      },
      campaignOption: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      campaignStart: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      campaignEnd: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      campaignMessage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      campaignInfo: {
        type: DataTypes.JSON,
        // get: function () {
        //   return JSON.parse(this.getDataValue("campaignInfo"));
        // },
        // set: function (val) {
        //   return this.setDataValue("campaignInfo", JSON.stringify(val));
        // },
      },
      storeId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "store",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Campaign",
      tableName: "Campaign",
    }
  );
  return Campaign;
};

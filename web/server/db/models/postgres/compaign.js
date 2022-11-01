"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Compaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      /**
       *  define association here Like This
       * 
       * Compaign.belongsTo(models.Preferences, {
       *   foreignKey: { name: "storeId", allowNull: true },
       *   onDelete: "CASCADE",
       * })
       */
        Compaign.belongsTo(models.Preferences, {
          foreignKey: { name: "storeId", allowNull: true },
          onDelete: "CASCADE",
        })

    }
  }
  Compaign.init(
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
      campaignOrders: {
        type: DataTypes.INTEGER,
      },
      campaignSales: {
        type: DataTypes.FLOAT,
      },
      campaignStatus: {
        type: DataTypes.STRING,
      },
      campaignStart: {
           type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("campaignStart"));
        },
        set: function (val) {
          return this.setDataValue("campaignStart", JSON.stringify(val));
        },
      },
      campaignEnd: {
           type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("campaignEnd"));
        },
        set: function (val) {
          return this.setDataValue("campaignEnd", JSON.stringify(val));
        },
      },
      compaignInfo: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("compaignInfo"));
        },
        set: function (val) {
          return this.setDataValue("compaignInfo", JSON.stringify(val));
        },
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
      modelName: "Compaign",
      tableName: "Compaign",
    }
  );
  return Compaign;
};

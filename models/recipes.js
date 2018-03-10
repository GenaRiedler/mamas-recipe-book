module.exports = function(sequelize, DataTypes) {
  var Recipes = sequelize.define('recipes', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    picture: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    keyWords: {
      type: DataTypes.STRING(256),
      allowNull: true
    }
  });
  return Recipes;
};

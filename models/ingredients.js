module.exports = function(sequelize, DataTypes) {
  var Ingredients = sequelize.define('ingredients', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    recipeID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'recipes',
        key: 'id'
      }
    },
    itm: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER(11),
      default: 0,
      allowNull: false
    },
    unitID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'units',
        key: 'id'
      }
    },
    ingredient: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  });
  return Ingredients;
};

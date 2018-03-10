module.exports = function(sequelize, DataTypes) {
  var Directions = sequelize.define('directions', {
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
    step: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    direction: {
      type: DataTypes.STRING(256),
      allowNull: false
    }
  });
  return Directions;
};

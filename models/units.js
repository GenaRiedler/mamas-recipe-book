module.exports = function(sequelize, DataTypes) {
  var Units = sequelize.define('Units', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    abbr: {
      type: DataTypes.STRING(8),
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  });
  return Units;
};

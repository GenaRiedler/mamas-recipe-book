'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(function(file) {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

    var model = sequelize['import'](path.join(__dirname, 'units.js'));
    db[model.name] = model;
    var model = sequelize['import'](path.join(__dirname, 'recipes.js'));
    db[model.name] = model;
    var model = sequelize['import'](path.join(__dirname, 'ingredients'));
    db[model.name] = model;
    var model = sequelize['import'](path.join(__dirname, 'directions'));
    db[model.name] = model;

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Relations
db.Recipes.hasMany(db.Ingredients, {foreignKey: 'recipeID', sourceKey: 'id'})
db.Recipes.hasMany(db.Directions, {foreignKey: 'recipeID', sourceKey: 'id'})
db.Ingredients.belongsTo(db.Units, {foreignKey: 'unitID', sourceKey: 'id'});

module.exports = db;

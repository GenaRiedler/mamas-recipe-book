// *********************************************************************************
// all-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Mama's Recipe model
var db = require("../models");
var fs = require('fs');
const express = require("express");
const router = express.Router();

// Routes
// =============================================================
module.exports = function(app) {

  // Display Carousel (Home Page)
  app.get("/", function(req, res){
    db.Recipes.findAll({}).then(dbRecipe => {
      console.log("Retrieved id=" + dbRecipe.map(Recipe => Recipe.id))
      res.json(dbRecipe);
      // render carousel.handlebars
    });
  });

  // Display all recipes (One per row with Edit/Delete buttons)
  app.get("/displayAll", function (req, res){
    db.Recipes.findAll({}).then(dbRecipe =>  {
      console.log("Retrieved id=" + dbRecipe.map(Recipe => Recipe.id))
      res.render("all-recipes", {Recipes: dbRecipe})
    });
  })

  // Display One Recipe (by ID)
  app.get("/displayOne/:id", function(req, res){
    db.Recipes.findOne({
      include: [
        {
          model: db.Ingredients,
          include: [
            {
              model: db.Units,
            }
          ]
        },{
          model: db.Directions
        }
      ],
      where: {id: req.params.id}
    }).then(dbRecipe => {
      console.log("Retrieved id=" + dbRecipe.id)
      res.render("one-recipe", {Recipes: [dbRecipe]})
    });
  })

  // Add New Recipe to database and Display Update with new ID
  app.get("/create", function(req, res){
    // Add new recipe to database
    db.Recipes.create({
      title: 'New Title',
      description: 'New description',
      picture: 'mamas-recipes.png',
      keyWords: ''
    }).then(dbRecipe => {
      console.log("Created id=" + dbRecipe.id)
      db.Units.findAll({}).then(dbUnits =>  {
        res.json({dbRecipe, dbUnits});
        // render updateOne.handlebars
      });
    });
  })

  // Add New Recipe to database and Display Update with new ID
  app.get("/delete/:id", function(req, res){
    // Delete recipe from database
    db.Recipes.destroy({
      where: {id: req.params.id}
    }).then(dbRecipe => {
      console.log("Deleted id=" + req.params.id)
      db.Recipes.findAll({}).then(dbRecipe =>  {
        res.json(dbRecipe);
        // render displayAll.handlebars
      });
    });
  })

  /// Display Update with ID requested
  app.get("/update/:id", function(req, res){
    // get recipe with ID=id
    db.Recipes.findOne({
      include: [
        {
          model: db.Ingredients,
          include: [
            {
              model: db.Units,
            }
          ]
        },{
          model: db.Directions
        }
      ],
      where: {id: req.params.id}
    }).then(dbRecipe => {
      console.log("Updated id=" + dbRecipe.id)
      db.Units.findAll({}).then(dbUnits =>  {
        res.json({dbRecipe, dbUnits});
        // render updateOne.handlebars
      });
    });
  })

  // Update Database from update display
  app.post("/image", function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    console.log(sampleFile)
    if (["image/jpeg","image/png","image/bmp","image/gif"].indexOf(sampleFile.mimetype) < 0) {
      return res.status(400).send('Invalid File type ' + sampleFile.mimetype);
    }

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("./public/images/" + sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);
      res.send("./public/images/" + sampleFile.name);
    });
  })
}

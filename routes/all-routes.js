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
      res.render("carousel", {Recipes: dbRecipe})
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
        db.Ingredients.create({
          recipeID: dbRecipe.id,
          itm: 1,
          qty: 0,
          unitID: 1,
          ingredient: "nothing"
      }).then(dbIngredients => {
        db.Directions.create({
          recipeID: dbRecipe.id,
          step: 1,
          direction: "nothing to do"
        }).then(dbDirections => {
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
            where: {id: dbRecipe.id}
          }).then(dbRecipe => {
            db.Units.findAll({}).then(dbUnits =>  {
              res.render("edit-recipe", {Recipes: [dbRecipe], Units: dbUnits});
            });
          });
        });
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
        res.render("all-recipes", {Recipes: dbRecipe})
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
        res.render("edit-recipe", {Recipes: [dbRecipe], Units: dbUnits});
      });
    });
  })

  // Save Changes from update display to Database
  app.post("/Save/:id", function(req, res) {
    MyRecipeID = req.params.id
    MyRecipes = req.body.Recipes
    MyIngredients = req.body.Ingredients
    MyDirections = req.body.Directions

    // Update Recipe
    db.Recipes.findOrCreate({
        where: { id:  MyRecipeID}
      }).then (Recipe => {
          Recipe.updateAttributes({
            title: MyRecipes.title,
            description: MyRecipes.description,
            picture: MyRecipes.picture,
            keyWords: MyRecipes.keyWords
          })
      })

      // Update/Delete Ingredients
      req.Ingredients.forEach((ingredient, index) => {
        db.Ingredients.findOrCreate({
            where: {  recipeID: MyRecipeID,
                      itm:  index+1}
          }).then (Ingredient => {
              Recipe.updateAttributes({
                recipeID: MyRecipeID,
                itm:  index+1,
                qty: MyIngredients.qty,
                unitID: MyIngredients.unitID,
                ingredient: MyIngredients.ingredient
              })
          })
      })
      db.Ingredients.destroy({
          where: {  recipeID: MyRecipeID,
                    itm:  {[Op.gt]: MyIngredients.length}}
      })

      // Update/Delete Ingredients
      req.Directions.forEach((direction, index) => {
        db.Directions.findOrCreate({
            where: {  recipeID: MyRecipeID,
                      step:  index+1}
          }).then (Direction => {
              Direction.updateAttributes({
                recipeID: MyRecipeID,
                step:  index+1,
                direction: MyDirections.direction
              })
          })
      })
      db.Directions.destroy({
          where: {  recipeID: MyRecipeID,
                    step:  {[Op.gt]: MyDirections.length}}
      })
  })

  // Update Database from update display
  app.post("/image/:id", function(req, res) {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    if (["image/jpeg","image/png","image/bmp","image/gif"].indexOf(sampleFile.mimetype) < 0) {
      return res.status(400).send('Invalid File type ' + sampleFile.mimetype);
    }

    var posIdx = sampleFile.name.lastIndexOf('.');
    var fileName = sampleFile.name.substr(0, posIdx) + Date.now() + sampleFile.name.substr(posIdx)

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("./public/images/" + fileName, function(err) {
      if (err) return res.status(500).send(err);
      db.Recipes.update({
          picture: fileName
        },{
          where: {id: req.params.id}
        }).then(dbRecipe =>  {
          console.log("Updated Picutre for id=" + dbRecipe.id)
          return res.send(200);
        });
      });
    });
}

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
const Op = db.Sequelize.Op

var createOrUpdate = function(model, whereClause, newData) {
  model.findOne({
    where: whereClause
  }).then(foundItem => {
    if (!foundItem) { // Item not found, create a new one
      model.create(newData).catch(err => {
        console.log(model.Name, whereClause, newData)
        throw err
      })
    } else {          // Found an item, update it
      model.update(newData, {where: whereClause}).catch(err => {
        console.log(model.Name, whereClause, newData)
        throw err
      })
    }
  }).catch(err => {
    console.log(model.Name, whereClause, newData)
    throw err
  });
}

var deleteGreaterThan = function(model, whereClause) {
  model.destroy({
    where: whereClause
  }).catch(err => {
    console.log(model.Name, whereClause)
    throw err
  })
}

// Routes
// =============================================================
module.exports = function(app) {

  // Display Carousel (Home Page)
  app.get("/", function(req, res){
    db.Recipes.findAll({}).then(dbRecipe => {
      console.log("Retrieved id=" + dbRecipe.map(Recipe => Recipe.id))
      res.render("carousel", {Recipes: dbRecipe})
    });
console.log(__dirname)
  });

  // Display all recipes (One per row with Edit/Delete buttons)
  app.get("/displayAll", function (req, res){
    db.Recipes.findAll({}).then(dbRecipe =>  {
      console.log("Retrieved id=" + dbRecipe.map(Recipe => Recipe.id))
      res.render("all-recipes", {Recipes: dbRecipe})
    });
console.log(__dirname)
  })

  // Display One Recipe (by ID)
  app.get("/displayOne/:id", function(req, res){
    var MyRecipeID = req.params.id
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
      where: {id: MyRecipeID}
    }).then(dbRecipe => {
      console.log("Retrieved id=" + dbRecipe.id)
      res.render("one-recipe", {Recipes: [dbRecipe]})
    });
console.log(__dirname)
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
              res.render("edit-recipe", {'Recipes': [dbRecipe], 'allUnits': dbUnits});
            });
          });
        });
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
      db.Units.findAll().then(dbUnits =>  {
         res.render("edit-recipe", {'Recipes': [dbRecipe], 'allUnits': dbUnits});
      });
    });
  })

  // Add New Recipe to database and Display Update with new ID
  app.post("/delete", function(req, res){
    var MyRecipeID = req.body.id
    // Delete recipe from database
    db.Recipes.destroy({
      where: {id: MyRecipeID}
    }).then(dbRecipe => {
      console.log("Deleted id=" + MyRecipeID)
      db.Recipes.findAll({}).then(dbRecipe =>  {
        return res.send(200)
      });
    });
  })

  // Save Changes from update display to Database
  app.post("/save", function(req, res) {
    var MyRecipeID = req.body.id
console.log(MyRecipeID)
    var MyRecipes = req.body.Recipes
console.log(MyRecipes)
    var MyIngredients = req.body.Ingredients
console.log(MyIngredients)
    var MyDirections = req.body.Directions
console.log(MyDirections)

    try {
      createOrUpdate(
        db.Recipes,
        { id:  MyRecipeID },
        { title: req.body.Recipes.title,
          description: MyRecipes.description,
          picture: MyRecipes.picture,
          keyWords: MyRecipes.keyWords }
      )

      MyIngredients.forEach((oneIngredient, index) => {
        createOrUpdate(
          db.Ingredients,
          { recipeID: MyRecipeID,
            itm:  index+1 },
          { recipeID: MyRecipeID,
            itm:  index+1,
            qty: oneIngredient.qty,
            unitID: oneIngredient.unitID,
            ingredient: oneIngredient.ingredient }
        )
      })

      deleteGreaterThan(
        db.Ingredients,
        { recipeID: MyRecipeID,
          itm:  {[Op.gt]: MyIngredients.length}}
      )

      MyDirections.forEach((direction, index) => {
        createOrUpdate(
          db.Directions,
          { recipeID: MyRecipeID,
            step:  index+1 },
          { recipeID: MyRecipeID,
            step:  index+1,
            direction: direction.direction }
          )
      })

      deleteGreaterThan(
        db.Directions,
        { recipeID: MyRecipeID,
          step:  {[Op.gt]: MyDirections.length}}
      )
    }
    catch (err) {
      console.log("ooopppsss", err)
      return res.send(500)
    }
    return res.send(200)
  })

  // Update Database from update display
  app.post("/image/:id", function(req, res) {
    var MyRecipeID = req.params.id
     if (!req.files)
      return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    if (["image/jpeg","image/png","image/bmp","image/gif"].indexOf(sampleFile.mimetype) < 0) {
      return res.status(400).send('Invalid File type ' + sampleFile.mimetype);
    }

    var posIdx = sampleFile.name.lastIndexOf('.');
    var fileName = sampleFile.name.substr(0, posIdx) + Date.now() + sampleFile.name.substr(posIdx)
    console.log(fileName)

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("./public/images/" + fileName, function(err) {
      if (err) return res.status(500).send(err);
      db.Recipes.update({
          picture: fileName
        },{
          where: {id: MyRecipeID}
        }).then(dbRecipe =>  {
          console.log("Updated Picutre for id=" + MyRecipeID)
          return res.send(200);
        });
      });
  });

}

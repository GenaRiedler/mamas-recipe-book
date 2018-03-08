DROP DATABASE IF EXISTS MamasRecipes_dev;
CREATE DATABASE MamasRecipes_dev;

use MamasRecipes_dev;

DROP TABLE IF EXISTS Units;
CREATE TABLE Units(
	id  integer(11) auto_increment not null primary key,
	abbr varchar(8) not null,
	unit varchar(32) not null,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL
);

DROP TABLE IF EXISTS Recipes;
CREATE TABLE Recipes(
	id  integer(11) auto_increment not null primary key,
	title  varchar(100) not null,
	description varchar(1024) not null,
	picture varchar(256) not null,
	keyWords varchar(256) not null,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL
);

DROP TABLE IF EXISTS Ingredients;
CREATE TABLE Ingredients(
	id  integer(11) auto_increment not null primary key,
	recipeID integer(11) not null,
	itm  integer(11) not null,
	qty  integer(11) not null,
	unitID integer(11) not null,
	ingredient varchar(256) not null,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	FOREIGN KEY (recipeID)
        REFERENCES Recipes(id)
        ON DELETE CASCADE,
	FOREIGN KEY (unitID)
        REFERENCES Units(id)
);

DROP TABLE IF EXISTS Directions;
CREATE TABLE Directions(
	id  integer(11) auto_increment not null primary key,
	recipeID integer(11) not null,
	step integer(11) not null,
	direction varchar(256) not null,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	FOREIGN KEY (recipeID)
        REFERENCES Recipes(id)
        ON DELETE CASCADE
);


INSERT INTO Units (abbr, unit, createdAt, updatedAt)
VALUES
	("", "", "2018-01-01 00:00", "2018-01-01 00:00"),
	("oz", "Ounces", "2018-01-01 00:00", "2018-01-01 00:00"),
	("lb", "Pounds", "2018-01-01 00:00", "2018-01-01 00:00"),
	("c", "Cups", "2018-01-01 00:00", "2018-01-01 00:00"),
	("qt", "Quarts", "2018-01-01 00:00", "2018-01-01 00:00"),
	("gal", "Gallons", "2018-01-01 00:00", "2018-01-01 00:00"),
	("pt", "Pints", "2018-01-01 00:00", "2018-01-01 00:00"),
	("tsp", "Teaspoons", "2018-01-01 00:00", "2018-01-01 00:00"),
	("tbl", "Tablespoons", "2018-01-01 00:00", "2018-01-01 00:00");

INSERT INTO Recipes (title, description, picture, keyWords, createdAt, updatedAt)
VALUES
	("Meatloaf",			"Meatloaf",				"meatloaf.png",		"hamburger", "2018-01-01 00:00", "2018-01-01 00:00"),
	("Chicken Soup", 		"Chicken Soup", 		"chickensoup.png",		"chicken, soup", "2018-01-01 00:00", "2018-01-01 00:00"),
	("Deep Fried Turkey", 	"Deep Fried Turkey", 	"deepfriedturkey.png",	"turkey", "2018-01-01 00:00", "2018-01-01 00:00");

INSERT INTO Ingredients (recipeID, itm, qty, unitID, ingredient, createdAt, updatedAt)
VALUES
	(1,	1,	1,	3,	"hamburger", "2018-01-01 00:00", "2018-01-01 00:00"),
    (1,	2,	1,	4,	"Onion", "2018-01-01 00:00", "2018-01-01 00:00"),
    (2,	1,	0,	2,	"", "2018-01-01 00:00", "2018-01-01 00:00"),
    (3,	1,	0,	2,	"", "2018-01-01 00:00", "2018-01-01 00:00");
    
INSERT INTO Directions (recipeID, step, direction, createdAt, updatedAt)
VALUES
	(1,	1,	"Mix everything", "2018-01-01 00:00", "2018-01-01 00:00"),
    (1,	2,	"Put in loaf", "2018-01-01 00:00", "2018-01-01 00:00"),
    (1,	3,	"Bake at 350 for an hour", "2018-01-01 00:00", "2018-01-01 00:00"),
    (1,	4,	"Set aside for 15 mins", "2018-01-01 00:00", "2018-01-01 00:00"),
    (1, 5,	"Enjoy", "2018-01-01 00:00", "2018-01-01 00:00"),
    (2,	1,	"", "2018-01-01 00:00", "2018-01-01 00:00"),
    (3,	1,	"", "2018-01-01 00:00", "2018-01-01 00:00");
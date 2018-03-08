use mamasrecipes_dev;
SELECT *
FROM (((Recipes 
			LEFT JOIN Ingredients ON Recipes.id = Ingredients.recipeID)
            LEFT JOIN Directions ON Recipes.id = Directions.recipeID) 
		LEFT JOIN Units ON Units.id = Ingredients.unitID)
where id=16;

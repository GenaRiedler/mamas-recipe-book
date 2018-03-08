// View/Edit/Delete buttons

$(document).ready(function() {
	$(".actionButton").on("click", function() {
		switch($(this)[0].value) {
		    case "View":
				window.location.href = "/displayOne/" + $(this)[0].attributes.recipeID.value
		        break;
		    case "Edit":
				window.location.href = "/update/" + $(this)[0].attributes.recipeID.value
		        break;
		    case "Delete":
		    	var MyJSON = {id: $(this)[0].attributes.recipeID.value}
				$.post("/delete", MyJSON, (data, status) => {
					if (status != "success") alert(status)
					window.location.href = "/displayAll"
				})
				break;
		    case "Save":
		    	var MyJSON = { id: 0,
		    			   Recipes: {title:'', description:'', picture:'', keyWords:''},
		    			   Ingredients: [],
		    			   Directions: []
		    			}

		    	MyJSON.id = $(this)[0].attributes.recipeID.value
		    	MyJSON.Recipes.title = $(".title")[0].value
		    	MyJSON.Recipes.description = $(".description")[0].value
		    	MyJSON.Recipes.picture = $(".picture")[0].value
		    	MyJSON.Recipes.keyWords = ""

		    	ingredientJSON = {itm: 0, qty: 0, unit: 0, ingredient: ""}
		    	$('.ingredients').forEach(ingredient, index => {
		    		src = $(this).children('input, textarea')
		    		ingredientJSON.itm = index+1
		    		ingredientJSON.qty = src[0].value
		    		ingredientJSON.unit = src[1].value
		    		ingredientJSON.ingredient = src[2].value
		    		MyJSON.Ingredients.push(ingredientJSON)
		    	})

		    	directionJSON = {step: 0, direction: ""}
		    	$('.directions').forEach(direction, index => {
		    		src = $(this).children('input, textarea')
		    		directionJSON.step = index+1
		    		directionJSON.direction = src[0].value
		    		MyJSON.Directions.push(directionJSON)
		    	})

				$.ajax({
				    type: "POST",
				    url: "/save",
				    data: MyJSON,
				    contentType: "application/json; charset=utf-8",
				    dataType: "json",
				    success: (data) => { alert(data) },
				    failure: (errMsg) => { alert(errMsg) }
				});
				break;
			default:
				window.location.href = "/"
		}
	})
})

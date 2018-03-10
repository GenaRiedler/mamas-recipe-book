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
		    	var MyJSON = { id: $(this)[0].attributes.recipeID.value }
				$.post("/delete", MyJSON, (data, status) => {
					if (status != "success") alert(status)
					window.location.href = "/displayAll"
				})
				break;
			case "Reset":
				window.location.href = "/update/" + $(this)[0].attributes.recipeID.value
				break;
			case "Save":
				var displayOne = window.location.href = "/displayOne/" + $(this)[0].attributes.recipeID.value;

		    	var Recipes = {
		    	 	'title': $(".title")[0].value,
					'description': $(".description")[0].value,
					'picture': $(".picture")[0].value,
					'keyWords': ''
				}

				var Ingredients = []
				$.each($('.ingredients'), (index, ingredient) => {
		    		var src = $(ingredient).children('input, textarea, select')
		    		Ingredients.push({
		    			'itm': index+1,
		    			'qty': src[0].value,
		    			'unitID': src[1].value,
		    			'ingredient': src[2].value })
		    	})

				var Directions = []
				$.each($('.directions'), (index, direction) => {
		    		var src = $(direction).children('input, textarea')
		    		Directions.push({
		    			'step': index+1,
		    			'direction': src[0].value
		    		})
		    	})

		        $.ajax({
		            url: '/save',
		            type: 'post',
		            data: JSON.stringify({
						'id': $(this)[0].attributes.recipeID.value,
						'Recipes': Recipes,
						'Ingredients': Ingredients,
						'Directions': Directions
					}),
		            contentType: "application/json; charset=utf-8",
			        dataType: "json",
		            traditional: true,
					success: function() {
						window.location.href = displayOne;
					},
					failure: function(errMsg) {alert(errMsg)}
				});
				break;
			default:
				window.location.href = "/"
		}
	})
})

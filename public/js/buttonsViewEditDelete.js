// View/Edit/Delete buttons

$(document).ready(function() {
	$(".actionButton").on("click", function() {
		switch($(this)[0].value) {
		    case "View":
				window.location.href = "displayOne/" + $(this)[0].attributes.recipeID.value
		        break;
		    case "Edit":
				window.location.href = "update/" + $(this)[0].attributes.recipeID.value
		        break;
		    case "Delete":
				window.location.href = "delete/" + $(this)[0].attributes.recipeID.value
				break;
			default:
				window.location.href = "/"
		}
	})
})

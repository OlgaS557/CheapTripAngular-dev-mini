
const serverAddress = "http://192.168.1.32:8080/";


function autoComplete(type, inputField, autoCompleteDivId, locationIdFieldId){
    const searchData = inputField.value;
	clearAutoComplete(autoCompleteDivId);
	locationIdField = document.getElementById(locationIdFieldId);
	locationIdField.value = "";
	
	if(searchData == "")
		return;
	
	const autoCompleteDiv = document.getElementById(autoCompleteDivId);

	var request = new XMLHttpRequest();
	request.open('GET', serverAddress + 'getLocations?type=' + type + '&search_name=' + encodeURIComponent(searchData), true);
	request.onload = function () {
		var data = JSON.parse(this.response);
		console.log('response: ' + this.response);
	
		var wrapper = document.createElement('div');
		wrapper.className = "autoComplete";
		autoCompleteDiv.appendChild(wrapper);
		
		if (request.status == 200) {
			if(data.length == 1 && searchData.toUpperCase() == data[0].name.toUpperCase())
				locationIdField.value = data[0].id;
			
			for(var i = 0; i < data.length; i++) {
				var location = data[i];
				console.log('adding: ' + location);
			
				const searchResultsContainer = document.createElement('div');
				searchResultsContainer.id = location.id;
				const name = location.name;
				const locationID = location.id;
				searchResultsContainer.onclick = function() {
					document.getElementById(locationIdFieldId).value = locationID;
					inputField.value = name;
					while (autoCompleteDiv.getElementsByClassName('autoComplete')[0]) {
						autoCompleteDiv.getElementsByClassName('autoComplete')[0].remove();
					}
				};
				searchResultsContainer.setAttribute('class', 'row');

				const h1 = document.createElement('h1');
				h1.textContent = location.name;
				wrapper.appendChild(searchResultsContainer);
				searchResultsContainer.appendChild(h1);
			}
		} else {
			console.log('error: ' + this.response);
		}
	};
	request.send();
}


function clearAutoComplete(div){
	const autoCompleteDiv = document.getElementById(div);
	while (autoCompleteDiv.getElementsByClassName('autoComplete')[0]) {
		autoCompleteDiv.getElementsByClassName('autoComplete')[0].remove();
	}
}

function search(){
	clearAutoComplete('fromDiv');
	clearAutoComplete('toDiv');
	
	
	const fromID = document.getElementById("fromValue").value;
	const toID = document.getElementById("toValue").value;

	var request = new XMLHttpRequest();
	request.open('GET', serverAddress + 'getRoute?format=json&from=' + fromID + '&to=' + toID, true);
	request.onload = function () {
		console.log('response: ' + this.response);
		var data = JSON.parse(this.response);
		
		var results = document.getElementById("results");
		
		var wrapper = document.createElement('div');
		results.appendChild(wrapper);
		
		if (request.status == 200) {
			var searchResultsContainer = document.createElement('div');
			var h1 = document.createElement('h1');
			h1.textContent = "Mixed Routes";
			wrapper.appendChild(searchResultsContainer);
			searchResultsContainer.appendChild(h1);
			searchResultsContainer.appendChild(getRouteDiv(data.mixed_routes));
			
			searchResultsContainer = document.createElement('div');
			h1 = document.createElement('h1');
			h1.textContent = "Flying Routes";
			wrapper.appendChild(searchResultsContainer);
			searchResultsContainer.appendChild(h1);
			searchResultsContainer.appendChild(getRouteDiv(data.flying_routes));
			
			searchResultsContainer = document.createElement('div');
			h1 = document.createElement('h1');
			h1.textContent = "Ground Routes";
			wrapper.appendChild(searchResultsContainer);
			searchResultsContainer.appendChild(h1);
			searchResultsContainer.appendChild(getRouteDiv(data.ground_routes));
		} else {
			console.log('error: ' + this.response);
		}
	};
	request.send();
}

function getRouteDiv(route){
	var div = document.createElement("div");
	
	var meta = document.createElement("div");
	meta.innerHTML = "<b>Price: " + route.euro_price + "€, Duration: " + minutesToDuration(route.duration_minutes) + "</b>";
	div.appendChild(meta);
	
	var directRoutes = document.createElement("div");
	for(var i = 0; i < route.direct_paths.length; i++) {
		var directRoute = route.direct_paths[i];
		var directRouteDiv = document.createElement("div");
		directRouteDiv.innerHTML = "<p>From: <b>" + directRoute.from + "</b><br>"
		+ "To: <b>" + directRoute.to + "</b><br>"
		+ "Price: " + directRoute.euro_price + "€<br>"
		+ "Transportation: " + directRoute.transportation_type + "<br>"
		+ "Duration: " + minutesToDuration(directRoute.duration_minutes) + "</p>";
		
		directRoutes.appendChild(directRouteDiv);
	}
	div.appendChild(directRoutes);
	
	return div;
}


function minutesToDuration(minutes){
	var days = Math.floor(minutes / (60*24));
	var hours = Math.floor((minutes - (days*60*24)) / 60);
	var mins = minutes - (days*60*24) - (hours*60);

	var duration = "";
	if(days > 0)
		duration += days + " days";
	if(hours > 0){
		if(duration != "")
			duration += " ";
		duration += hours + " hours";
	}
	if(mins > 0){
		if(duration != "")
			duration += " ";
		duration += mins + " minutes";
	}
	return duration;
}

// <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

function Geolocation(){
	this.geocoder = new google.maps.Geocoder();
	this.decodedAddress = undefined;
	this.codedLatLng = undefined;
	this.bounds = new google.maps.LatLngBounds();
	this.distances = {};
}

/*
	Function to take a longitude and latitude value and return an address.
	Longitude and latitude should be provided as a string.

	eg. var address = codeLatLng("43.714224,-73.961452");
*/
Geolocation.prototype.codedLatLng = function(location) {
	var latlngStr = location.split(',', 2);
	var lat = parseFloat(latlngStr[0]);
	var lng = parseFloat(latlngStr[1]);
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				decodedAddress = results[1].formatted_address;
			} else {
				alert('No results found');
			}
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});

	return decodedAddress;
};


/*
	Function to take an address and return a longitude and latitude value.
	The address should be provided as a string.

	eg. var latLng = codeAddress("Sydney, NSW");
*/
Geolocation.prototype.codeAddress = function(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			this.codedLatLng = results[0].geometry.location;
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});

	return this.codedLatLng;
};

/*
	Function to take a origin and a list of destinations and calculate distances.
	Locations can be stored as addresses or latitude/longitude objects.

	eg. calculateDistances("Columbia University, NY", ["Tom's Diner, Morningside Heights", "Hamilton Deli, NYC"]);
*/
Geolocation.prototype.calculateDistances = function(origin, destinations) {
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
	{
		origins: [origin],
		destinations: destinations,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: false,
		avoidTolls: false
	}, this.parseDistances);

	return this.distances;
};

/*
	Callback function to take Google Maps API results and populate a map of distance objects.

	Result format:

	{
		origin1: [{destination: Destination, distance: Distance, duration, Duration}],
		origin2: [{destination: Destination, distance: Distance, duration, Duration},
		{destination: Destination, distance: Distance, duration, Duration}]
	}

	Distances are in miles and durations are in seconds.
*/
Geolocation.prototype.parseDistances = function(response, status) {
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {
		var origins = response.originAddresses;
		var destinations = response.destinationAddresses;

		for (var i = 0; i < origins.length; i++) {
			var results = response.rows[i].elements;
			this.distances[origins[i]] = [];

			for (var j = 0; j < results.length; j++) {
				var distanceResult = {
					destination: destinations[j],
					distance: results[j].distance.value,
					duration: results[j].duration.value
				};

				this.distances[origins[i]].push(distanceResult);
			}
		}
	}
};
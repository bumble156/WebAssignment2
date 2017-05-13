// Function for obtaining the port data from the dialogplus web server and displaying it on the Leaflet map
function fetchData()	{

	// The first map layer, using OpenStreetMap imagery
	var OSM = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	   attribution: 'Map data © OpenStreetMap contributors, CC-BY-SA, Imagery © CloudMade',
	   maxZoom: 18
	});
	
	// The second map layer, using Mapbox imagery
	var Mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	});
	
	// The icon for a large port
	var redIcon = L.icon({
		iconUrl: 'map-marker-red.png',
		iconSize: [40, 40], 
		iconAnchor: [20, 40], 
		popupAnchor:  [0, -40]
	});
	
	// The icon for a medium port
	var purpleIcon = L.icon({
		iconUrl: 'map-marker-purple.png',
		iconSize: [26, 26], 
		iconAnchor: [13, 26], 
		popupAnchor:  [0, -26]
	});
	
	// The icon for a small port
	var yellowIcon = L.icon({
		iconUrl: 'map-marker-yellow.png',
		iconSize: [18, 18], 
		iconAnchor: [9, 18], 
		popupAnchor:  [0, -18]
	});
	
	// The icon for a very small port
	var blueIcon = L.icon({
		iconUrl: 'map-marker-blue.png',
		iconSize: [10, 10], 
		iconAnchor: [5, 10], 
		popupAnchor:  [0, -10]
	});
	
	//Define array to hold results returned from server
	portData = new Array();
	
	//AJAX request to server; accepts a URL to which the request is sent 
	//and a callback function to execute if the request is successful. 
	$.getJSON("assignmentFetch.php", function(results)	{ 
		
		//Populate portData with results
		for (var i = 0; i < results.length; i++ )	{
			
			portData.push ({
				id: results[i].id, 
				name: results[i].name, 
				lat: results[i].lat, 
				lon: results[i].lon,
				size: results[i].size
			}); 
		}
		
		// Call the function to plot the results on the map
		plotPorts();
	});
	
	// Function to plot the returned results on the Leaflet map
	function plotPorts()	{
		// Setting the four layer groups for the different sized ports
		var large = new L.LayerGroup();
		var medium = new L.LayerGroup();
		var small = new L.LayerGroup();
		var vsmall = new L.LayerGroup();
		
		//Loop through portData to create marker at each location 
		for (var i = 0; i < portData.length; i++)	{
			// The location for positioning the marker
			var markerLocation = 
				new L.LatLng(portData[i].lat, portData[i].lon);
			
			// The marker itself
			var marker;
			marker.bindPopup(portData[i].name);
			
			// Checks which size of port is being plotted and sets the according icon and group
			switch(portData[i].size) {
				case "L":
					marker = new L.Marker(markerLocation, {icon: redIcon});
					marker.addTo(large);
					break;
				case "M":
					marker = new L.Marker(markerLocation, {icon: purpleIcon});
					marker.addTo(medium);
					break;
				case "S":
					marker = new L.Marker(markerLocation, {icon: yellowIcon});
					marker.addTo(small);
					break;
				case "V":
					marker = new L.Marker(markerLocation, {icon: blueIcon});
					marker.addTo(vsmall);
					break;
				default:
					marker = new L.Marker(markerLocation, {icon: blueIcon});
					marker.addTo(vsmall);
			}
			
		}
		
		// Creates the map to be displayed using the layers created
		var mymap = L.map('mapid', {
			center: [54.300, -2.52],
			zoom: 5,
			layers: [OSM, Mapbox, large, medium, small, vsmall]
		});
		
		// Groups the base layers to be added
		var baseLayers = {
			"Mapbox": Mapbox, 
			"OSM": OSM
		};

		// Groups the overlays to be added
		var overlays = {
			"Large Ports": large,
			"Medium Ports": medium,
			"Small Ports": small,
			"Very Small Ports": vsmall
		};

		// Adds the base layers and overlays to the map to display the results
		L.control.layers(baseLayers, overlays).addTo(mymap);
		}
}

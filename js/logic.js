var mapZoomLevel = 6;
var centerMap = [38.8026, -116.4194];
var earthquakesURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function getColor(d) {
    return d > 5 ?	'#662200' :
           d > 4 ?	'#802b00' :
           d > 3 ? 	'#cc4400' :
           d > 2 ? 	'#ff661a' :
           d > 1 ? 	'#ff9966' :
					'#ffccb3' ;
}


d3.json(earthquakesURL, function(err,data){	


	
	var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });
	
	var contrast = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 18,
		id: "mapbox.high-contrast",
		accessToken: API_KEY
	});
	
	
	var earthquakes = L.geoJson(data, { 
		pointToLayer: function (feature, latlng) { 
			return L.circle(latlng, {
				fillOpacity: 0.5,
				fillColor: getColor(feature.properties.mag),
				color: "#aaaaaa",
				weight: 1,
				radius: Math.exp(feature.properties.mag) * 1000
			}); 
		},
		onEachFeature: function(feature, layer){
			layer.bindPopup('<h3>'+feature.properties.place+'</h3><p>Magnitude: '+feature.properties.mag+'</p>');
		}
	});
	
	var earthquakeLayer = L.layerGroup(earthquakes);
	
	var baseMaps = {
        "Contrast Map": contrast,
        "Street Map": streets
    };
	
	var overlayMaps = {
       
    };
	
	var map = L.map("map-id", {
		center: centerMap,
		zoom: mapZoomLevel,
		layers: [contrast,streets,earthquakes]
	});
	
	L.control
		.layers(baseMaps, {}, { collapsed:false })
		.addTo(map);
});

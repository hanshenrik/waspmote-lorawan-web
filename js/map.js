var map;
var cityCoordinates = {
  "trondheim": {
    "lon": 10.41,
    "lat": 63.425
  }
};

function drawMap() {
  // Mapbox variables
  var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/{style}/tiles/{z}/{x}/{y}?access_token={accessToken}";
  var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';
  var mapboxAccessToken = "pk.eyJ1IjoiaGFuc2hlbnJpayIsImEiOiJjaWo0aTAzdncwMDIwdXJrcm5jZDZ6dXJ4In0.00I3RVVHNDAvi0XnbZEU-Q";

  // Define some tile layers
  var light = L.tileLayer(mapboxURL, {
    style: 'light-v9',
    attribution: mapboxAttribution,
    accessToken: mapboxAccessToken
  });
  var dark = L.tileLayer(mapboxURL, {
    style: 'dark-v9',
    attribution: mapboxAttribution,
    accessToken: mapboxAccessToken
  });
  var streets = L.tileLayer(mapboxURL, {
    style: 'streets-v9',
    attribution: mapboxAttribution,
    accessToken: mapboxAccessToken
  });

  var baseMaps = {
    "Landscape": streets,
    "Dark": dark,
    "Light": light
  };

  // Create the map
  map = L.map('map', {
    center: cityCoordinates["trondheim"],
    scrollWheelZoom: false,
    maxZoom: 18,
    zoom: 13,
    zoomControl: false, // Let the fullscreen control be at top, so add this afterwards
    layers: [streets]
  });

  // Add fullscreen control to the map
  L.control.fullscreen({
    position: 'topleft'
  }).addTo(map);

  // Add the zoom control to the map, beneath the fullscreen control
  L.control.zoom({
    position: 'topleft'
  }).addTo(map);

  // Add control to switch between tile layers
  L.control.layers(baseMaps, null, {
    position: 'topleft',
    collapsed: true
  }).addTo(map);

  // Add scale to the map
  L.control.scale({
    imperial: false
  }).addTo(map);
}

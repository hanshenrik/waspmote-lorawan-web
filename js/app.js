// List of devices that send data to TTN
var devices = [
  {
    'id': '02032201',
    'name': 'Elgeseter gate',
    'color': '#03A9F4',
    'hightlightColor': '#58CBFF',
    'position': {
      'lat': 63.419290,
      'lon': 10.395936
    },
    'sensors': {},
    'meta': {}
  },
  {
    'id': '02032222',
    'name': 'Waspmote',
    'color': '#56A05F',
    'hightlightColor': '#59D468',
    'position': {
      'lat': 63.429734, // 63.418838,
      'lon': 10.392224  // 10.394769
    },
    'sensors': {},
    'meta': {}
  }
];

// List of sensor data we are interested in
var sensorMap = [
  {
    'id': 'GP_CO2',
    'name': 'CO2',
    'unit': 'ppm'
  },
  {
    'id': 'IN_TEMP',
    'name': 'Internal board temperature',
    'unit': 'C'
  },
  {
    'id': 'GP_CO',
    'name': 'CO',
    'unit': 'ppm'
  },
  {
    'id': 'GP_TC',
    'name': 'Temperature',
    'unit': 'C'
  },
  {
    'id': 'GP_HUM',
    'name': 'Humidity',
    'unit': '%RH'
  },
  {
    'id': 'BAT',
    'name': 'Battery',
    'unit': '%'
  },
];

// Keep graphs in an object so we can update the data
var graphs = {};

// List of metadata we are interested in
var metaMap = ['rssi', 'dataRate', 'snr', 'frequency'];

// External website URLs
var historicalDataURL = "http://129.241.209.185:1880/api/";

$(document).ready(function () {
  drawMap();
  getLatestSensorData();
  Chart.defaults.global.responsive = true;
  getHistoricalSensorData();
  initMQTT();
});

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
      'lat': 63.418838,
      'lon': 10.394769
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

// List of metadata we are interested in
var metaMap = ['rssi', 'dataRate', 'snr', 'frequency'];

var historicalDataURL = "http://129.241.209.185:1880/api/";
var graphs = {};
var updateInterval = 30000;

$(document).ready(function () {
  Chart.defaults.global.responsive = true;
  getHistoricalSensorData();
});

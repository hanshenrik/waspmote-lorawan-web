// WebSockets variables
var mqttClient;
var mqttURL = 'ha-23.eradus.eu';
var mqttPath = '/croft';
var mqttPort = 80;
var mqttClientID = 'clientid_' + parseInt(Math.random() * 1000, 10);
var mqttUsername = 'username';
var mqttPassword = 'password';

function initMQTT() {
  // Create a client instance (client id must be unique, so make some random number)
  mqttClient = new Paho.MQTT.Client(mqttURL, mqttPort, mqttPath, mqttClientID);

  // Set callback handlers
  mqttClient.onConnectionLost = onConnectionLost;
  mqttClient.onMessageArrived = onMessageArrived;

  // Connect the client
  mqttClient.connect({
    onSuccess: onConnect,
    userName: mqttUsername,
    password: mqttPassword
  });
}

// Called when the client connects
function onConnect() {
  console.log('onConnect');

  // Subscription to topics is done after graph is drawn in drawGraph() in historical-data.js
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log('onConnectionLost: ' + responseObject.errorMessage);
  }
}

// Called when a message arrives
function onMessageArrived(message) {
  console.log(message);

  var deviceID = message.destinationName.match(/nodes\/(.*?)\//)[1];
  var payloadObject = JSON.parse(message.payloadString);

  var device = $.grep(devices, function(device) { return device['id'] === deviceID; })[0];
  var date = new Date(payloadObject['time']);
  var encodedData = payloadObject['data']; // Data is base64 encoded
  var decodedData = atob(encodedData); // atob() is a built in Base64 decoding function

  // CTT began sending on the same node address, filter out their data...
  if (decodedData.includes('NTNU_CTT_22')) {
    return;
  }

  $.each( device['sensors'], function(i, sensor) {
    var sensorID = sensor['id']; // ID used in frame
    var graphID = sensor['graphID'];

    var re = new RegExp(sensorID + ':(.*?)(?=#)');
    var match = re.exec(decodedData)
    if (match) {
      var value = parseFloat(match[1], 10)
      sensor['data'].push([date, value])
    }

    // Update the corresponding graph
    graphs[graphID].updateOptions( { 'file' : sensor['data'] } );
  })
}

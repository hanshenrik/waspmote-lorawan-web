// Create a client instance (client id must be unique, so make some random number)
var client = new Paho.MQTT.Client("ha-23.eradus.eu", 80, "/croft", "clientid_" + parseInt(Math.random() * 1000, 10));

// Set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// Connect the client
client.connect({
  onSuccess: onConnect,
  userName: "username",
  password: "password"
});

// Called when the client connects
function onConnect() {
  console.log("onConnect");

  // Subscription to topics is done after graph is drawn in drawGraph() in historical-data.js
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost: " + responseObject.errorMessage);
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

  $.each( device['sensors'], function(i, sensor) {
    var sensorID = sensor['id']; // ID used in frame
    var graphID = sensor['graphID'];

    var re = new RegExp(sensorID + ':(.*?)(?=#)');
    var match = re.exec(decodedData)
    if (match) {
      var value = parseFloat(match[1], 10)
      sensor['data'].push([date, value])
    }

    graphs[graphID].updateOptions( { 'file' : sensor['data'] } );
  })
}

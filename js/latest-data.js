function getLatestSensorData() {
  $.each( devices, function(i, device) {
    var deviceID = device['id'];

    console.log('Latest data: GET request sent for ' + deviceID);
    $.get( latestDataURL + deviceID + "/?limit=1")
      .done(function( result ) {
        console.log('Latest data: Reponse received for ' + deviceID);

        if ($.isEmptyObject(result)) {
          console.log('Latest data: Empty result for ' + deviceID + '. Skipping this device');
          return;
        }

        var frame = result[0];
        var date = new Date(frame['time']);
        var encodedData = frame['data']; // Data is base64 encoded
        var decodedData = atob(encodedData); // atob() is a built in Base64 decoding function
        var color = 'green'; // Default color of circle
        var popupText = '\
          <h3>Sensor ' + deviceID + '</h3>\
          <b>Last seen</b>: ' + date.toLocaleString('nn') + '<br />';

        $.each( sensorMap, function(j, sensor) {
          var sensorField = sensor['name'];
          var sensorID = sensor['id']; // ID used in frame
          var sensorUnit = sensor['unit'];

          var re = new RegExp(sensorID + ':(.*?)(?=#)');
          var match = re.exec(decodedData);
          if (match) {
            var value = parseFloat(match[1], 10);
            popupText += '<b>' + sensorField + '</b>: ' + value + '<br />';

            // Set the color of the circle based on CO2 level
            if (sensorField === 'CO2') {
              if (value > 300) {
                color = 'orange';
                if (value > 600) {
                  color = 'red';
                }
              }
            }
          }
        })
        var circle = L.circle(
          [device['position']['lat'], device['position']['lon']],
          150,
          {
            color: color,
            fillOpacity: 0.2,
            weight: 5,
            strokeOpacity: 1
          });
        circle.bindPopup(popupText);
        circle.addTo(map);
      })
      .fail(function() {
        console.log('Latest data: GET request failed for ' + deviceID);
      })
      .always(function() {});
  });
}

function getHistoricalSensorData() {
  $.each( devices, function(i, device) {
    var deviceID = device['id'];

    // Create spinning icon to indicate something is happening
    var $loadingDOMElement = $( '<div>' )
      .attr('class', 'loading-placeholder loading-' + deviceID)
      .html('<i class="fa fa-spinner fa-spin"></i>');

    $( '#graph-container' ).append( $loadingDOMElement );
    $( '#meta-chart-container' ).append( $loadingDOMElement.clone() );

    console.log(deviceID + ": GET request sent");
    $.get( historicalDataURL + deviceID)
      .done(function( result ) {
        console.log(deviceID + ": Data received");

        if ($.isEmptyObject(result)) {
          console.log(deviceID + ": Empty result. Skipping this device");
          return;
        }

        $.each(result, function(j, frame) {
          var date = new Date(frame['time'])
          var encodedData = frame['data'] // Data is base64 encoded
          var decodedData = atob(encodedData); // atob() is a built in Base64 decoding function

          $.each( sensorMap, function(k, sensor) {
            var sensorField = sensor['name'].toLowerCase();
            var sensorID = sensor['id']; // ID used in frame
            var sensorUnit = sensor['unit'];

            var re = new RegExp(sensorID + ':(.*?)(?=#)');
            var match = re.exec(decodedData)
            if (match) {
              if (device['sensors'][sensorField] === undefined) {
                console.log(deviceID + ": Creating list to store " + sensorField + " values");
                device['sensors'][sensorField] = {};
                device['sensors'][sensorField]['id'] = sensorID;
                device['sensors'][sensorField]['unit'] = sensorUnit;
                device['sensors'][sensorField]['data'] = [];
              }

              var value = parseFloat(match[1], 10)
              device['sensors'][sensorField]['data'].push([date, value])
            }
          })

          // Store metadata
          if (j === 0) {
            console.log(deviceID + ": Creating metadata metrics");
            $.each(metaMap, function(l, metric) {
              device['meta'][metric] = {};
            })
          }

          $.each(metaMap, function(l, metric) {
            var value = frame[metric];

            // Filter based on gateway
            // if (frame['gatewayEui'] === 'AA555A0008060252') {
            //   return;
            // }

            // Make values coarse enough that they makes sense in a chart
            if (metric === 'snr') {
              value = Math.round(value)
            }
            if (metric === 'rssi') {
              value = Math.round(value / 10) * 10
            }

            if (device['meta'][metric][value] === undefined) {
              device['meta'][metric][value] = 1;
            } else {
              device['meta'][metric][value] += 1;
            }
          })

          // Keep track of latest measurement device made
          if (j === result.length - 1) {
            device['latestMeasurement'] = date;
          }
        })

        drawGraph(device);
        drawMetaChart(device);
      })
      .fail(function() {
        console.log(deviceID + ": GET request failed!");
      })
      .always(function() {
        $('.loading-'+deviceID).remove();
      });
  });
}

function drawGraph(device) {
  $.each(device['sensors'], function(key, sensor) {
    if ($.isEmptyObject(sensor['data'])) {
      console.log(deviceID + ": Data set for "+key+" is empty, don't make graph");
      return false;
    }

    var graphID = 'graph-' + device['id'] + '-' + key;
    sensor['graphID'] = graphID;

    // Create an element for the graph
    var $graphDOMElement = $( '<div>' )
      .attr('class', 'graph')
      .attr('id', graphID);
    
    // Add the elements to the graph container
    $( '#graph-container' ).append( $('<div class="graph-wrapper"></div>').append( $graphDOMElement ) );
    
    // Create a Dygraph
    var graph = new Dygraph($graphDOMElement.get(0), sensor['data'],
      {
        title: key + ' levels at ' + device['name'],
        color: device['color'],
        legend: 'always',
        fillGraph: true,
        animatedZooms: true,
        digitsAfterDecimal: 3,
        drawPoints: true,
        yRangePad: 50,
        // includeZero: true,
        // stepPlot: true,
        // drawGapEdgePoints: true,
        // showRoller: true,
        // valueRange: [0, 420],
        labels: ['Time', 'Node ' + device['id']],
        ylabel: key + ' (' + sensor['unit'] + ')'
      });

    // Keep track of graphs so we can update them at a later point
    graphs[graphID] = graph;
  })
}

function drawMetaChart(device) {
  var data;

  $container = $( '#meta-chart-container' );
  $container.append('<div><h2>Meta data for ' + device['id'] +' (' + device['name'] + ')</h2></div>');

  $.each(device['meta'], function(metric, values) {
    var chartID = 'chart-' + device['id'] + '-' + metric;

    // Create an element for the chart
    var $chartDOMElement = $( '<canvas>' )
      .attr('class', 'chart')
      .attr('id', chartID);
    
    // Add the element to the chart container
    $innerContainer = $('<div class="meta-chart-wrapper"></div>');
    $innerContainer.append('<h3>'+metric+'</h3>')
    $container.append( $innerContainer.append( $chartDOMElement ) );

    data = {
      labels: [],
      datasets: [
        {
          label: metric,
          fillColor: device['color'],
          strokeColor: "rgba(0, 0, 0, 0.2)",
          highlightFill: device['hightlightColor'],
          highlightStroke: "rgba(0, 0, 0, 0.1)",
          data: []
        }
      ]
    };
    $.each(device['meta'][metric], function(value, count) {
      data['labels'].push(value);
      data['datasets'][0]['data'].push(count);
    });

    data['labels'].sort(sortNumber);

    var ctx = $('#'+chartID).get(0).getContext("2d");
    var options = {
      barStrokeWidth : 1
    }
    new Chart(ctx).Bar(data, options);
  });
}

function sortNumber(a,b) {
  return a - b;
}

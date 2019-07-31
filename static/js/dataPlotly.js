function actressStackedBar() {
  Plotly.d3.csv(
    "https://raw.githubusercontent.com/hone1er/oscarDataAnalysis/joe/resources/femaleActressGenresDF.csv",
    function(err, rows) {
      function unpack(rows, key) {
        return rows.map(function(row) {
          return row[key];
        });
      }

      var trace1 = {
        type: "bar",
        x: [],
        y: [],
        name: "Non-nominees",
        marker: { color: "#58508d" }
      };

      var trace2 = {
        type: "bar",
        x: [],
        y: [],
        name: "Nominees",
        marker: { color: "#ffa600" }
      };

      var actorTrace1 = {
        type: "bar",
        x: [],
        y: [],
        name: "Nominees",
        marker: { color: "#ffa600" }
      };

      var actorTrace2 = {
        type: "bar",
        x: [],
        y: [],
        name: "Nominees",
        marker: { color: "#ffa600" }
      };

      var counter = 0;
      rows.forEach(Element => {
        counter++;
        console.log(counter)
        Object.entries(Element).forEach(([key, value]) => {
          if (key.length > 0 && counter === 1) {
            trace1.y.push(value * 100);
          } else if (key.length > 0 && counter === 2) {
            trace1.x.push(key);
            trace2.x.push(key);
            trace2.y.push(value * 100);
          }
          else if (key.length > 0 && counter === 3) {
            actorTrace1.y.push(value * 100);
          }
          else if (key.length > 0 && counter === 4) {
            actorTrace1.x.push(key);
            actorTrace2.x.push(key);
            actorTrace2.y.push(value * 100);
          }
        });
      });

      var data = [trace1, trace2];
      var actorData = [actorTrace1, actorTrace2]
      var layout = {
        barmode: "stack",
        title: "Percentage by genres and nominations",
        yaxis: {
          title: "percentage (#genres/#movies)"
        },
        xaxis: {
          tickangle: 45
        },
        paper_bgcolor: "#f3f3f3",
        plot_bgcolor: "rgba(0, 0, 250, .02)"
      };

      Plotly.newPlot("actressBar", data, layout, { responsive: true });
      Plotly.newPlot("actorBar", actorData, layout, { responsive: true });
    }
  );
}



function actressHeatmap() {
  var xValues = [
    "Budget",
    "Popularity",
    "Revenue",
    "Ceremony",
    "Vote Average",
    "Vote Count"
  ];

  var yValues = [
    "Budget",
    "Popularity",
    "Revenue",
    "Ceremony",
    "Vote Average",
    "Vote Count"
  ];
  var zValues = [
    [1.0, 0.40736, 0.74514, 0.19478, 0.08429, 0.59705],
    [0.40736, 1.0, 0.6341, 0.0887, 0.21345, 0.67389],
    [0.74514, 0.6341, 1.0, 0.13456, 0.20161, 0.80931],
    [0.19478, 0.0887, 0.13456, 1.0, 0.05982, 0.11713],
    [0.08429, 0.21345, 0.20161, 0.05982, 1.0, 0.3243],
    [0.59705, 0.67389, 0.80931, 0.11713, 0.3243, 1.0]
  ];

  var data = [
    {
      x: xValues,
      y: yValues,
      z: zValues,
      type: "heatmap",
      showscale: false
    }
  ];

  var layout = {
    paper_bgcolor: "#f3f3f3",
    title: "Category Correlation",
    annotations: [],
    xaxis: {
      ticks: "",
      side: "top"
    },
    yaxis: {
      ticks: "",
      ticksuffix: " ",
      tickangle: 45,
      width: 700,
      height: 700,
      autosize: false
    }
  };

  for (var i = 0; i < yValues.length; i++) {
    for (var j = 0; j < xValues.length; j++) {
      var currentValue = zValues[i][j];
      if (currentValue != 0.0) {
        var textColor = "white";
      } else {
        var textColor = "black";
      }
      var result = {
        xref: "x1",
        yref: "y1",
        x: xValues[j],
        y: yValues[i],
        text: zValues[i][j],
        font: {
          family: "Arial",
          size: 12,
          color: "rgb(50, 171, 96)"
        },
        showarrow: false,
        font: {
          color: textColor
        }
      };
      layout.annotations.push(result);
    }
  }

  Plotly.newPlot("myDiv2", data, layout, { responsive: true });
}

actressStackedBar()
actressHeatmap();

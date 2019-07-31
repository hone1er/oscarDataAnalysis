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
      var counter = 0;
      console.log(rows);
      rows.forEach(Element => {
        counter++;
        console.log(counter);
        Object.entries(Element).forEach(([key, value]) => {
          if (key.length > 0 && counter === 1) {
            trace1.y.push(value * 100);
          } else if (key.length > 0 && counter === 2) {
            trace1.x.push(key);
            trace2.x.push(key);
            trace2.y.push(value * 100);
          }
        });
      });

      var data = [trace1, trace2];
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
    }
  );
};

function actorStackedBar() {
  Plotly.d3.csv(
    "https://raw.githubusercontent.com/hone1er/oscarDataAnalysis/joe/resources/actorLeadingRole.csv",
    function(err, rows) {
      function unpack(rows, key) {
        return rows.map(function(row) {
          return row[key];
        });
      }

      var actorTrace1 = {
        type: "bar",
        x: [],
        y: [],
        name: "Non-nominees",
        marker: { color: "#58508d" }
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
        console.log(counter);
        Object.entries(Element).forEach(([key, value]) => {
          if (key.length > 0 && counter === 1) {
            actorTrace1.y.push(value * 100);
          } else if (key.length > 0 && counter === 2) {
            actorTrace1.x.push(key);
            actorTrace2.x.push(key);
            actorTrace2.y.push(value * 100);
          }
        });
      });

      var actorData = [actorTrace1, actorTrace2];
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

      Plotly.newPlot("actorBar", actorData, layout, { responsive: true });
    }
  );
};

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
    [1.0, 0.407, 0.745, 0.194, 0.084, 0.597],
    [0.407, 1.0, 0.63, 0.08, 0.213, 0.673],
    [0.745, 0.63, 1.0, 0.134, 0.201, 0.809],
    [0.194, 0.08, 0.134, 1.0, 0.059, 0.117],
    [0.084, 0.213, 0.201, 0.059, 1.0, 0.32],
    [0.597, 0.673, 0.809, 0.117, 0.32, 1.0]
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
};

actressStackedBar();
actorStackedBar();
actressHeatmap();

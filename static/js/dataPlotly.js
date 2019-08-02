const actressCSV =
  "https://raw.githubusercontent.com/hone1er/oscarDataAnalysis/joe/resources/femaleActressGenresDF.csv";
const actorCSV =
  "https://raw.githubusercontent.com/hone1er/oscarDataAnalysis/joe/resources/actorLeadingRole.csv";
const bechdelCSV =
  "https://raw.githubusercontent.com/hone1er/oscarDataAnalysis/joe/resources/forJoe.csv";

function stackedBar(
  csv,
  title,
  xtitle,
  trace1name,
  trace2name,
  div,
  marker1 = "#58508d",
  marker2 = "#ffa600"
) {
  Plotly.d3.csv(csv, function(err, rows) {
    function unpack(rows, key) {
      return rows.map(function(row) {
        return row[key];
      });
    }

    var actorTrace1 = {
      type: "bar",
      x: [],
      y: [],
      name: trace1name,
      marker: { color: marker1 }
    };

    var actorTrace2 = {
      type: "bar",
      x: [],
      y: [],
      name: trace2name,
      marker: { color: marker2 }
    };

    var counter = 0;
    rows.forEach(Element => {
      counter++;
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
      title: title,
      yaxis: {
        title: xtitle
      },
      xaxis: {
        tickangle: 45
      },
      paper_bgcolor: "#f3f3f3",
      plot_bgcolor: "rgba(0, 0, 250, .02)"
    };

    Plotly.newPlot(div, actorData, layout, { responsive: true });
  });
}

function heatmap(values, z, div) {
  let zValues = z;

  let axisValues = values;

  var data = [
    {
      x: axisValues,
      y: axisValues,
      z: zValues,
      type: "heatmap",
      showscale: true
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
      tickangle: -45,
      width: 700,
      height: 700,
      autosize: false
    }
  };

  for (var i = 0; i < axisValues.length; i++) {
    for (var j = 0; j < axisValues.length; j++) {
      var currentValue = zValues[i][j];
      if (currentValue != 0.0) {
        var textColor = "white";
      } else {
        var textColor = "black";
      }
      var result = {
        xref: "x1",
        yref: "y1",
        x: axisValues[j],
        y: axisValues[i],
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

  Plotly.newPlot(div, data, layout, { responsive: true });
}

const actressZValues = [
  [1.0, 0.407, 0.745, 0.194, 0.084, 0.597],
  [0.407, 1.0, 0.63, 0.08, 0.213, 0.673],
  [0.745, 0.63, 1.0, 0.134, 0.201, 0.809],
  [0.194, 0.08, 0.134, 1.0, 0.059, 0.117],
  [0.084, 0.213, 0.201, 0.059, 1.0, 0.32],
  [0.597, 0.673, 0.809, 0.117, 0.32, 1.0]
];

const actorZValues = [
  [1.0, 0.527, 0.729, 0.192, 0.039, 0.537],
  [0.527, 1.0, 0.696, 0.29, 0.361, 0.866],
  [0.729, 0.696, 1.0, 0.222, 0.207, 0.747],
  [0.192, 0.29, 0.222, 1.0, 0.496, 0.264],
  [0.039, 0.361, 0.207, 0.496, 1.0, 0.349],
  [0.537, 0.866, 0.747, 0.264, 0.349, 1.0]
];

const values = [
  "Budget",
  "Popularity",
  "Revenue",
  "Ceremony",
  "Vote Average",
  "Vote Count"
];

stackedBar(
  actorCSV,
  "Percentage by genres and nominations",
  "percentage (#genres/#movies)",
  "Non-nominees",
  "Nominees",
  actorBar
);
stackedBar(
  actressCSV,
  "Percentage by genres and nominations",
  "percentage (#genres/#movies)",
  "Non-nominees",
  "Nominees",
  actressBar
);
stackedBar(
  bechdelCSV,
  "Bechdel Test",
  " ",
  "Fail",
  "Pass",
  bechdel,
  "#bc5090",
  "#2f4b7c"
);
heatmap(values, actressZValues, "actressHeatmap");
heatmap(values, actorZValues, "actorHeatmap");

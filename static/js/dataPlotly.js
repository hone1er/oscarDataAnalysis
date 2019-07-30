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
    rows.forEach(Element => {
      counter++;
      Object.entries(Element).forEach(([key, value]) => {
        if (key.length > 0 && counter === 1) {
          console.log(key, value, "first");
          trace1.y.push(value * 100);
        } else if (key.length > 0 && counter === 2) {
          console.log(key, value, "second");
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

    Plotly.newPlot("myDiv", data, layout, { responsive: true });
  }
);



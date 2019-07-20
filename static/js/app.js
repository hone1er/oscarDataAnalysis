AOS.init();

function movieTitle() {
  // Grab the movie title from the html form and return as a string with title capitaliztion.
  var selector = d3.select("#movie");
  var text = selector.property("value");
  text = text
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  return text;
}

function callAPI(movie) {
  // Separated API call to avoid multiple calls when building the dashboard.
  var url = `/graph/${movie}`;
  var response = d3.json(url).then(function(response) {
    return response;
  });
  return response;
}

function buildBarChart(movie, apiCall) {
  apiCall.then(function(response) {
    var trace1 = {
      x: ["Budget"],
      y: [response.budget[movie]],
      name: "Budget",
      type: "bar",
      marker: {
        color: "#990d0d"
      }
    };

    var trace2 = {
      x: ["Revenue"],
      y: [response.revenue[movie]],
      name: "Revenue",
      type: "bar",
      marker: {
        color: "#c5b358"
      }
    };

    var data = [trace1, trace2];

    var layout = {
      title: movie,
      titlefont: {
        size: 34,
        family: "roboto",
        color: "#2a2a2a"
      },
      barmode: "group",
      yaxis: {
        tickformat: "$,",
        tickangle: "42",
        ticks: "inside",
        ticklen: "3"
      },
      xaxis: {
        title: "Budget vs Revenue",
        titlefont: {
          family: "roboto",
          size: 22,
          color: "#2a2a2a"
        },
        tickangle: "auto",
        tickfont: {
          family: "roboto",
          size: 18,
          color: "#2a2a2a"
        }
      }
    };
    Plotly.newPlot("myDiv", data, layout, { responsive: true });
  });
}

// Creates the table below the bar chart showing the stats for the movie
function addTable(movie, apiCall) {
  // Check if the table already exists and remove it if it does.
  if (document.contains(document.getElementById("tabled"))) {
    document.getElementById("tabled").remove();
  }
  apiCall.then(function(data) {
    var table = d3
      .select("#table")
      .append("table")
      .attr("id", "tabled");
    var tbody = table.append("tbody");
    var header = table.append("thead").append("tr");
    header
      .selectAll("th")
      .data([
        "Release Date",
        "Budget",
        "Revenue",
        "Popularity",
        "Vote Average",
        "Vote Count"
      ])
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });
    var row = tbody.append("tr");
    Object.entries(data).forEach(([key, value]) => {
      var cell = tbody.append("td");
      cell.text(value[movie].toLocaleString());
    });
  });
};

function doAll() {
  d3.event.preventDefault();
  const movie = movieTitle();
  const response = callAPI(movie);
  buildBarChart(movie, response);
  addTable(movie, response);
}

var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", doAll);
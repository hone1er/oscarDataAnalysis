// Initiates Animate On Scroll
AOS.init();

function movieName() {
  /**
 /* @return {string} */
  const selector = d3.select("#movie");
  const movie = selector.property("value");
  return movie;
}

function callAPI(movie) {
  // Separated API call to avoid multiple calls when building the dashboard.
  /**
 * @param {string=} movie
 /* @return {Object} */

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
      width: [0.4],
      name: "Budget",
      type: "bar",
      marker: {
        color: "#990d0d",
        opacity: 0.85
      }
    };

    var trace2 = {
      x: ["Revenue"],
      y: [response.revenue[movie]],
      width: [0.4],
      name: "Revenue",
      type: "bar",
      marker: {
        color: "#c5b358",
        opacity: 0.85
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
    Plotly.newPlot("barChart", data, layout, { responsive: true });
  });
}

function addTable(movie, apiCall) {
  /**
   // Creates the table below the bar chart showing the stats for the movie
   * @param {string=} movie
   * @param {Object=} apiCall
 /* @return {} */

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
        "Vote Count",
        "Genre(s)"
      ])
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });
    var row = tbody.append("tr");
    Object.entries(data).forEach(([key, value]) => {
      console.log(key);

      var genres = [];
      if (key === "genres") {
        var cell = tbody.append("td");
        eval(value[movie]).forEach(element => {
          console.log(element.name);
          genres.push(" " + element.name);
        });
        cell.text(genres);
      } else if (key === "overview") {
        if (document.contains(document.getElementById("description"))) {
          document.getElementById("description").remove();
        }
        var description = d3
          .select("#dashboard")
          .append("div")
          .lower()
          .attr("id", "description")
          .attr("class", "description");

        var header = d3.select("#description")
        .append("h2")
        .text("OVERVIEW")
        var paragraph = d3
          .select("#description")
          .append("p")
          .attr("style", "color: #2a2a2a")
          .text(value[movie]);
      } else {
        var cell = tbody.append("td");
        cell.text(value[movie].toLocaleString());
      }
    });
  });
}

function starRating(movie, response) {
  /**
 * @param {string=} movie
 * @param {Object=} apiCall
 /* @return {} */

  if (document.contains(document.getElementById("star"))) {
    document.getElementById("star").remove();
  }
  const rate = response.then(function(rate) {
    var table = d3
      .select("#starRating")
      .append("table")
      .attr("id", "star");
    var tbody = table.append("tbody");
    var header = table.append("thead").append("tr");
    header
      .selectAll("th")
      .data(["Movie", "Rating"])
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });
    var row = tbody.append("tr").attr("class", "hotel_a");
    Object.entries(rate).forEach(([key, value]) => {
      if (key == "vote_average") {
        var text = [movie, value[movie].toLocaleString()];
        var counter = 0;
        text.forEach(element => {
          if (counter === 0) {
            var cell = row.append("td");
            cell.text(element);
            counter++;
          } else if (counter === 1) {
            var cell = row
              .append("td")
              .append("div")
              .attr("class", "stars-outer");
            var outer = cell.append("div").attr("class", "stars-inner");
            var score = rate.vote_average[movie] / 2;
            const ratings = {
              hotel_a: score
            };
            // total number of stars
            const starTotal = 5;

            for (const rating in ratings) {
              const starPercentage = (ratings[rating] / starTotal) * 100;
              const starPercentageRounded = `${Math.round(starPercentage / 10) *
                10}%`;
              document.querySelector(
                `.${rating} .stars-inner`
              ).style.width = starPercentageRounded;
            }
          }
        });
      }
    });
  });
}

function doAll() {
  d3.event.preventDefault();
  const movie = movieName();
  const response = callAPI(movie);
  starRating(movie, response);
  buildBarChart(movie, response);
  addTable(movie, response);
  d3.select(".charts")
  .attr("style","display: block");
}

const filterbtn = d3.select("#filter-btn");
filterbtn.on("click", doAll);

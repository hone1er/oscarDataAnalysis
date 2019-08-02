function movieName() {
  /**
 /* @return {string} */

  const selector = d3.select("#selDataset");
  const movie = selector.property("value");
  return movie;
}

function callAPI(movie) {
  // Separated API call to avoid multiple calls when building the dashboard.
  /**
 * @param {string=} movie
 /* @return {Object} */

  const url = `/graph/${movie}`;
  const response = d3.json(url).then(function(response) {
    return response;
  });
  return response;
}

function buildBarChart(movie, apiCall) {
  /**
   * @param {string=} movie
   * @param {object=} apiCall
  /* Creates a graph using Plotly.js */

  apiCall.then(function(response) {
    const trace1 = {
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

    const trace2 = {
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

    const data = [trace1, trace2];

    const layout = {
      paper_bgcolor: "#f3f3f3",
      plot_bgcolor: "rgba(0, 0, 250, .02)",
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
    const table = d3
      .select("#table")
      .append("table")
      .attr("id", "tabled");
    const tbody = table.append("tbody");
    const header = table.append("thead").append("tr");
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
      .attr("style", "font-family: Roboto")
      .text(function(d) {
        return d;
      });
    const row = tbody.append("tr");
    Object.entries(data).forEach(([key, value]) => {
      const genres = [];
      if (key === "genres") {
        const cell = tbody.append("td");
        eval(value[movie]).forEach(element => {
          genres.push(" " + element.name);
        });
        cell.text(genres);
      } else if (key === "overview") {
        if (document.contains(document.getElementById("description"))) {
          document.getElementById("description").remove();
        }
        const description = d3
          .select("#dashboard")
          .append("div")
          .lower()
          .attr("id", "description")
          .attr("class", "description");

        const header = d3
          .select("#description")
          .append("h2")
          .text("OVERVIEW");
        const paragraph = d3
          .select("#description")
          .append("p")
          .attr("style", "color: #2a2a2a")
          .text(value[movie]);
      } else {
        const cell = tbody.append("td");
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
    const table = d3
      .select("#starRating")
      .append("table")
      .attr("id", "star");
    const tbody = table.append("tbody");
    const header = table.append("thead").append("tr");
    header
      .selectAll("th")
      .data(["Movie", "Rating"])
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });
    const row = tbody.append("tr").attr("class", "hotel_a");
    Object.entries(rate).forEach(([key, value]) => {
      if (key == "vote_average") {
        const text = [movie, value[movie].toLocaleString()];
        let counter = 0;
        text.forEach(element => {
          if (counter === 0) {
            const cell = row.append("td");
            cell.text(element);
            counter++;
          } else if (counter === 1) {
            const cell = row
              .append("td")
              .append("div")
              .attr("class", "stars-outer");
            const outer = cell.append("div").attr("class", "stars-inner");
            const score = rate.vote_average[movie] / 2;
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
  d3.select(".charts").attr("style", "display: block");
}

const filterbtn = d3.select("#filter-btn");
filterbtn.on("click", doAll);

// Scroll on Click
$(function() {
  $("a[href*=#]:not([href=#])").click(function() {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      let target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html,body").animate(
          {
            scrollTop: target.offset().top
          },
          500
        );
        return false;
      }
    }
  });
});

AOS.init();

function buildBarChart() {
    d3.event.preventDefault();
    // Grab the value from the form and make a d3.json request to the API in order to build traces and layout for line graph
    var selector = d3.select("#movie");
    var text = selector.property("value");
    text = text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
    var url = `/graph/${text}`;
    d3.json(url).then(function(response){
        var trace1 = {
            x: [text],
            y: [response.budget[text]],
            name: 'Budget',
            type: 'bar',
            marker: {
                color: '#990d0d'
            }
        };
        
        var trace2 = {
            x: [text],
            y: [response.revenue[text]],
            name: 'Revenue',
            type: 'bar',
            marker: {
                color: '#c5b358'
              }
        };
        
        var data = [trace1, trace2];
    
        var layout = {
            barmode: 'group',
            yaxis: {
                tickformat: ',',
                tickangle: '45',
            }};
        
        Plotly.newPlot('myDiv', data, layout, {responsive: true});
    });
};

// Creates the table below the bar chart showing the stats for the movie
function addTable() {
    d3.event.preventDefault();
    // Check if the table already exists and remove it if it does.
    if (document.contains(document.getElementById("tabled"))) {
        document.getElementById("tabled").remove();
}
    var table = d3.select("#table")
    .append("table")
    .attr("id", "tabled");
    var tbody = table.append("tbody");
    var selector = d3.select("#movie");
    var text = selector.property("value");
    text = text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
    var url = `/graph/${text}`;

    d3.json(url).then(function(data){
        console.log(data.vote_average[text])
        var header = table.append("thead").append("tr");
        header
                .selectAll("th")
                .data(["Release Date", "Budget", "Revenue", "Popularity", "Vote Average", "Vote Count"])
                .enter()
                .append("th")
                .text(function(d) { return d; });
        var row = tbody.append("tr");
        Object.entries(data).forEach(([key, value]) => {
            console.log(key, value)
            var cell = tbody.append("td");
            cell.text(value[text]);
    });
});
}


function doAll() {
    buildBarChart();
    addTable();
};

var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", doAll);
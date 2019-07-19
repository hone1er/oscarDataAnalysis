AOS.init();

function buildLineGraph() {
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
        console.log(response.budget[text])
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

var filterbtn = d3.select("#filter-btn");
filterbtn.on("click", buildLineGraph);
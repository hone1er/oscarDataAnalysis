Plotly.d3.csv(
    "femaleActressGenresDF.csv",
    function(err, rows) {
      function unpack(rows, key) {
        return rows.map(function(row) {
          return row[key];
        });
      }
  console.log(rows)
    }
  )
  
  var data = [
    {
      type: 'bar',
      x: ['2016','2017','2018'],
      y: [500,600,700],
      base: [-500,-600,-700],
      marker: {
        color: 'red'
      },
      name: 'expenses'
    },
    {
      type: 'bar',
      x: ['2016','2017','2018'],
      y: [300,400,700],
      base: 0,
      marker: {
        color: 'blue'
      },
      name: 'revenue'
    }]
  
  Plotly.newPlot('myDiv', data);
  
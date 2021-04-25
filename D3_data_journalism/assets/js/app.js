// SVG dimensions
var svgWidth = 960;
var svgHeight = 500;

// SVG margin dimensions
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Uses d3 to set the csv into stateData
d3.csv("data.csv").then(function(stateData) {

    // Parse Data/Cast as numbers

    stateData.forEach(function(data) {
      data.id = +data.id;
      data.state = +data.state;
      data.abbr = +data.abbr;
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    // Setting the x and y scale for the axis, using the min and max to zoom and center the data in the chart
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.poverty) - 1, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d.obesity) - 1, d3.max(stateData, d => d.obesity)])
        .range([height, 0]);

    // Setting and x and y axis to the scales made above
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Appending the chart with the axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);



    // Appending the chart with the circle group, made from x,y dictated by poverty and obesity     
    var circleGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("class", "stateCircle")
        .attr("opacity", ".5");
        




        // SHOULD set text in each circle to state abbr, why does this not work?
        circleGroup.append("text")
        .text(function(d){
          return d.abbr
        }) 
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        .attr("class", "stateText")
        .attr("dy", +4)
        .attr("font-size", 10)
        .attr("alignment-baseline", "central")




    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity %");
  
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty %");



}).catch(function(error) {
        console.log(error);
});
d3.csv("../data/gtrSales.csv", d3.autoType).then(data => { //passing in data to arrays & objects
    console.log(data); //check data is pulling via console

    const svg = d3.selectAll("#my-svg"), //reference svg div id
    width = +svg.attr('width'), // reference svg width in html
    height = +svg.attr('height'), // reference svg height in html
    margin = ({top: 20, bottom: 40, left: 50, right: 20}), //margins in svg container
    innerWidth = width - margin.left - margin.right, //inner width in svg container
    innerHeight = height - margin.top - margin.bottom; //inner height in svg container

    const xScale = d3.scaleLinear() //function to create an instance of d3 linear scale
    .domain([0, d3.max(data, d => d.sales)]) //minimum to maximum values 
    .range([0, innerWidth]); //fit in relatively to allowable view

    const yScale = d3.scaleBand() //function to create an instance of d3 linear scale / ordinal values
    .domain(data.map(d => d.year))
    .range([0, innerHeight]) //data elements from top to bottom
    .padding(0.2); //padding between bars

    const rec = svg
    .selectAll("rect") //generate rectangles for bar graphs
    .data(data) //pass in data array
    .enter()
    .append("rect") //new rectangle
    .attr('y', d => yScale(d.year)) //creates multiple rows
    .attr("width", d => xScale(d.sales)) //give rectangle width
    .attr("height", yScale.bandwidth()) //width of single bar
//    .attr("fill", "steelblue") //Color of bars
    .attr("fill", "rgba(171,17,47, 0.6)") //Color of bars

    const text = svg
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("class", "label") // text in the center of the bar
    .attr("y", d => yScale(d.year) + (yScale.bandwidth() / 2))
    .attr("x", d => xScale(d.sales))
    .text(d => d.sales)
    .attr("dx", "1.25em")
    .attr("fill", "white") //Color of bars

    svg
    .append("g")
    .attr("transform","translate(0,450)") //This controls the horizontal position of the axis elements 
    .call(d3.axisBottom(xScale));

    svg
    .append("g")
    .attr("transform", "translate(35,0)")      // This controls the vertical position of the Axis elements
    .call(d3.axisLeft(yScale));

});
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

let svg;
let xScale;
let yScale;

let state = {
  data: [],
  selection: "All"
};

d3.json("../data/data.json", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  state.data = raw_data;
  console.log("state", state)
  init();
});

function init() {

const selectElement = d3.select("#dropdown").on("change", function() {
  state.selection = this.value
  console.log("new value is", this.value);
  console.log(state)
  draw();
});

selectElement
  .selectAll("option")
    .data(["All", "September", "August", "July"])  //Wow make sure your data has no hidden spaces or padding
  .join("option")
    .attr("value", d => d)
    .text(d => d);

svg = d3.select("#d3-container")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

xScale = d3.scaleLinear()
  .domain([0, 1000])
  .range([margin.left, width - margin.right]);

yScale = d3.scaleLinear()
  .domain([0, 160])
  .range([height - margin.bottom, margin.top]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg // add the xAxis
  .append("g")
  .attr("class", "myX-axis")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("x", "50%")
  .attr("dy", "3em")
  .text("Turnaround Time Metrics (Collection to Completed (minutes))");

svg //add the yAxis
  .append("g")
  .attr("class", "myY-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("y", "50%")
  .attr("dx", "-3em")
  .attr("writing-mode", "vertical-rl")
  .text("Result Value");
  draw();
}
function draw() {

let filteredData = state.data
  if (state.selection !== "All") {
    filteredData = state.data.filter(d => d.monthOrder === state.selection)
  }

console.log(filteredData)

const dot = svg.selectAll(".dot")
    .data(filteredData, d => d.specimenID)
    .join(
      enter => enter
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d["tatMin"]))
      .attr("cy", d => yScale(d["result"]))
      .attr("r", 7)
      .style("opacity", 0.3)
      .style("stroke", "white")
      .attr("fill", d => {
        if (d.tatMin > 240) return "#4B584F";
        else if (d.tatMin <= 60) return "#FBE7DE";
        else return "#DCD19C";
      })
      .attr("r", radius)
      .attr("cy", d => yScale(d.result))
      .attr("cx", d => margin.left) // initial value - to be transitioned
      .call(enter =>
        enter
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(4000)
        .attr("cx", d => xScale(d.tatMin))
      ),

        update => update.call(update =>
        update
          .transition()
          .duration(250)
          .attr("stroke", "black")
          .transition()
          .duration(250)
          .attr("stroke", "lightgrey")
      ),
        exit =>
        exit.call(exit =>
          exit
            .transition()
            .delay(d => 50 * d.result)
            .duration(500)
            .attr("cx", width)
            .remove()
      ),
  );
   
}
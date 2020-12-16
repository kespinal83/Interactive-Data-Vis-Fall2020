export function chart3() {
  const width = window.innerWidth * 0.7,
  height = window.outerHeight * 0.7,
  margin = { top: 30, bottom: 40, left: 60, right: 60 },
  radius = 4, time = 3000,
//  default_selection = "Dataset1";
  default_selection = "";

let svg
let xScale
let yScale
let yAxis;

//let state = {data: [], selectedAnalysis: "Dataset1"};
let state = {data: [], selectedAnalysis: ""};

d3.csv("../data/annualDataJDM.csv", d => ({
  year: new Date(d.Year, 0, 1),
  analysis_: d.Analysis,
  mean: +d.Mean}))
    .then(data => {
      console.log("data", data)
      state.data = data
      init()});

function init() {
  xScale = d3
    .scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right])
    .nice();

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.mean)])
    .range([height - margin.bottom, margin.top])
    .nice();

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);
  
const selectElement = d3.select("#dropdown")
    .on("change", function() {
      console.log("new selected entity is", this.value);
      state.selectedAnalysis = this.value;
      draw()
    });
  
  selectElement
    .selectAll("option")
    .data([...Array.from(new Set(state.data.map(d => d.analysis_))),
      default_selection])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  selectElement.property("value", default_selection);

  svg = d3
    .select("#d3-container-3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    svg // addition of the xAxis and its attributes
    .append("g")
    .attr("class", "myX-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", "axis-label")
    .attr("x", "50%")
    .attr("dy", "3em")
    .text("Years");
  
  svg //addition of the yAxis and its attributes
  .append("g")
  .attr("class", "myY-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("y", "50%")
  .attr("dx", "-3em")
  .attr("writing-mode", "vertical-rl")
  .text("Popularity Scale");

    var areaGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id","areaGradient")
    .attr("x1", "0%").attr("y1", "0%")
    .attr("x2", "0%").attr("y2", "100%");

    areaGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#831a1e")
    .attr("stop-opacity", .9);

    areaGradient.append("stop")
    .attr("offset", "90%")
    .attr("stop-color", "#831a1e")
    .attr("stop-opacity", 0);

  draw()
}

function draw() {
  let filteredData = [];
    if (state.selectedAnalysis !== null) {
      filteredData = state.data.filter(d => d.analysis_ === state.selectedAnalysis)
    }

  yScale.domain([0, d3.max(filteredData, d => d.mean)]);

  const lineFunc = d3
    .area()
    .x(d => xScale(d.year))
    .y(d => yScale(d.mean))
    .y1(yScale(0));
  
  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.year)
    .join(
      enter =>
        enter
          .append("circle")
          .attr("class", "dot")
          .attr("r", radius)
          .attr("cy", d => yScale(d.mean)) 
          .attr("cx", d => xScale(d.year))
          .attr("fill", "#34279b")
          .attr("stroke", "#e8d8bf")
          .attr("stroke-width", .5)
          .on("mouseover", function (d) {
            d3.select(this)
              .transition()
              .duration(time)
              .attr("r", 3*radius)
            div.transition()
              .duration(time)
              .style("opacity", .8)
          })
    
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(time)
              .attr("r", radius)
            div.transition()
              .duration(time)
              .style("opacity", 0)
          }),
          update => update,
      exit =>
        exit.call(exit =>
          exit.remove())
    )
    .call(
      selection => 
        selection
          .transition()
          .duration(time) 
          .attr("cy", d => yScale(d.mean)) 
    );

  const line = svg
    .selectAll("path.trend")
    .data([filteredData])
    .join(
      enter => 
        enter
          .append("path")
          .style("fill", "url(#areaGradient)"),
        update => update, 
        exit => exit.remove()
    )
    .call(selection =>
      selection
        .transition() 
        .duration(time)
        .attr("d", d => lineFunc(d))  
    )
}
}
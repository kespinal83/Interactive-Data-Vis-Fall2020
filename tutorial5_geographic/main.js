const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 }

let svg;

let state = {
  geojson: null,
  shootings: null,
  hover: {
    latitude: null,
    longitude: null,
    state: null,
  },
};

Promise.all([
  d3.json("../data/usState.geojson"),
  d3.json("../data/fatalPS.geojson"),
]).then(([geojson, shootings]) => {
  state.geojson = geojson;
  state.shootings = shootings;
  console.log(state)
  init();
});

function init() {
const projection = d3.geoAlbersUsa().fitSize([width, height], state.geojson);
//const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
const path = d3.geoPath().projection(projection);

svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(d3.zoom().on("zoom", function () {
  svg.attr("transform", d3.event.transform)
}));

//svg = d3  //Exploring with Canvas - only works if no updates are needed
//   .select("#d3-container")  //Exploring with Canvas
   
//const chart = svg //Exploring with Canvas
//   .append("canvas") //Exploring with Canvas
//   .attr("width", width) //Exploring with Canvas
//   .attr("height", height) //Exploring with Canvas
//   .call(d3.zoom().on("zoom", function () { //Exploring with Canvas
//     svg.attr("transform", d3.event.transform) //Exploring with Canvas
//  })); //Exploring with Canvas

//    var context = chart.node().getContext("2d"); //Exploring with Canvas

// Fonts


    svg //draw the USofA
    .selectAll(".state")
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "state")
    .attr("fill", "transparent")
    .on("mouseover", d => {
      state.hover["state"] = d.properties.NAME; // when the mouse rolls over this feature, display coordinates
      draw(); 
    });

    svg
    .selectAll("circle")
    .data(state.shootings.features)
    .join(
      enter => enter
        .append("circle")
        .attr("fill", "transparent")
        .style("opacity",0.0)
        .style("stroke", "white")
        .attr("r", 2)
        .transition()
          .attr("fill", "red")
          .style("opacity",0.2)
          .delay(function(d,i){return(i*2)})
          .duration(2000)
          .attr("cx",function(d) { return projection(d.geometry.coordinates)[0]})
          .attr("cy",function(d) { return projection(d.geometry.coordinates)[1]})
        .call(enter => enter),
          update => update.call(update => update),
          exit => exit.call(exit => exit)
          .remove()
        
    .on("mouseover",function(d) {
    	  console.log("just had a mouseover", d3.select(d));
        d3.select(this)
          .classed("active",true)
        })

  	.on("mouseout",function(d){
        d3.select(this)      	
        .classed("active",false)
        }),

    svg.on("mousemove", () => {
        const [mx, my] = d3.mouse(svg.node());
        const proj = projection.invert([mx, my]);
        state.hover["longitude"] = proj[0];
        state.hover["latitude"] = proj[1];
      draw();
    })),
  
    draw();
  }
  
  function draw() {
    hoverData = Object.entries(state.hover);
  
    d3.select("#hover-content")
      .selectAll("div.row")
      .data(hoverData)
      .join("div")
      .attr("class", "row")
      .html(
        d =>
          d[1]
            ? `${d[0]}: ${d[1]}`
            : null
      );
  }
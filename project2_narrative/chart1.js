export function chart1() {

var w = outerWidth;
var h = outerHeight;
var config = {
    speed: .01,
    verticalTilt: -35,
    horizontalTilt: 0
    }

var svg = d3.select("#d3-container-1")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .style("background-color","#transparent")
  .attr("viewBox", "0 0 " + w + " " + h)
  .classed("svg-content", true);

var projection = d3.geoOrthographic()
  .translate([w/2, h/2])
  .scale(500)
  .center([0,0]);
  //var projection = d3.geoMercator().translate([w/2, h/2]).scale(250).center([0,40]);
  var path = d3.geoPath().projection(projection);

drawGraticule();
enableRotation(); 

// load data  
//var worldmap = d3.json("../../data/world.geojson");
var worldmap = d3.json("../../data/worldlr.json")
console.log("worldmap", worldmap);

function drawGraticule() {
  const graticule = d3
   .geoGraticule()
   .step([10, 10]);
       svg.append("path")
          .datum(graticule)
          .attr("class", "graticule")
          .attr("d", path)
          .style("fill", "#fff")
          .style("stroke", "#ccc")
  }
  
  function enableRotation() {
       d3.timer(function (elapsed) {projection.rotate([config.speed * elapsed - 100, config.verticalTilt, config.horizontalTilt]);
       svg
          .selectAll("path")
          .attr("d", path)
          });
  }

  Promise.all([worldmap]).then(function(values){ 
        // draw map
          svg.selectAll("path")
              .data(values[0].features)
              .enter()
              .append("path")
              .attr("class","continent")
              .attr("d", path)
              .style("fill", "transparent")
              .call(enter=> enter
                .transition()
                .delay(function(d,i){return(i*3)})
                .duration(10000)
                .style("fill", d => {
                  if (d.properties.gdp_md_est == "2") return "#831a1e";
                  else if (d.properties.gdp_md_est == "1") return "#34279b";
                  else return "transparent";
              })
              );
          }); 

}

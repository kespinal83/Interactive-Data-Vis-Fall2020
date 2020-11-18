const width = 600;
const height = 600;
  config = {
  speed: 0.01,
  verticalTilt: -35,
  horizontalTilt: 0
  }

let locations = [];

const svg = d3
 .select('svg')
 .attr('width', width)
 .attr('height', height);

const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

 drawGlobe();    
 drawGraticule();
 enableRotation();  

function drawGlobe() {d3
 .queue()
 .defer(d3.json, '../data/110m.json')          
 .defer(d3.json, '../data/Locations.json')
 .await((error, worldData, locationData) => {
     svg.selectAll(".segment")
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter()
        .append("path")
        .attr("class", "segment")
        .attr("d", path)
        .style("stroke", "#888")
        .style("stroke-width", "1px")
        .style("fill", (d, i) => '#9ba59d')
        .style("opacity", ".4");
     locations = locationData;
        drawMarkers();           
    });
}

function drawGraticule() {
const graticule = d3
 .geoGraticule()
 .step([10, 10]);
     svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
}

function enableRotation() {
     d3.timer(function (elapsed) {projection.rotate([config.speed * elapsed - 100, config.verticalTilt, config.horizontalTilt]);
     svg
        .selectAll("path")
        .attr("d", path);
        drawMarkers();
        });
}

var radiusScale = d3.scaleSqrt()
    .domain([0, 10000000000])
    .range([0, 300]);

function drawMarkers() {
    const markers = markerGroup
        .selectAll('circle')
        .data(locations);
    markers
        .enter()
        .append('circle')
        .style("opacity",0.5)
        .merge(markers)
//        .transition()  // I tried animation however with globe rotation animation it seems to constantly try to "catch up" with final point destination
//        .delay(function(d,i){return(i*1)})
//        .duration(200)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('fill', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : '#323b2a';
        })
          .attr("r", function(d) { return radiusScale(d.max_pop)})
          .style("stroke", "white");
        ;

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
        });
}


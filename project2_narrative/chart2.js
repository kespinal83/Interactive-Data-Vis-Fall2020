export function chart2() {
  d3.csv("../../data/jdm.csv").then(data => {
    console.log("data", data);

    const table = d3.select("#d3-container-2");

    const thead = table.append('thead');
    thead
        .append("tr")
        .append("th")
        .attr("colspan", '8')
        .text("Top JDM Vehicles OEM Specifications")

    thead
        .append('tr')
        .selectAll('th')
        .data(data.columns)
        .join('td')
        .text(d => d)

    const rows = table
        .append('tbody')
        .selectAll('tr')
        .data(data)
        .join('tr');

    rows
        .selectAll('td')
        .data(d => Object.values(d))
        .join('td')
        .attr("class", d => d !== 'Detected' ? null : 'abnormal')
        .text(d => d);
    })
  }
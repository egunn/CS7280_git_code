//adjust the size and position of the SVG to ensure that it has margins around the edge of the screen.
var svg1 = d3.select("#plot1"),
    margin1 = {top: 10, right: 10, bottom: 10, left: 10},
    width1 = +svg1.attr("width") - margin1.left - margin1.right,
    height1 = +svg1.attr("height") - margin1.top - margin1.bottom;

var svg2 = d3.select("#plot2"),
    margin2 = {top: 10, right: 10, bottom: 10, left: 10},
    width2 = document.getElementById('plot2').clientWidth - margin2.left - margin2.right,
    height2 = document.getElementById('plot2').clientHeight - margin2.top - margin2.bottom;

var svg3 = d3.select("#plot3"),
    margin3 = {top: 10, right: 10, bottom: 10, left: 10},
    width3 = +svg3.attr("width") - margin3.left - margin3.right,
    height3 = +svg3.attr("height") - margin3.top - margin3.bottom;

var x1 = d3.scalePoint().rangeRound([0, width1]).padding(0.1), //use for categorical axis - divides axis into discrete steps of the right width to fill the axis length
    y1 = d3.scaleLinear().rangeRound([height1, 0]); //continuous scaling of y axis.

//add a new group to the svg canvas, and save it in a variable called g so that we can call it later
var g1 = svg1.append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")"); //move the group to the right place
var g2 = svg2.append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")"); //move the group to the right place
var g3 = svg3.append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")"); //move the group to the right place


var proj = d3.geoEquirectangular();

var path = d3.geoPath()
    .projection(proj);

//create a lookup table to store information about the medianHhIncome
var medianHhIncome = d3.map();
var medianRent = d3.map();

//import data from GeoJSON and csv files. Use parseData function to load the csv (not necessary for JSONs)
queue()
    .defer(d3.json, "./bos_census_blk_group.geojson")
    .defer(d3.json, "./bos_neighborhoods.geojson")
    .defer(d3.csv, "./acs2013_median_hh_income.csv")
    .defer(d3.csv, "./ACS_14_5YR_B25061_cuttoMap.csv")
    //wait for a variable to be returned for each file loaded: blocks from blk_group file, neighborhoods from bos_neighborhoods, and income from the parsed acs.csv.
    .await(function (err, blocks, neighborhoods, income, rents) {

        income.forEach(function (d) {
            medianHhIncome.set(d.geoid, +d.B19013001);
        });

        rents.forEach(function (d) {
            medianRent.set(d.geoid, +d.delta)
        });

        drawSvg1(blocks, neighborhoods, rents);
        drawSvg2(blocks, neighborhoods, rents);
        drawSvg3(blocks, neighborhoods, rents);

    });


var numSteps = 5;
var hue, saturation, value;
var type;
var colorArray;

function drawSvg1(mapBlocks, mapNeighborhoods, rents) {
    proj.fitExtent([[10, 10], [width2 / 2, height2]], mapBlocks);

    var map_data = d3.map();

    var leftMap = svg1.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(0,-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)
        .style('fill', function (d) {
            var lookUpRent = medianRent.get(d.properties.geoid);
            if (isNaN(lookUpRent)) {
                return "white"
            }
            else if (lookUpRent == undefined) {
                return "lightgray"
            }
            else if (lookUpRent < 0) {
                return "#7570b3"
            }
            else if (lookUpRent == 0) {
                return "#66a61e"
            }
            else {
                return "#e7298a"
            }

        })
        .attr('stroke-width', .5)
        .attr('stroke', 'lightgray')
        .on('mouseover', function (d) {
            var lookUpRent = medianRent.get(d.properties.geoid);
            if (!isNaN(lookUpRent)) {
                svg1.append('text')
                    .attr('x', 20)
                    .attr('y', 250)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Difference from median: $' + lookUpRent.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();
        });


    var rightMap = svg1.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(' + width2 / 2 + ',-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)//use data/enter/append because we want to plot each path separately
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)  //call the pathGenerator function to draw the blocks
        .style('fill', function (d) {
            //set the path style depending on the value of the median income
            var lookUpRent = medianRent.get(d.properties.geoid);
            if (isNaN(lookUpRent)) {
                return "white"
            }
            else if (lookUpRent == undefined) {
                return "lightgray"
            }

            else if (lookUpRent < 0) {
                return "#3a917a"
            }
            else if (lookUpRent == 0) {
                return "blue"
            }
            else {
                return "red"
            }
        })
        .attr('stroke-width', .5)
        .style('stroke', 'lightgray')
        .on('mouseover', function (d) {
            /*temp = d3.select(this);
             var mouseX = d3.mouse(this)[0];
             var mouseY = d3.mouse(this)[1];*/
            var lookUpRent = medianRent.get(d.properties.geoid);

            if (!isNaN(lookUpRent)) {
                svg1.append('text')
                    .attr('x', 20)//mouseX )
                    .attr('y', 250) //mouseY)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Difference from median: $' + lookUpRent.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();      //remove the label element from the DOM
        });

}


function drawSvg2(mapBlocks, mapNeighborhoods, rents) {

    proj.fitExtent([[10, 10], [width2 / 2, height2]], mapBlocks);

    var map_data = d3.map();
    var goodSequential = d3.scaleLinear().domain([0, 250000]).range(['white', 'red']);

    //from https://github.com/d3/d3-scale
    var rainbow = d3.scaleSequential(function (t) {
        return d3.hsl(t * 360, 1, 0.5) + "";
    });

    var badSequential = rainbow.domain([0, 250000]);

    var leftMap = svg2.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(0,-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)
        .style('fill', function (d) {

            //set the path style depending on the value of the median income
            var lookUpIncome = medianHhIncome.get(d.properties.geoid);
            if (lookUpIncome == 0) {
                return "lightgray"
            }
            else if (lookUpIncome == undefined) {
                return "blue"
            }
            else {
                return goodSequential(lookUpIncome);
            }
        })
        .attr('stroke-width', .5)
        .attr('stroke', 'white')
        .on('mouseover', function (d) {
            var lookUpIncome = medianHhIncome.get(d.properties.geoid);

            if (!isNaN(lookUpIncome)) {
                svg2.append('text')
                    .attr('x', 20)
                    .attr('y', 250)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Median income: $' + lookUpIncome.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();
        });


    var rightMap = svg2.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(' + width2 / 2 + ',-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)
        .style('fill', function (d) {

            var lookUpIncome = medianHhIncome.get(d.properties.geoid);
            if (lookUpIncome == 0) {
                return "lightgray"
            }
            else if (lookUpIncome == undefined) {
                return "blue"
            }
            else {
                return badSequential(lookUpIncome);
            }
        })
        .attr('stroke-width', .5)
        .style('stroke', 'white')
        .on('mouseover', function (d) {
            var lookUpIncome = medianHhIncome.get(d.properties.geoid);

            if (!isNaN(lookUpIncome)) {
                svg2.append('text')
                    .attr('x', 20)
                    .attr('y', 250)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Median income: $' + lookUpIncome.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();
        });


}

function drawSvg3(mapBlocks, mapNeighborhoods, rents) {

    proj.fitExtent([[10, 10], [width2 / 2, height2]], mapBlocks);

    var map_data = d3.map();
    var goodDiverging = d3.scaleLinear().domain([-1200, 0, 1200]).range(['purple', 'lightgray', 'green']);
    var badDiverging = d3.scaleLinear().domain([-1200, 0, 1200]).range(['purple', 'white', 'green']);

    //from https://github.com/d3/d3-scale
    var rainbow = d3.scaleSequential(function (t) {
        return d3.hsl(t * 360, 1, 0.5) + "";
    });

    var leftMap = svg3.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(0,-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)
        .style('fill', function (d) {

            var lookUpRent = medianRent.get(d.properties.geoid);
            if (lookUpRent == null) {
                return "white"
            }
            if (!lookUpRent) {
                return "white"
            }
            else if (lookUpRent == undefined) {
                return "white"
            }
            else {
                return goodDiverging(lookUpRent);
            }
        })
        .attr('stroke-width', .5)
        .attr('stroke', 'lightgray')
        .on('mouseover', function (d) {
            var lookUpRent = medianRent.get(d.properties.geoid);

            if (!isNaN(lookUpRent)) {
                svg3.append('text')
                    .attr('x', 20)
                    .attr('y', 250)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Difference from median: $' + lookUpRent.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();
        });


    var rightMap = svg3.append('g')
        .attr('class', 'block-groups')
        .attr('transform', 'translate(' + width2 / 2 + ',-50)')
        .selectAll('.block-group')
        .data(mapBlocks.features)
        .enter()
        .append('path')
        .attr('class', 'block-group')
        .attr('d', path)
        .style('fill', function (d) {

            var lookUpRent = medianRent.get(d.properties.geoid);
            if (lookUpRent == null) {
                return "lightgray"
            }
            if (!lookUpRent) {
                return "lightgray"
            }
            else if (lookUpRent == undefined) {
                return "lightgray"
            }
            else {
                return badDiverging(lookUpRent);
            }
        })
        .attr('stroke-width', .5)
        .style('stroke', 'darkgray')
        .on('mouseover', function (d) {
            var lookUpRent = medianRent.get(d.properties.geoid);

            if (!isNaN(lookUpRent)) {
                svg3.append('text')
                    .attr('x', 20)
                    .attr('y', 250)
                    .attr('class', 'text-label')
                    .style('font-size', 12)
                    .text('Difference from median: $' + lookUpRent.toLocaleString());
            }
        })
        .on('mouseout', function () {
            d3.select('.text-label').remove();
        });


}

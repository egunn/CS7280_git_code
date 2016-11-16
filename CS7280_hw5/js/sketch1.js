//adjust the size and position of the SVG to ensure that it has margins around the edge of the screen.
var svg = d3.select("#plot"),
    margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scalePoint().rangeRound([0, width]).padding(0.1), //use for categorical axis - divides axis into discrete steps of the right width to fill the axis length
    y = d3.scaleLinear().rangeRound([height, 0]); //continuous scaling of y axis.
var moves;

//add a new group to the svg canvas, and save it in a variable called g so that we can call it later
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //move the group to the right place

//import data from GeoJSON and csv files. Use parseData function to load the csv (not necessary for JSONs)
queue()
    .defer(d3.csv, "./edge_list.csv")
    .defer(d3.csv, "./game_log.csv")
    .defer(d3.json, "./nodes.json")
    //wait for a variable to be returned for each file loaded: blocks from blk_group file, neighborhoods from bos_neighborhoods, and income from the parsed acs.csv.
    .await(function (err, linklist, log, nodelist) {

        moves = log;
        drawSvg(linklist, log, nodelist);

    });



function drawSvg(links, moves, nodes) {

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 4));

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr('class',function(d){return d.edgeName})
            .attr('stroke','gainsboro')
            .attr("stroke-width", function(d) {return 2*+d.weight; });

        var nodeGroup = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g");

        node = nodeGroup
            .append("circle")
            .attr('class',function(d){return 'node-circ ' + 'node'+d.id})
            .attr("r", 15)
            .attr("fill", function(d){
                if (d.id == "A"){
                    return '#24d6c7';
                }
                else {
                    return 'gray';
                }
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .style('color','gray')
            .text(function(d) { return d.id; });


        nodeGroup.append("text")
            .attr('x',function(d){
                //console.log(d3.select(this.parentNode).data()[0].x);
                return 0})
            .attr('y',0)
            .style('fill','black')
            .text(function(d) { return d.id; });

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links)
            .distance(150);

        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}

var previousNode = 'A';

function update(t, lastValue){



        if (+t > +lastValue){
            if (t !=0) {

                if (moves[t - 1].action_type == 'move') {
                    d3.selectAll(".node" + moves[t - 1].start_node).style('fill', '#3d7c77');

                    d3.selectAll(".node" + moves[t - 1].end_node).style('fill', '#24d6c7');


                }
                else if (moves[t - 1].action_type == 'markedge') {
                    d3.selectAll(".Edge" + moves[t - 1].edge_index).style('stroke', '#3d7c77');

                }
                else if (moves[t - 1].action_type == 'unmarkedge') {
                    d3.selectAll(".Edge" + moves[t - 1].edge_index).style('stroke', 'gainsboro');
                }
            }
        }
        else {
            if(moves[+t].action_type == 'move'){
                d3.selectAll(".node" + moves[+t].start_node ).style('fill','gray');

                var checkNodes = false;
                for (var i=0; i< +t;i++){
                    if ((moves[+t].end_node == moves[i].start_node || moves[+t].end_node == moves[i].end_node) && moves[i].action_type == 'move'){
                        checkNodes = true;
                    }
                }
                if (checkNodes){
                    d3.selectAll(".node" + moves[+t].end_node ).style('fill','#3d7c77');
                }
                else {
                    d3.selectAll(".node" + moves[+t].end_node ).style('fill','gray');
                }

            }
            else if(moves[+t].action_type == 'markedge'){
                d3.selectAll(".Edge" + moves[+t].edge_index ).style('stroke','gainsboro');
            }
            else if(moves[+t].action_type == 'unmarkedge'){
                d3.selectAll(".Edge" + moves[+t].edge_index ).style('stroke','#3d7c77');
            }
        }



    //d3.selectAll(".node-circ").style('fill','gray');


//);


}

var lastValue = 0;

//Play button modified from https://jsfiddle.net/bfbun6cc/4/
//Run the update function when the slider is changed
d3.select('#slider').on('input', function() {
    var sliderValue = this.value;

    update(sliderValue, lastValue);

    lastValue = sliderValue;
});


var myTimer;
d3.select("#play").on("click", function() {



    clearInterval (myTimer);
    myTimer = setInterval (function() {
        var b= d3.select("#slider");
        var t = (+b.property("value") + 1) % (+b.property("max") + 1);
        if (t == 0) { t = +b.property("min"); }
        b.property("value", t);
        if (t<18){
            update (t, t-1);
            lastValue ++;
        }
        else {
            update (18, 17);
            clearInterval (myTimer);
            //reset()
        }
    }, 800);
});

d3.select("#stop").on("click", function() {
    clearInterval (myTimer);
});

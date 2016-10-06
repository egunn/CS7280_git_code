var svg = d3.select(".plot"),
    margin = {top: 60, right: 20, bottom: 50, left: 95},
    width = .7* (+svg.attr("width") - margin.left - margin.right),
    height = +svg.attr("height") - margin.top - margin.bottom;

//set up axes
var y = d3.scalePoint().rangeRound([0, height-50]).padding(0.25),
    x = d3.scaleLinear().rangeRound([0, width]).domain([10,28]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top+50) + ")");

//tooltip modified from http://bl.ocks.org/Caged/6476579
//updated for v4 following https://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<span style='color:gainsboro'>" +  "MPG: " + d.toFixed(1) + "</span>";
    });

svg.call(tip);

d3.json('./BMWdata_ford3_2.json',dataLoaded);


//callback when data is loaded
function dataLoaded(data) {

  console.log(data);

  //map axes onto data
  y.domain(data.map(function(d) { return d.season; }));
  //y.domain([0, d3.max(data, function(d) { return d.delta; })]);

  //add axes and titles
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (height-50) + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
      .attr('transform','translate(0,0)')
      .append("text")
      .style('fill','gray')
      .style('font-size','14px')
      .attr("transform", "translate(0,"+(height/2 - 50)+")rotate(-90)")
      .attr("y", -65)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Season");

  g.append('text')
      .attr('x',width/2)
      .attr('y', -40)
      .style('font-size',24)
      .style('text-anchor','middle')
      .text('Seasonal Variations in Mileage');

  g.append('text')
      .attr('x',width/2)
      .attr('y', height-15)
      .style('font-size',14)
      .style('text-anchor','middle')
      .text('miles per gallon');

  g.append('text')
      .attr('class','bar-label')
      .style('font-size',12);

  //draw bars
  dotPlot = g.selectAll(".dots")
      .data(data)
      .enter()
      .append('g')
      .attr('class','season-g')
      .attr("transform", function(d) {return "translate(0," + y(d.season) + ")"});

   dotPlot.selectAll('.dots')
       .data(function(d){return d.values;})
       .enter()
       .append("circle")
       .attr("class", "dots")
       .attr("cx", function(d) { return x(d); })
       .attr("cy", 0)
       .attr('fill','gray')
       .attr('r',4)
       .on('mouseover', function(d){
           d3.select(this).attr('fill','#4f4c4b');
           tip.show(d)
       })
       .on('mouseout', function(d){
           d3.select(this).attr('fill','gray');
           tip.hide(d)
       });

  dotPlot//.selectAll('.squares')
      //.data(function(d){console.log(d.average); return d.average})
      //.enter()
      .append('rect')
      .attr('x',function(d){return x(d.average)})
      .attr('y', -6)
      .attr('width',12)
      .attr('height',12)
      .attr('fill',"orange")
      .on('mouseover', function(d){
          d3.select(this).attr('fill','#f47442');
          tip.show(d.average)
      })
      .on('mouseout', function(d){
          d3.select(this).attr('fill','orange');
          tip.hide(d)
      });

  g.append('line')
      .attr('x1',x(22))
      .attr('x2',x(22))
      .attr('y1',0)
      .attr('y1',(height-50))
      .attr('stroke','gray')
      .style('stroke-dasharray',4)
      .attr('stroke-weight',1);

  g.append('text')
      .style('fill','gray')
      .style('font-size','14px')
      .attr("transform", "translate(" + x(22.35) + ",85)rotate(90)")
      .attr("y", 0)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("EPA average");

}


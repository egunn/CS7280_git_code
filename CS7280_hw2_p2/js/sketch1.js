var svg = d3.select(".plot"),
    margin = {top: 60, right: 20, bottom: 50, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

//set up axes
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//load data file
d3.csv('daylightChange.csv',parse, dataLoaded);
function parse(row) {
  return row;
}

//callback when data is loaded
function dataLoaded(data) {

  //map axes onto data
  x.domain(data.map(function(d) { return d.month; }));
  y.domain([0, d3.max(data, function(d) { return d.delta; })]);

  //add axes and titles
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
      .append("text")
      .style('fill','gray')
      .style('font-size','12px')
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Minutes");

  g.append('text')
      .attr('x',width/2)
      .attr('y', 0)
      .style('font-size',24)
      .style('text-anchor','middle')
      .text('Monthly Change in Daylight');

  g.append('text')
      .attr('x',width/2)
      .attr('y', height+40)
      .style('font-size',12)
      .style('text-anchor','middle')
      .text('Months of the Year');

  g.append('text')
      .attr('class','bar-label')
      .style('font-size',12);

  //draw bars
  g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.month); })
      .attr("y", function(d) { return y(d.delta); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.delta); })
      .on('mouseover',function(d){

        g.selectAll('.bar-label')
            .attr('x', x(d3.select(this).data()[0].month)  )
            .attr('y', y(d3.select(this).data()[0].delta) - 5)
            .attr('class','bar-label')
            .text(d3.select(this).data()[0].delta);
      });

}


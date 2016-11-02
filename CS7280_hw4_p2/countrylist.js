function countryList(countryData, countryNames){
    //console.log(countryNames);
    //console.log(countryData);

    countryListPlot.selectAll('.countryBarGroup').remove();
    countryListPlot.selectAll('.axis--y').selectAll('text').remove();
    countryListPlot.selectAll('.axis').remove();

    if (countryNames.length > 0){

        var countryArray = [];

        countryNames.forEach(function(d){

            var tempCountry = countryData.filter(function(f){
                return d == f.CODE})[0];

            if(tempCountry){
                countryArray.push(tempCountry);
            }
        });

        var sorted = countryArray.sort(function(a,b){
            return +b.forestAreaPresent - +a.forestAreaPresent
        });

        if (sorted.length > 10){
            sorted = sorted.slice(0,10);
        }


        /*var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(data.map(function(d) { return d.State; }));

        var x1 = d3.scale.ordinal().domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);*/


        var countryX = d3.scaleLinear().rangeRound([0, landWidth-100]).domain([0, +sorted[0].forestAreaPresent]);

        var countryY = d3.scaleBand().rangeRound([20,landHeight-20]).domain((sorted.map(function (d) {
            if(d){
                return d.Name;
            }
        }))).padding(4);


        var yearsY = d3.scaleOrdinal().domain([1990,2015]).range(countryY.range());


        var landBarPlot = countryListPlot.append('g')
            .attr('class','barplot')
            .attr('transform','translate(25,40)');

        landBarPlot.append('text')
            .attr('x', landWidth/2-35)
            .attr('y', -10)
            .style('font-size', 14)
            .attr('fill',"gray")
            .style('text-anchor', 'middle')
            .text('Forest Area (km2)');


        //add axes and titles
        var xAxis = landBarPlot.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + 20 + ")")
            .call(d3.axisTop(countryX)
                .ticks(2)
                .tickSizeOuter([0]));
                //.tickFormat(d3.formatPrefix(",.0", 1e6)));

        xAxis
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            //.attr('dx','.2em')
            .attr("dy", "-.75em")
            .attr('font-size','12px')
            //.attr("transform", "rotate(-90)")
            .attr('fill','gray')
            .style("text-anchor", "middle");



        var yAxis = landBarPlot.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(countryY)
                .ticks(0)
                .tickSizeOuter([0]));

        yAxis.selectAll('text')
            .attr("y", 0)
            .attr("x", 0)
            .attr('dx','.3em')
            .attr("dy",  - (countryY(sorted[0].Name)/7+ 2))
            .attr('font-size','12px')
            .attr('fill','gray')
            .style("text-anchor", "start");

        var barGroups = landBarPlot.selectAll('.countryBarGroup')
            .data(sorted)
            .enter()
            .append('g')
            .attr('class','countryBarGroup');
            //.attr('transform',function(d) { return "translate(" + countryY(d.Name) + ",0)"; });

        barGroups
            .append('rect')
            .attr("x", 0)//function(d) { return yearsY(1990); })
            .attr("y", function(d) { return countryY(d.Name) - countryY(sorted[0].Name)/7 ; })
            .attr("width", function(d) {
                return countryX(d.forestAreaPast); })
            .attr("height", countryY(sorted[0].Name)/7)
            .style("fill", "#317741");

        barGroups
            .append('rect')
            .attr("x", 0)//function(d) { return yearsY(1990); })
            .attr("y", function(d) { return countryY(d.Name) ; })
            .attr("width", function(d) {
                return countryX(d.forestAreaPresent); })
            .attr("height", countryY(sorted[0].Name)/7)
            .style("fill", "#1dd648");

        barGroups.append('rect')
            .attr('x',landWidth-100)
            .attr('y',landHeight - 70)
            .attr('width',10)
            .attr('height',10)
            .style('fill','#317741');

        barGroups.append('rect')
            .attr('x',landWidth-100)
            .attr('y',landHeight - 50)
            .attr('width',10)
            .attr('height',10)
            .style('fill','#1dd648');

        landBarPlot.append('text')
            .attr('x',landWidth-85)
            .attr('y',landHeight - 61)
            .style('font-size', 10)
            .attr('fill',"gray")
            .style('text-anchor', 'start')
            .text('1990');

        landBarPlot.append('text')
            .attr('x',landWidth-85)
            .attr('y',landHeight - 41)
            .style('font-size', 10)
            .attr('fill',"gray")
            .style('text-anchor', 'start')
            .text('2013');

    }



    /*
     //add axes and titles
     var xAxis = barGroup.append("g")
     .attr("class", "axis axis--x")
     .attr("transform", "translate(0," + ecoHeight/2 + ")")
     .call(d3.axisBottom(x));
     //.tickValues([1960,1965,1970,1975,1980,1985,1990,1995,2000,2005,2010,2015])); //come back and rebuild this!

     xAxis
     .selectAll("text")
     .attr("y", 0)
     .attr("x", 9)
     .attr('dx','-2em')
     .attr("dy", ".35em")
     .attr('font-size','12px')
     .attr("transform", "translate(0,"+ -ecoHeight/2 + ")rotate(-90)")
     .attr('fill','gray')
     .style("text-anchor", "end");

     var yAxis = barGroup.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(y)
     .ticks(5));
     //.tickFormat(d3.formatPrefix(",.0", 1e6)));

     var yAxisNeg = barGroup.append("g")
     .attr("class", "axis axis--y")
     .call(d3.axisLeft(yNeg)
     .ticks(10));

     yAxis.selectAll('text')
     .attr('fill',"gray");

     yAxisNeg.selectAll('text')
     .attr('fill',"gray");

     //d3.selectAll('.axis').selectAll('ticks').attr('fill',typeCol);

    barGroup.append('text')
        .attr('x', ecoWidth/2-15)
        .attr('y', -10)
        .style('font-size', 14)
        .attr('fill',"gray")
        .style('text-anchor', 'middle')
        .text('Distribution of carbon in the soil');

    barGroup.append('text')
        .attr('class', 'bar-label')
        .attr('fill',"gray")
        .style('font-size', 12);

    //draw bars
    stackGroup = barGroup.selectAll(".abovebar")
        .data(data)
        .enter()
        .append('g')
        .attr('class','stackgroup')
        .on('mouseover',function(d){
            d3.select(this).select('.backgroundbar').attr('fill-opacity',0.15);
            tracker.biomes = JSON.parse("[" + d.wwfDescript + "]");
            drawEcoMap(ecoMap);
        })
        .on('mouseout', function(d){
            d3.select(this).select('.backgroundbar').attr('fill-opacity',0.05);
            tracker.biomes = [];
            drawEcoMap(ecoMap);
        });

    stackGroup
        .append("rect")
        .attr("class", "abovebar")
        .attr("x", function (d) {
            return x(d.climateType);
        })
        .attr("y", function (d) {
            return  y(d.aboveground);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return ecoHeight/2 -y(d.aboveground);
        })
        .attr('fill', '#74a063');


    //draw bars
    stackGroup//.selectAll(".topsoilbar")
    //.data(data)
    //.enter()
        .append("rect")
        .attr("class", "topsoilbar")
        .attr("x", function (d) {
            return x(d.climateType);
        })
        .attr("y", function (d) {
            //console.log(d);
            return  ecoHeight/2;//yNeg(d.subsoil);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            //console.log(yNeg(d.topsoil));
            return ecoHeight/2 - yNeg(d.topsoil);
        })
        .attr('fill', '#77664c');//'#3b5c91');


    //draw bars
    stackGroup//.selectAll(".subsoilbar")
    //.data(data)
    //.enter()
        .append("rect")
        .attr("class", "subsoilbar")
        .attr("x", function (d) {
            return x(d.climateType);
        })
        .attr("y", function (d) {
            //console.log(d);
            return  ecoHeight - yNeg(d.topsoil); //sets pos'n of tops of bars (close to y axis)
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            //console.log(d.topsoil, d.subsoil);
            //console.log(yNeg(d.topsoil),yNeg(d.subsoil));
            return ecoHeight/2 - yNeg(d.subsoil);
        })
        .attr('fill', '#a38961');//'#3b5c91');


    stackGroup.append('rect')
        .attr("class", "backgroundbar")
        .attr("x", function (d) {
            return x(d.climateType);
        })
        .attr("y", 10)
        .attr("width", x.bandwidth())
        .attr("height", ecoHeight )
        .attr('fill', 'gray')
        .attr('fill-opacity',0.05);


*/




}
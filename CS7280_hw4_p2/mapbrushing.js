//setup page and global variables
//set some margins and record width and height of window
margin = {t: 25, r: 0, b: 25, l: 10};

ecoWidth = document.getElementById('ecoregions').clientWidth - margin.r - margin.l;
ecoHeight = document.getElementById('ecoregions').clientHeight - margin.t - margin.b;


landWidth = document.getElementById('landuse').clientWidth - margin.r - margin.l;
landHeight = document.getElementById('landuse').clientHeight - margin.t - margin.b;

ecoPlot = d3.select("#ecoregions")
	.append('svg')
	.attr('width', document.getElementById('ecoregions').clientWidth)
	.attr('height', document.getElementById('ecoregions').clientHeight)
	.attr('background','transparent');

countryListPlot = d3.select("#landuse")
	.append('svg')
	.attr('width', document.getElementById('landuse').clientWidth)
	.attr('height', document.getElementById('landuse').clientHeight)
	.attr('class','landuseplot')
	.attr('background','white');


ecoCanvas = d3.select("#mapCanvas")
	.append('canvas')
	.attr('width', 600)
	.attr('height', 400);

//set up scale factors
var x = d3.scaleBand().rangeRound([0, ((ecoWidth-30))]).padding(0.1);
var y = d3.scaleLinear().rangeRound([ecoHeight/4, ecoHeight/2]);
var yNeg = d3.scaleLinear().rangeRound([ecoHeight/2, ecoHeight]);
//var ecoColors = d3.scaleOrdinal(d3.schemeCategory10);
var ecoColors = d3.scaleOrdinal().domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,99]).range(["#a5f221","#179ca8","#1fc4d3","#e2d0ea","#ba8f6a","#f7cebb","#c6efa7","#917b1b","#c7e2ed","#f9a9cd","#db970f","#93c1ba","#edf0f2","#216d3e","#5fba59"]);

var projection = d3.geoMercator();

//group to plot ecoregion bars in
barGroup = ecoPlot.append('g')
	.attr('class','bar-group')
	.attr('transform','translate('+ 20 + ',40)');

wwfCategories = [];

var tracker = {biomes:[],countries:[],mouseover:false};

//code from http://jsfiddle.net/8L247yac/
//found through SO post: http://stackoverflow.com/questions/20671015/d3-js-sophisticated-world-map-brush-thumbnail

//import data from GeoJSON and csv files. Use parseData function to load the csv (not necessary for JSONs)
queue()
	.defer(d3.json, 'worldcountries_fromWorking.topojson')
	.defer(d3.json, 'teow_2.5p.topojson')
	.defer(d3.csv, "abovebelowC_reconciling.csv")
	.defer(d3.csv, "forestData2.csv")
	//wait for a variable to be returned for each file loaded: blocks from blk_group file, neighborhoods from bos_neighborhoods, and income from the parsed acs.csv.
	.await(function (err, mapData, ecomap, carbon, forests) {

		projection
			.fitSize([600, 400], topojson.feature(ecomap, ecomap.objects.wwf_terr_ecos));

		ecoregions(carbon,ecomap);
		drawMap2(mapData, projection,forests);
		drawEcoMap(ecomap);
		countryList(forests, tracker.countries);

	});


function drawEcoMap(ecoMap) {
	console.log(ecoMap);

	var context = ecoCanvas.node().getContext("2d");

	var path = d3.geoPath()
		.projection(projection)
		.context(context);

	ecoRegions = topojson.feature(ecoMap, ecoMap.objects.wwf_terr_ecos).features;

	console.log(tracker.biomes);

	//map context coloring from http://bl.ocks.org/rveciana/f46df2272b289a9ce4e7
	ecoRegions.forEach(function (d, i) {
		if (tracker.biomes.length == 0){
			//console.log(d.properties.G200_BIOME);
			var tempColor = ecoColors(d.properties.BIOME); //"\"" + ecoColors(d.properties.G200_BIOME) + "\"";
			context.fillStyle = tempColor;//"\"" + ecoColors(d.properties.G200_BIOME) + "\"";
			context.beginPath();
			path(d);
			context.fill();
		}

		else {
			var check = tracker.biomes.find(function(f){
				//console.log(f,d.properties.BIOME);
				return f == d.properties.BIOME;
			});

			if (check){
				tempColor = "#ea822c";//ecoColors(d.properties.BIOME); //"\"" + ecoColors(d.properties.G200_BIOME) + "\"";
			}
			else {
				tempColor = "white";
			}

			context.fillStyle = tempColor;//"\"" + ecoColors(d.properties.G200_BIOME) + "\"";
			context.beginPath();
			path(d);
			context.fill();

		}

	});


	//context.fillStyle = 'red';
	/*
	path(topojson.feature(ecoMap, ecoMap.objects.wwf_terr_ecos));
	context.fill();*/

	//works, but fills all regions w/ same color
	//context.beginPath(), path.context(context)(topojson.feature(ecoMap, ecoMap.objects.wwf_terr_ecos)), context.fill()//, context.stroke();
/*
	context.fillStyle = '#d7c7ad';
	context.beginPath(), path.context(context)(land), context.fill(), context.stroke();
*/
/*
	var tempColor = ecoColors(0);// "\"" + ecoColors(0) + "\"";
	console.log(tempColor);
	context.fillStyle = tempColor;
	console.log(context.fillStyle);
	context.fillRect(0, 0, 100, 100);
	context.fill();
*/
}


function drawMap2 (data, projection, forests){

	var mapJson = topojson.feature(data, data.objects.worldcountries);

	console.log(mapJson);

	//var projection = d3.geoMercator()
	//	.fitSize([600, 400], topojson.feature(data, data.objects.worldcountries));

	var path = d3.geoPath()
		.projection(projection);

	var svg = d3.selectAll('#majormap')
		.append('svg')
		.attr('width',600)
		.attr('height',400)
		.attr('class', 'majormap');

	var worldMap = svg.append('g')
		.attr('class', 'worldmap');

	var mapObjects = worldMap
		.selectAll("path")
		.data(mapJson.features)
		.enter();

	mapObjects
		.append("path")
		.attr('class', function(d){
			return 'country '+ d.id;
		})
		.attr('strokeWidth',4)
		.attr('stroke','black')
		.attr("d", path);

	var legendY = d3.scaleBand().rangeRound([155,355]).domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]).padding(4);

	var climateTypes = [
		{name: "Tropical/subtropical moist broadleaf", biome: 1},
		{name: "Tropical/subtropical dry broadleaf",biome: 2},
		{name: "Tropical/subtropical coniferous",biome: 3},
		{name: "Temperate broadleaf and mixed",biome: 4},
		{name: "Temperate coniferous",biome: 5},
		{name: "Boreal forests/taiga",biome: 6},
		{name: "Tropical/subtropical grasslands",biome: 7},
		{name: "Temperate grasslands",biome: 8},
		{name: "Flooded grasslands",biome: 9},
		{name: "Montane grasslands",biome: 10},
		{name: "Tundra",biome: 11},
		{name: "Mediterranean forests",biome: 12},
		{name: "Deserts and xeric shrublands",biome: 13},
		{name: "Mangroves", biome: 14},
		{name: "Not classified", biome: 99}
	];

	//append a legend for the canvas map (do it here in the SVG because it only gets called once)
	var legend = svg.selectAll('.legend')
		.data(climateTypes)
		.enter()
		.append('g')
		.attr('class','legend');

	legend.append('circle')
		.attr('class','legendCirc')
		.attr('cx', 5)
		.attr('cy',function (d,i) {
			return legendY(i);
		})
		.attr('r', 3)
		.attr('fill', function(d){
			//console.log(ecoColors(+d.biome),d.biome);
			return ecoColors(+d.biome);
		});

	legend.append('text')
		.attr('x', -5)
		.attr('y',function (d,i) {
			return legendY(i);
		})
		.attr('dx',	17)
		.attr('dy',4)
		.attr('font-size','9.5px')
		.attr('fill','gray')
		.style("text-anchor", "start")
		.text(function(d){return d.name;});

	//console.log(mapJson.features);

	var centers = mapJson.features.map(function (d) {

		var centroid = path.centroid(d); //provides two numbers [x,y] indicating the screen coordinates of the state
		//Puerto Rico returns NaN, sends error to the console. Also, something wrong with UT data - no fill color assigned.

		return {
			id: d.id,
			x0: centroid[0],
			y0: centroid[1],
			x: centroid[0],
			y: centroid[1]
		}
	});


	var brush = d3.brush()
		//.on("start brush", brushed)
		.on("end", brushed);

	var gBrush = svg.append("g")
		.attr("class", "brush")
		.call(brush);


	var selectedCountries = [];

	function brushed() {

		clickRect = svg.append('rect')
			.attr('width',600)
			.attr('height',400)
			.attr('class', 'clickRect')
			.style('fill','none')
			.attr('pointer-events', 'all')
			.on('click',clickedRect);


		function clickedRect(){
			svg.selectAll('.clickRect').remove();
			svg.selectAll('.country').style('fill','none');
			selectedCountries = [];
			selectedString = '';
		}

		var s = d3.event.selection; //returns the brush selection region
		if (s != null){
			var bx0 = s[0][0], //get the x0 position from the brush selection
				by0 = s[0][1],
				bx1 = s[1][0],
				by1 = s[1][1],
				bdx = bx1 - bx0,
				bdy = by1 - by0,
				max = 0;

			var selectedCountryArray = [];

			centers.forEach(function(d){
				if (  ((bx0 < d.x0 && d.x0 < bx1) && (by0 < d.y0 && d.y0 < by1)) || ((bx0 > d.x0 && d.x0 > bx1) && (by0 > d.y0 && d.y0 > by1)) ){
					//console.log(d.id);
					selectedCountries.push(d);
					selectedCountryArray.push(d.id);
				}
			});

			svg.selectAll('.country').style('fill','lightgray');

			var selectedString = "";

			selectedCountries.forEach(function(d,i){
				if (i < selectedCountries.length - 1){
					selectedString = selectedString + "." + d.id + ","
				}
				else {
					selectedString = selectedString + "." + d.id
				}
			});

			svg.selectAll(selectedString).style('fill','#80b78d');

			countryList(forests,selectedCountryArray);

			var invert1 = projection.invert(s[0]);
			var invert2 = projection.invert(s[1]);

		}

	}

}





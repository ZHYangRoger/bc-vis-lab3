let cities;
let buildings;

async function loadData(url){
    let data = await d3.csv(url, d3.autoType);
    return data;
}

function filterData(){
    let euro_c = cities.filter(state => state.eu == true);
    return euro_c;
}

function sortData(){
    let sorted_buil = buildings.sort((a, b) => b.height_m - a.height_m);
    return sorted_buil;
}

async function scatterPlot(){
    const url = 'cities.csv';
    cities = await loadData(url);
    let euro_cities = filterData();

    d3.select('.city-count').text("Number of cities: " + euro_cities.length);

    const width = 700;
    const height = 550;
    const svg = d3.select('.population-plot')
		.append('svg')
        .attr('width', width)
        .attr('height', height)

    svg.selectAll(".population-plot")
        .data(euro_cities)
        .enter()
        .append("circle")
        .attr("cx", function(d){
            //console.log(d);
            return d.x;
        })
        .attr("cy", function(d){
            return d.y;
        })
        .attr("r", function(d){
            if (d.population < 1000000) return 4;
            else return 8;
        })
        .on("mouseover", function(){
            d3.select(this).style("fill", "lightblue");
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "black");
        });


    let large_cities = euro_cities.filter(cit => cit.population >= 1000000);
    //console.log(large_cities);
    svg.selectAll("text")
        .data(large_cities)
        .enter()
        .append("text")
        .text(function(d){
            return d.city;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d){
            return d.x;
        })
        .attr("y", function(d){
            return d.y -10;
        })
        .attr("font-size", "11px")
}

async function barChart(){
    const url = 'buildings.csv';
    buildings = await loadData(url);
    let sorted_buildings = sortData();
    //console.log(sorted_buildings);

    const width = 500;
    const height = 500;
    let yArr = [];
    const svg = d3.select('.building-graph')
		.append('svg')
        .attr('width', width)
        .attr('height', height)

    const svgImg = d3.select(".image-place")
        .append("svg")
        .attr("width", 320)
        .attr("height", 560)

    
    svg.selectAll('bar')
        .data(sorted_buildings)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 250)
        .attr("y", function(d){
            //console.log(height);
            //console.log(height / (sorted_buildings.length + 1)) * (sorted_buildings.indexOf(d) + 1);
            let y = height / (sorted_buildings.length + 1) * (sorted_buildings.indexOf(d) + 1);
            yArr.push(y);
            return y;
        })
        .attr("width", function(d){
            return d.height_px;
        })
        .attr("height", 30)
        .on("mouseover", function(){
            d3.select(this).style("fill", "lightblue");
            d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(){
            d3.select(this).style("fill", "black");
            d3.select(this).style("cursor", "default"); 
        })
        .on("click", function(d) {
            console.log(d.srcElement.__data__.image);
            console.log("img/" + d.srcElement.__data__.image);
            svgImg.selectAll("img")
                .data(sorted_buildings)
                .enter()
                .append("svg:image")
                .attr("xlink:href", "img/" + d.srcElement.__data__.image)
          });

        //console.log(yArr);
    
    let i = 0;
    let textYArr = [];
    svg.selectAll("text")
        .data(sorted_buildings)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", 0)
        .attr("y", function(d){
            let textY = yArr[i] + 20;
            i += 1;
            textYArr.push(textY);
            return textY;
        })
        .text(function(d){
            return d.building;
        })
    
    i = 0;
    svg.selectAll("endText")
        .data(sorted_buildings)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("fill", "white")
        .attr("x", function(d){
            return d.height_px + 250 - 35;
        })
        .attr("text-anchor", "end")
        .attr("y", function(d){
            let endTextY = textYArr[i];
            i += 1;
            console.log(endTextY);
            return(endTextY);
        })
        .text(function(d){
            return d.height_ft;
        })
        
}

async function main(){

    scatterPlot();

    barChart();
}


main();

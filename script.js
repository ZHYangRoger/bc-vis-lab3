let cities;

async function loadData(){
    let data = await d3.csv('cities.csv', d3.autoType);
    return data;
}

function filterData(){
    let euro_c = cities.filter(state => state.eu == true);
    return euro_c;
}

async function main(){
    cities = await loadData();
    euro_cities = filterData();
    //console.log(cities);
    //console.log(euro_cities);

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


main();

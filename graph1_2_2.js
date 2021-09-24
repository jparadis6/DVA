//------------------------1. PREPARATION------------------------//
//-----------------------------SVG------------------------------// 

//Using https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/ as backbone
const width = 960;
const height = 500;
const margin = 50;
const padding = 5;
const adj = 100;
// we are appending SVG first
var svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-"
          + adj + " -"
          + adj + " "
          + (width + adj *3) + " "
          + (height + adj*3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

//-----------------------------DATA-----------------------------//
//This now gets the data!!!!

var timeConv = d3.timeParse("%Y-%m-%d");
var dataset = d3.csv("boardgame_ratings.csv");

dataset.then(function(data) {



    var slices = data.columns.slice(1).map(function(id) {
        return {
            
            id: id,
            
            values: data.map(function(d){
                return {
                  
                    date: timeConv(d.date),

                    ratings: +d[id]
                };
            })
        };
    });
//Get a second variable so I don't need to mess around with renaming
   /* var slices2 = data.columns.slice(1).map(function(id) {
        return {
            
            id: id.split("=")[0],
            
            values: data.map(function(d){
                return {
                  
                    date: timeConv(d.date),
                    game:id.split("=")[0],
                    field:id.split("=")[1],
                    rank: +d[id]
                };
            })
        };
    });*/
//split into two var
//console.log(slices)
//console.log(slices2)
//Need to update rest of files
var ratings=[slices[0],slices[2],slices[4],slices[6],slices[8],slices[10],slices[12],slices[14]]
var rank=[slices[1],slices[5],slices[7],slices[9]]

//console.log(ratings)
//console.log(rank)
//var combined=_.merge(ratings,rank)
//console.log(combined)


//var datagrouprank=d3.nest().key(function(d){return d.game;}).entries(rank)
//console.log(datagrouprank)
//----------------------------SCALES----------------------------//
var xScale = d3.scaleTime().range([0,width]);
var yScale = d3.scaleLinear().rangeRound([height, 0]);
xScale.domain(d3.extent(data, function(d){
    return timeConv(d.date)}));
yScale.domain([(0), 100000]);

//-----------------------------AXES-----------------------------//
var yaxis = d3.axisLeft()
    .ticks(10)
    .scale(yScale);

var xaxis = d3.axisBottom()
    .ticks(14)
    .tickFormat(d3.timeFormat('%b %Y'))
    .scale(xScale);

//----------------------------LINES-----------------------------//
var line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.ratings); }); 

let id = 0;
var ids = function () {
    return "line-"+id++;
}  

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .append("text")
    .attr("x", width/2)
    .attr("y", 40)
    .style("text-anchor", "end")
    .text("Time");;

    svg.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Number of Ratings");

//----------------------------LINES-----------------------------//


var color = d3.scaleOrdinal(d3.schemeCategory10);

var lines = svg.selectAll("lines")
    .data(ratings)
    .enter()
    .append("g");

    lines.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line(d.values); })
    .style("stroke",function(d){return d.color=color(d.id);})

//console.log(lines)


    lines.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date) + 10)  
            + "," + (yScale(d.value.ratings) + 5 ) + ")";})
    .attr("x", 5)
    .text(function(d) { return d.id.split("=")[0]; });
    //.style("fill",function(d){return d.color=color(d.id);})
            



})



//Add credit
var credit=svg.append("text").attr("id","credit")
    .attr("x", 900 )
    .attr("y", 550)
    .style("text-anchor", "bottom")
    .text("jparadis6");   

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Number of Ratings 2016-2020");

        console.log("test")
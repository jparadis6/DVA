//------------------------1. PREPARATION------------------------//
//-----------------------------SVG------------------------------// 

//Using https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/ as backbone

// we are appending SVG first
var svg2 = d3.select("div#container2").append("svg")
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

var timeConv2 = d3.timeParse("%Y-%m-%d");
var dataset2 = d3.csv("boardgame_ratings.csv");

dataset.then(function(data) {



    const slices2 = data.columns.slice(1).map(function(id) {
        return {
            
            id: id.split("=")[0],
            
            values: data.map(function(d){
                return {
                  
                    date: timeConv(d.date),

                    ratings: +d[id]
                };
            })
        };
    });

    //Cause the first one doesn't work
    const slicesrank2 = data.columns.slice(1).map(function(id) {
        return {
            
            id: id.split("=")[0],
            
            values: data.map(function(d){
                return {
                  
                    date: timeConv(d.date),

                    rank: +d[id]
                };
            })
        };
    });

    //THis one renames it to ratings
    const slicesratings2 = data.columns.slice(1).map(function(id) {
        return {
            
            id: id.split("=")[0],
            
            values: data.map(function(d){
                return {
                  
                    date: timeConv(d.date),

                    rating: +d[id]
                };
            })
        };
    });

//Deep merge
function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object'

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice()
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument)
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument)
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument))
        }
    })
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {}
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument)
        })
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument)
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument)
        }
    })
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge }
    var arrayMerge = options.arrayMerge || defaultArrayMerge

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
}
//End Deep merge


    //split into two var
//Combine the data
var ratings2=[slices2[0],slices2[2],slices2[4],slices2[6],slices2[8],slices2[10],slices2[12],slices2[14]]

var ratingsprecombine2=[slicesratings2[0],slicesratings2[4],slicesratings2[6],slicesratings2[8]]
var rank2=[slicesrank2[1],slicesrank2[5],slicesrank2[7],slicesrank2[9]]

//console.log((slicesratings2[0].values).concat(rank2[0.values])
//var combined=_.merge(ratingsprecombine2,rank2)

var test=slicesratings2[0].values
var test2=slicesrank2[1].values

var combined2=deepmerge(ratingsprecombine2,rank2)


//----------------------------SCALES----------------------------//
var xScale2 = d3.scaleTime().range([0,width]);
var yScale2 = d3.scaleLinear().rangeRound([height, 0]);
xScale2.domain(d3.extent(data, function(d){
    return timeConv2(d.date)}));
yScale2.domain([(0), 100000]);

//-----------------------------AXES-----------------------------//
var yaxis2 = d3.axisLeft()
    .ticks(10)
    .scale(yScale2);

var xaxis2 = d3.axisBottom()
    .ticks(12)
    .tickFormat(d3.timeFormat('%b %Y'))
    .scale(xScale2);

//----------------------------LINES-----------------------------//
var line2 = d3.line()
    .x(function(d) { return xScale2(d.date); })
    .y(function(d) { return yScale2(d.ratings); }); 

let id = 0;
var ids = function () {
    return "line-"+id++;
}  

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//
svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis2)
    .append("text")
    .attr("x", width/2)
    .attr("y", 40)
    .style("text-anchor", "end")
    .text("Time");;

    svg2.append("g")
    .attr("class", "axis")
    .call(yaxis2)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Number of Ratings");

//----------------------------LINES-----------------------------//


var color2 = d3.scaleOrdinal(d3.schemeCategory10);

var lines2 = svg2.selectAll("lines")
    .data(ratings2)
    .enter()
    .append("g");

    lines2.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line2(d.values); })
    .style("stroke",function(d){return d.color=color2(d.id);})



    lines2.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale2(d.value.date) + 10)  
            + "," + (yScale2(d.value.ratings) + 15 ) + ")";})
    .attr("x", 5)
    .text(function(d) { return d.id.split("=")[0]; });

//Add first set of dots

    svg2.selectAll(".dot")
        .data(ratings2[0].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale2(d.date) })
        .attr("cy", function(d) { return yScale2(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#1f77b4")); 

//Second set
        svg2.selectAll(".dot2")
        .data(ratings2[2].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot2") // Assign a class for styling
        .attr("cx", function(d) { return xScale2(d.date) })
        .attr("cy", function(d) { return yScale2(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#2CA02CFF")); 

//Third Set
        svg2.selectAll(".dot3")
        .data(ratings2[3].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot3") // Assign a class for styling
        .attr("cx", function(d) { return xScale2(d.date) })
        .attr("cy", function(d) { return yScale2(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#D62728FF")); 

//4th set
        svg2.selectAll(".dot4")
        .data(ratings2[4].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot4") // Assign a class for styling
        .attr("cx", function(d) { return xScale2(d.date) })
        .attr("cy", function(d) { return yScale2(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#9467BDFF")); 
    //--------------------------------------Add rank data
//Make merged dataset
 
//Add text


//Add legend dot
        svg2.
        append("circle") // Uses the enter().append() method
        .attr("class", "dot4") // Assign a class for styling
        .attr("cx",975 )
        .attr("cy",450)
        .attr("r", 30)
        .style("fill","black"); 
//Add legend text
        var legend=svg2.append("text").attr("id","legend")
        .attr("x", 960 )
        .attr("y", 450)
        .style("text-anchor", "bottom")
        .style("fill","white")
        .text("rank");   
        var legend2=svg2.append("text").attr("id","legend2")
        .attr("x", 960 )
        .attr("y", 495)
        .style("text-anchor", "bottom")
        .style("fill","black")
        .text("BoardGameGeek Rank");   


//Loop through each data set and print value
        var arraylength=(combined2.length)
        for (var i=0;i<arraylength; i++){
        
        var arraylength2=combined2[i].values.length
            for (var j=0;j<arraylength2;j++){
                if(j%3==0)
                {
                    svg2.append("text")
                    .attr("class","rank")
                    .attr("x", xScale2(combined2[i].values[j].date))
                    .attr("y", yScale2(combined2[i].values[j].rating))
                    .text(combined2[i].values[j].rank)
                }


            }

        }
    })

   

//Add credit
var credit=svg2.append("text").attr("id","credit")
    .attr("x", 900 )
    .attr("y", 550)
    .style("text-anchor", "bottom")
    .text("jparadis6");   

    svg2.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Number of Ratings 2016-2020 with Rankings");
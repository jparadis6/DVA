//------------------------1. PREPARATION------------------------//
//-----------------------------SVG------------------------------// 

//Using https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/ as backbone

// we are appending SVG first
var svg3 = d3.select("div#container3").append("svg")
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

var timeConv3 = d3.timeParse("%Y-%m-%d");
var dataset3 = d3.csv("boardgame_ratings.csv");

dataset.then(function(data) {



    const slices3 = data.columns.slice(1).map(function(id) {
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
    const slicesrank3 = data.columns.slice(1).map(function(id) {
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
    const slicesratings3 = data.columns.slice(1).map(function(id) {
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

//split into two var

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

//Combine the data
var ratings3=[slices3[0],slices3[2],slices3[4],slices3[6],slices3[8],slices3[10],slices3[12],slices3[14]]

var ratingsprecombine3=[slicesratings3[0],slicesratings3[4],slicesratings3[6],slicesratings3[8]]
var rank3=[slicesrank3[1],slicesrank3[5],slicesrank3[7],slicesrank3[9]]


var combined3=deepmerge(ratingsprecombine3,rank3)


//----------------------------SCALES----------------------------//
var xScale3 = d3.scaleTime().range([0,width]);
var yScale3 = d3.scaleSqrt().rangeRound([height, 0]);
xScale3.domain(d3.extent(data, function(d){
    return timeConv3(d.date)}));
yScale3.domain([(0), 100000]);

//-----------------------------AXES-----------------------------//
var yaxis3 = d3.axisLeft()
    .ticks(10)
    .scale(yScale3);

var xaxis3 = d3.axisBottom()
    .ticks(12)
    .tickFormat(d3.timeFormat('%b %Y'))
    .scale(xScale3);

//----------------------------LINES-----------------------------//
var line3 = d3.line()
    .x(function(d) { return xScale3(d.date); })
    .y(function(d) { return yScale3(d.ratings); }); 

let id = 0;
var ids = function () {
    return "line-"+id++;
}  

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//
svg3.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis3)
    .append("text")
    .attr("x", width/2)
    .attr("y", 40)
    .style("text-anchor", "end")
    .text("Time");;

    svg3.append("g")
    .attr("class", "axis")
    .call(yaxis3)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Number of Ratings");

//----------------------------LINES-----------------------------//


var color3 = d3.scaleOrdinal(d3.schemeCategory10);

var lines3 = svg3.selectAll("lines")
    .data(ratings3)
    .enter()
    .append("g");

    lines3.append("path")
    .attr("class", ids)
    .attr("d", function(d) { return line3(d.values); })
    .style("stroke",function(d){return d.color=color3(d.id);})



    lines3.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale3(d.value.date) + 10)  
            + "," + (yScale3(d.value.ratings) + 15 ) + ")";})
    .attr("x", 5)
    .text(function(d) { return d.id.split("=")[0]; });

//Add first set of dots

    svg3.selectAll(".dot")
        .data(ratings3[0].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d) { return xScale3(d.date) })
        .attr("cy", function(d) { return yScale3(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#1f77b4")); 

//Second set
        svg3.selectAll(".dot2")
        .data(ratings3[2].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot2") // Assign a class for styling
        .attr("cx", function(d) { return xScale3(d.date) })
        .attr("cy", function(d) { return yScale3(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#2CA02CFF")); 

//Third Set
        svg3.selectAll(".dot3")
        .data(ratings3[3].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot3") // Assign a class for styling
        .attr("cx", function(d) { return xScale3(d.date) })
        .attr("cy", function(d) { return yScale3(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#D62728FF")); 

//4th set
        svg3.selectAll(".dot4")
        .data(ratings3[4].values)
        .enter()
        .append("circle") // Uses the enter().append() method
        .attr("class", "dot4") // Assign a class for styling
        .attr("cx", function(d) { return xScale3(d.date) })
        .attr("cy", function(d) { return yScale3(d.ratings) })
        .attr("r", function(d,i){
            if (+i%3==0){
                return 25
            }
            else {return 0}
            })
        .style("fill",d3.color("#9467BDFF")); 
    //--------------------------------------Add rank data



//Add legend dot
        svg3.
        append("circle") // Uses the enter().append() method
        .attr("class", "dot4") // Assign a class for styling
        .attr("cx",975 )
        .attr("cy",450)
        .attr("r", 30)
        .style("fill","black"); 
//Add legend text
        var legend=svg3.append("text").attr("id","legend")
        .attr("x", 960 )
        .attr("y", 450)
        .style("text-anchor", "bottom")
        .style("fill","white")
        .text("rank");   
        var legend2=svg3.append("text").attr("id","legend2")
        .attr("x", 960 )
        .attr("y", 495)
        .style("text-anchor", "bottom")
        .style("fill","black")
        .text("BoardGameGeek Rank");   


//Loop through each data set and print value
        var arraylength=(combined3.length)
        for (var i=0;i<arraylength; i++){
        
        var arraylength2=combined3[i].values.length
            for (var j=0;j<arraylength2;j++){
                if(j%3==0)
                {
                    svg3.append("text")
                    .attr("class","rank")
                    .attr("x", xScale3(combined3[i].values[j].date))
                    .attr("y", yScale3(combined3[i].values[j].rating))
                    .text(combined3[i].values[j].rank)
                }


            }

        }
    })

   
console.log("test")
//Add credit
var credit=svg3.append("text").attr("id","credit")
    .attr("x", 900 )
    .attr("y", 550)
    .style("text-anchor", "bottom")
    .text("jparadis6");   
    

    svg3.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text("Number of Ratings 2016-2020 (Square root Scale)");
var padding = {top:20, right:40, bottom:0, left:0},
            w = 500 - padding.left - padding.right,
            h = 500 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();            

var answerShow = false;
var data = [
        {
            "label": "$100",
            "value": 1,
            "question": "What is the difference between a while loop and a for loop in JavaScript?",
            "answer": "A while loop is used when you want to execute a block of code while a specified condition is true. A for loop is used when you want to iterate over a range of values a specified number of times."
        },
        {
            "label": "$1,000",
            "value": 2,
            "question": "What is the output of the following code? if (0) { console.log('truthy'); } else { console.log('falsy'); }",
            "answer": "The output of this code is 'falsy'. The number 0 is a falsy value in JavaScript, so the if statement evaluates to false and the else block is executed."
        },
        {
            "label": "$10,000",
            "value": 3,
            "question": "What is the output of the following code? if ('false') { console.log('truthy'); } else { console.log('falsy'); }",
            "answer": "The output of this code is 'truthy'. The string 'false' is a truthy value in JavaScript, so the if statement evaluates to true and the if block is executed."
        },
        {
            "label": "$100,000",
            "value": 4,
            "question": "What is the output of the following code? if (true || false) { console.log('true'); } else { console.log('false'); }",
            "answer": "The output of this code is 'true'. The logical OR operator (||) evaluates to true if either of its operands is true, so the if statement evaluates to true and the if block is executed."
        },
        {
            "label": "$1,000,000",
            "value": 5,
            "question": "What is the difference between the == and === operators in JavaScript?",
            "answer": "The == operator compares two values for equality, but performs type coercion if the values are not of the same type. The === operator compares two values for equality without performing type coercion, so the values must be of the same type to be considered equal."
        },
        {
            "label": "$10,000,000",
            "value": 6,
            "question": "What is the output of the following code? var a = 0; console.log(Boolean(a));",
            "answer": "The output of this code is 'false'. The value 0 is a falsy value in JavaScript, so Boolean(0) returns false."
        },
        {
            "label": "$50,000,000",
            "value": 7,
            "question": "What is a higher-order function in JavaScript?",
            "answer": "A higher-order function is a function that takes one or more functions as arguments or returns a function as its result. This allows for functions to be composed and reused in a modular way."
        },
        {
            "label": "$75,000,000",
            "value": 8,
            "question": "What is the output of the following code? console.log(typeof null);",
            "answer": "The output of this code is 'object'. This is a quirk of the JavaScript language, where the null value is of type 'object' rather than its own distinct type."
        },
        {
            "label": "$90,000,000",
            "value": 9,
            "question": "What is the output of the following code? console.log(typeof undefined);",
            "answer": "The output of this code is 'undefined'. The undefined value is a primitive type in JavaScript and represents a variable that has been declared but not assigned a value."
        },
        {
            "label": "$100,000,000",
            "value": 10,
            "question": "What is the output of the following code? const a; console.log(a == null);",
            "answer": "The output of this code is 'true'. The variable a is declared but not assigned a value, so its value is undefined. When compared to null with the == operator, undefined is coerced to null and the comparison evaluates to true."
        }
    ];
    
var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width",  w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
var vis = container
    .append("g");
var priceDiv = document.querySelector("#price")
var answerDiv = document.querySelector("#answer")
var showButton = document.querySelector(".show-answer-button")
var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");
    
arcs.append("path")
    .attr("fill", function(d, i){ return color(i); })
    .attr("d", function (d) { return arc(d); });
// add the text
arcs.append("text").attr("transform", function(d){
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle)/2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
    })
    .attr("text-anchor", "end")
    .text( function(d, i) {
        return data[i].label;
    });
container.on("click", spin);
function spin(d){
    
    container.on("click", null);
    //all slices have been seen, all done
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }
    var  ps       = 360/data.length,
         pieslice = Math.round(1440/data.length),
         rng      = Math.floor((Math.random() * 1440) + 360);
        
    rotation = (Math.round(rng / ps) * ps);
    
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps/2);
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function(){
            //mark question as seen
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#111");
            //populate question
            priceDiv.textContent = `Your price is ${data[picked].label}`
            d3.select("#question h2")
                .text(data[picked].question);
            d3.select("#answer h2")
                .text(data[picked].answer);
            oldrotation = rotation;
            answerDiv.style.visibility = "hidden"
            /* Get the result value from object "data" */
            console.log(data[picked].value)
      
            /* Comment the below line for restrict spin to sngle time */
            container.on("click", spin);
        });
}
//make arrow
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
    .style({"fill":"black"});
//draw spin circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({"fill":"white","cursor":"pointer"});
//spin text
container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({"font-weight":"bold", "font-size":"30px"});


function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function(t) {
    return "rotate(" + i(t) + ")";
  };
}


function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}

function showAnswer(){
    answerShow=!answerShow
    if(answerShow){
        answerDiv.style.visibility = "visible"
        showButton.textContent = "Hide Answer"
        showButton.style.background = "red"
    }
    else {
        showButton.textContent = "Show Answer"
        showButton.style.background = "#4CAF50"
        answerDiv.style.visibility = "hidden"
    }
    
}
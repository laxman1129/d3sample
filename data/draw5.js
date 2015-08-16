$(document).ready(function() {
  console.log(data);
  draw(data);
});

var time_scale, percent_scale;

function draw(data) {
  "use strict";

   d3.select('body')
    .append('div')
      .attr('id','timeSeries');

  d3.select('body')
    .append('div')
      .attr('id','key');

  var container_dimensions = {width : 900,height:400},
      margins = {top:10, right:20, bottom:30, left:60},
      chart_dimentions = {
        width:container_dimensions.width - margins.left - margins.right,
        height : container_dimensions.height -margins.top -margins.bottom
      };
//*******************************START CHART***********************
  var chart = d3.select('#timeSeries')
              .append('svg')
                .attr('width', container_dimensions.width)
                .attr('height', container_dimensions.height)
              .append('g')
                .attr('transform','translate('+margins.left+','+margins.top+')')
                .attr('id','chart');

  time_scale = d3.time.scale()
                      .range([0,chart_dimentions.width])
                      .domain([new Date(2011,0,1),new Date(2011,1,11)]);

  percent_scale = d3.scale.linear()
                        .range([chart_dimentions.height,0])
                        .domain([0,100]);

  var time_axis = d3.svg.axis().scale(time_scale);
  var percent_axis = d3.svg.axis().scale(percent_scale).orient('left');

  chart.append('g')
      .attr('class','x axis')
      .attr('transform','translate(0,'+chart_dimentions.height+')')
      .call(time_axis);

  chart.append('g')
      .attr('class','y axis')
      .call(percent_axis);

  d3.select('.y.axis')
    .append('text')
      .text("percent of time")
      .attr('text-anchor','middle')
      .attr('transform','rotate(-270,0,0)')
      .attr('x',container_dimensions.height/2)
      .attr('y',50);
//*******************************END CHART***********************

//*******************************START KEY***********************
var key_items = d3.select('#key')
                  .selectAll('div')
                  .data(data.part1)
                  .enter()
                  .append('div')
                  .attr('class','key_line')
                  .attr('id',function(d){return d.line_id});

key_items.append('div')
        .attr('id',function(d){return 'key_item_'+d.line_id;})
        .attr('class','key_square');

key_items.append('div')
        .attr('class','key_label')
        .text(function(d){return d.line_name});

d3.selectAll('.key_line')
    .on('click', get_timeseries_data);

//*******************************END KEY*************************


};

function get_timeseries_data() {
  var id = d3.select(this).attr('id');

  var ts = d3.select('#'+id+'_path');
  if (ts.empty()) {
    var filtered_data = data.part2.filter(function(d) {
      return d.line_id === id;
    });
    draw_timeseries(filtered_data, id);
  } else {
    ts.remove();
  }
};

function draw_timeseries(data,id) {
  var line = d3.svg.line()
                .x(function(d){return time_scale(d.month);})
                .y(function(d){return percent_scale(d.late_percent);})
                .interpolate('linear');

  var g = d3.select('#chart')
            .append('g')
            .attr('id', id+'_path')
            .attr('class',id.split('_')[1]);

  g.append('path').attr('d',line(data));
/******Animation**********/
  g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx',function(d){return time_scale(d.month)})
    .attr('cy',function(d){return percent_scale(d.late_percent)})
    .attr('r',0);

    g.selectAll('circle')
    .on('mouseover',function(d){ d3.select(this).transition().attr('r',9);})
    .on('mouseout',function(d){ })

    g.selectAll("circle")
      .on("mouseover.tooltip", function(d){
          d3.select("text#" + d.line_id).remove();
          d3.select("#chart")
          .append("text")
          .text(d.late_percent + "%")
          .attr("x", time_scale(d.month) + 10)
          .attr("y", percent_scale(d.late_percent))
          .attr("id", d.line_id);
        });

    g.selectAll("circle")
          .on("mouseout.tooltip", function(d){
                d3.select("text#" + d.line_id)
                .attr("transform", "rotate(0)")
                .transition()
                .duration(500)
                .style("opacity",0)
                .attr("transform","translate(10,-10)").remove();
              });
    g.selectAll('circle')
      .transition()
      .delay(function(d,i){return i/data.length*1000;})
      .attr('r',5)
      .each('end', function(d,i){
            if (i === data.length -1) {
              console.log('entering the dungeon');
                add_lable(this,d,g);
            }
      });

  g.selectAll("circle")
        .on("mouseout", function(d,i){
            if (i !== data.length-1) {
                d3.select(this).transition().attr("r",  5)}
              });


/******Animation**********/
};

function add_lable(circle, data,g){
  d3.select(circle)
    .transition()
    .attr('r',9);

  g.append('text')
    .text(data.line_id.split('_')[1])
    .attr('x',time_scale(data.month))
    .attr('y',percent_scale(data.late_percent))
    .attr('dy','0.35em')
    .attr('class','linelabel')
    .attr('text-anchor','middle')
    .style('opacity',0)
    .style('fill','white')
    .transition()
      .style('opacity',1);
};

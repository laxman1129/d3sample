$(document).ready(function() {
  console.log(data);
  draw(data);
});

function draw(data) {
  "use strict";

  d3.select('body')
    .append('svg')
    .attr('width',width+margin)
    .attr('height',height+margin)
    .append('g')
      .attr('class','chart');

    d3.select('svg')
      .selectAll('circle.part1')
      .data(data.part1)
      .enter()
      .append('circle')
      .attr('class','part1');

    d3.select('svg')
      .selectAll('circle.part2')
      .data(data.part2)
      .enter()
      .append('circle')
      .attr('class','part2');

    var count_extent = d3.extent(data.part1.concat(data.part2), function(d){return d.count;});
    var count_scale = d3.scale.linear()
                        .range([height, margin])
                        .domain(count_extent);

    var time_extent = d3.extent(data.part1.concat(data.part2), function(d){return d.time;});
    var time_scale = d3.time.scale()
                        .range([margin,width])
                        .domain(time_extent);

    d3.selectAll('circle')
      .attr('cx', function(d){return time_scale(d.time);})
      .attr('cy', function(d){return count_scale(d.count);})
      .attr('r',5);

    var time_axis = d3.svg.axis().scale(time_scale);
    var count_axis = d3.svg.axis().scale(count_scale).orient('left');

    d3.select('svg')
      .append('g')
        .attr('class','x axis')
        .attr('transform','translate(0,'+height+')')
        .call(time_axis);

    d3.select('svg')
      .append('g')
        .attr('class','y axis')
        .attr('transform', 'translate('+margin+',0)')
        .call(count_axis);

    var line = d3.svg.line()
                .x(function (d){return time_scale(d.time);})
                .y(function (d){return count_scale(d.count);})
                .interpolate("linear");

    d3.select('svg')
      .append('path')
      .attr('d',line(data.part1))
      .attr('class','part1')
      .attr("stroke", "black")
      .attr("fill", "none");

    d3.select('svg')
      .append('path')
      .attr('d',line(data.part2))
      .attr('class','part2')
      .attr("stroke", "black")
      .attr("fill", "none");

    d3.select('.y.axis')
      .append('text')
      .text('count mean')
      .attr('transform', 'rotate(90,'+(-margin)+',0)')
      .attr('x',20)
      .attr('y',0);

    d3.select('.x.axis')
    .append('text')
    .text('Time')
    .attr('x', function(){return (width/1.6)-margin;})
    .attr('y',margin/1.5);
}

function donut (dataset, parameters) {
  var donut_box_side  = typeof parameters.donut_box_side   !== 'undefined' ? parameters.donut_box_side  : 100;
  var donut_font_size = typeof parameters.donut_font_size  !== 'undefined' ? parameters.donut_font_size : "12px";
  var donut_radius    = typeof parameters.donut_radius     !== 'undefined' ? parameters.donut_radius    : donut_box_side / 2;
  var inner_radius    = typeof parameters.inner_radius     !== 'undefined' ? parameters.inner_radius    : donut_radius - donut_radius / 2;

  var legend_width    = typeof parameters.legend_width     !== 'undefined' ? parameters.legend_width    : 200;
  var legend_height   = typeof parameters.legend_height    !== 'undefined' ? parameters.legend_height   : donut_box_side;
  var legend_font_size= typeof parameters.legend_font_size !== 'undefined' ? parameters.legend_font_size: "14px";
  var legend_rect_side= typeof parameters.legend_rect_side !== 'undefined' ? parameters.legend_rect_side: 18;
  var legend_translate= typeof parameters.legend_translate !== 'undefined' ? parameters.legend_translate: legend_rect_side + 2;
  var legend_padding  = typeof parameters.legend_padding   !== 'undefined' ? parameters.legend_padding  : 5;
  var maxEntries      = typeof parameters.maxEntries       !== 'undefined' ? parameters.maxEntries      : 19;

  var hole_text       = typeof parameters.hole_text        !== 'undefined' ? parameters.hole_text       : "";
 
  var othersQty = 0;

  var arc = d3.svg.arc()
    .outerRadius(donut_radius)
    .innerRadius(inner_radius);

  var quantities = [];
  dataset.forEach(function(d, i) {
    if (i<=maxEntries) quantities.push(d.qty);
    else if (i>maxEntries) quantities[maxEntries] = quantities[maxEntries]+=(d.qty);
  });
  
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d,i) { return quantities[i]; });

  var color_components = d3.scale.category20();

  var svg = d3.select(parameters.selector).append("svg")
      .attr("width", donut_box_side)
      .attr("height", donut_box_side)
      .append("g")
        .attr("transform", "translate(" + donut_box_side / 2 + "," + donut_box_side / 2 + ")");

  g = svg.selectAll(".arc")
      .data(pie(quantities))
      .enter().append("g")
        .attr("class", "arc");
  
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return color_components(i); });
/*  
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".5em")
      .style("text-anchor", "middle")
      .text(function(d,i) { return quantities[i]; })
          .attr("font-size", donut_font_size)
          .style("fill", "#ffffff");
*/
  g.append("text")
      .attr("dy", ".5em")
      .style("text-anchor", "middle")
      .text(hole_text)
          .attr("font-size", donut_font_size)
          .style("fill", "#2F4F4F");

  var entries = [];
  dataset.forEach(function(d, i) {
    if (i<maxEntries) entries.push(d.item);
    else if (i=maxEntries) entries.push("Altri");
  });
  color_components.domain(entries);

  if (legend_width != 0) {
    var legend_rows_x_column = Math.floor(legend_height/legend_translate);
    var legend_columns = Math.ceil(entries.length / legend_rows_x_column);
    var legend_column_width = legend_width / legend_columns;
      
    var legend = d3.select(parameters.selector).append("svg")
        .attr("class", "legend")
        .attr("width", legend_width)
        .attr("height", legend_height)
      .selectAll("g")
        .data(color_components.domain().slice())
      .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + (legend_padding + legend_column_width * Math.floor(i/legend_rows_x_column)) +"," + (i%legend_rows_x_column) * legend_translate + ")";
          });

    legend.append("rect")
        .attr("width", legend_rect_side)
        .attr("height", legend_rect_side)
        .style("fill", color_components);

    legend.append("text")
        .attr("dy", "1em")
        .attr("dx", (legend_rect_side + 2))
        .attr("font-size", legend_font_size)
        .text(function(d) { return d; });
  }
  
}


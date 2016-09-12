function bar_chart(selectId, divId) {

  var margin = {top: 20, right: 20, bottom: 30, left: 65},
      width = 380 - margin.left - margin.right,
      height = 150 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .innerTickSize(-width)
      .outerTickSize(0)
      .ticks(8, "$,");

  var d3_locale_itIT = d3.locale({
    decimal: ",",
    thousands: ".",
    grouping: [ 3 ],
    currency: [ "€ ", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%d/%m/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato" ],
    shortDays: [ "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab" ],
    months: [ "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre" ],
    shortMonths: [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic" ]
  });
  d3.format = d3_locale_itIT.numberFormat;

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#fff'>" + currencyFormatEur(d.importo) + "</span>";
  })
  var tip2 = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span style='color:#fff'>" + currencyFormatEur(d.importo_prec) + "</span>";
  })

  var svg = d3.select(selectId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  svg.call(tip2);

  var imp_mesi = document.getElementById("data_"+divId);
  var imp_mesi_prec = document.getElementById("preced_"+divId);
  var mesi = [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic" ];
  var data = [];
  for (i=0; i<12; i++) {
    data.push({mese: mesi[i], importo: parseFloat(imp_mesi.getElementsByTagName("li")[i].innerHTML),
      importo_prec: parseFloat(imp_mesi_prec.getElementsByTagName("li")[i].innerHTML) });
  };

  x.domain(data.map(function(d) { return d.mese; }));
  y.domain([0, d3.max(data, function(d) { return d.importo; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var bars = svg.selectAll(".bar").data(data).enter();

  bars.append("rect")
      .attr("class", "bar1")
      .attr("x", function(d) { return x(d.mese); })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.importo); })
      .attr("height", function(d) { return height - y(d.importo); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);


  bars.append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.mese) + x.rangeBand()/2; })
      .attr("width", x.rangeBand() / 2)
      .attr("y", function(d) { return y(d.importo_prec); })
      .attr("height", function(d) { return height - y(d.importo_prec); })
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);

  var rectangle = svg.append("rect")
                     .attr("x", width / 2 - 50)
                     .attr("y", height + 20)
                     .attr("width", 10)
                     .attr("height", 10)
                     .attr("class", "bar1");

      rectangle = svg.append("rect")
                     .attr("x", width / 2)
                     .attr("y", height + 20)
                     .attr("width", 10)
                     .attr("height", 10)
                     .attr("class", "bar2");

  var i = document.getElementById("anno").selectedIndex;
  var anno = document.getElementById("anno").options[i].text;
  var anno_prec = parseInt(anno) - 1;

  svg.append("text")
     .attr("class", "bar_chart_legend")
     .style("fill", "black")
     .attr("x", width / 2 - 38)
     .attr("y", height + 30)
     .text(anno);

  svg.append("text")
     .attr("class", "bar_chart_legend")
     .style("fill", "black")
     .attr("x", width / 2 + 12)
     .attr("y", height + 30)
     .text(anno_prec);

}

$('.sort_column').on('click', function () {
  memo = this.childNodes[1].className;
  switchOffSort();
  if (memo == "glyphicon glyphicon-sort-by-attributes active") {
    this.childNodes[1].className = "glyphicon glyphicon-sort-by-attributes-alt active"
  } else {
    this.childNodes[1].className = "glyphicon glyphicon-sort-by-attributes active"
  }
})

function switchOffSort() {
  var columns = document.getElementsByClassName("sort_column")
  for (i = 0; i < columns.length; i++) {
      columns[i].childNodes[1].className = "glyphicon glyphicon-sort";
  }
}

function getSelected(selectId) {
  var sel = document.getElementById(selectId);
  return sel.options[sel.selectedIndex].value;
}

function subAccounts(btnElement, divId, importo) {
  var divElement = document.getElementById(divId);
  var trElement = divElement.parentElement.parentElement
  toggleMultibutton(btnElement, trElement);
  if (btnElement.getAttribute("aria-expanded") == "false") return;

  var idConto = divElement.getAttribute('id');
  var anno = getSelected('anno');
  var livello = parseInt(divElement.previousElementSibling.innerText) + 1;
  var tipo_conto = getSelected('tipo_conto');

  var reqString = "movements/a.js?"
    .concat("conto=").concat(idConto)
    .concat("&anno=").concat(anno)
    .concat("&livello=").concat(livello)
    .concat("&tipo_conto=").concat(tipo_conto)
    .concat("&sort_column=importo&sort_order=DESC")
    .concat("&per_page=200")
    .concat("&importo=").concat(importo);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      divElement.innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("GET", reqString, true);
  xhttp.send();
};

function toggleMultibutton(button, toggledElement) {
  if (button.getAttribute("aria-expanded") == "true") {
    toggledElement.setAttribute("class", toggledElement.getAttribute("class").replace("collapse in", "collapse"));
    toggledElement.setAttribute("style", "height: 0px");
    toggledElement.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-expanded", "false");
  } else {
    if (toggledElement.getAttribute("class").indexOf("collapse in") < 0) {
      toggledElement.setAttribute("class", toggledElement.getAttribute("class").replace("collapse", "collapse in"));
    }
    toggledElement.setAttribute("style", "");
    toggledElement.setAttribute("aria-expanded", "true");
    buttons = button.parentElement.getElementsByTagName("a");
    for (i=0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-expanded", "false");
    }
    button.setAttribute("aria-expanded", "true");
  }
}

function grafici(btnElement, divId) {
  var divElement = document.getElementById(divId);
  var trElement = divElement.parentElement.parentElement
  toggleMultibutton(btnElement, trElement);
  if (btnElement.getAttribute("aria-expanded") == "false") return;

  while (divElement.firstChild) {
    divElement.removeChild(divElement.firstChild);
  }

  tabulatedValues(divElement, divId);

  var boostrap_row = document.createElement("DIV");
  boostrap_row.setAttribute("class", "row graphic_container");
  divElement.appendChild(boostrap_row);
  var boostrap_col = document.createElement("DIV");
  boostrap_col.setAttribute("class", "col-sm-6 col-md-5");
  boostrap_col.setAttribute("aria-hidden", "true");
  boostrap_row.appendChild(boostrap_col);

  bar_chart(boostrap_col, divId);

  boostrap_col = document.createElement("DIV");
  boostrap_col.setAttribute("id", "pie_charts_".concat(divId.replace(/\./g,"_")));
  boostrap_col.setAttribute("class", "col-sm-6 col-md-7");
  boostrap_row.appendChild(boostrap_col);

  var span = document.createElement("SPAN");
  span.setAttribute("class", "sr-only sr-only-focusable");
  boostrap_col.appendChild(span);
  var testo = document.createTextNode("Dimensioni in percentuale della voce rispetto ai livelli superiori");
  span.appendChild(testo);

  pie_charts(boostrap_col, divId);
}

function pie_charts(boostrap_col, divId) {
  var idConto = divId;
  var cumulatoAnno = parseFloat((document.getElementById("cumul_anno_".concat(idConto)).innerText).replace(/\./g,"").replace(',', '.'));

  var l = document.getElementById("livello").selectedIndex;
  var livello_top = parseInt(document.getElementById("livello").options[l].text);
  var livello_start = parseInt((document.getElementById("liv_conto_".concat(idConto)).innerText));
  for (i=livello_start; i>livello_top; i--) {
    idConto = block_donut(idConto, cumulatoAnno, divId, boostrap_col);
  }

  block_donut(idConto.substring(0,2), cumulatoAnno, divId, boostrap_col);
}

function block_donut(idConto, cumulatoAnno, divId, boostrap_col) {
  var block_pie = document.createElement("DIV");
  block_pie.setAttribute("id", "pie_chart_".concat(divId.replace(/\./g,"_")).concat(i));
  block_pie.setAttribute("class", "pie_box pull-left");
  boostrap_col.appendChild(block_pie);

  var donut_header = document.createElement("DIV");
  donut_header.setAttribute("class", "donut_text text-center");
  donut_header.style.maxWidth = "100px";

  idConto = chomp(idConto, '.');
  var cumulatoAnnoSup = parseFloat((document.getElementById("cumul_anno_".concat(idConto)).innerText).replace(/\./g,"").replace(',', '.'));
  var perc1 = (cumulatoAnno * 100) / cumulatoAnnoSup;
  var perc2 = (100 - perc1).toFixed(2);

  var span = document.createElement("SPAN");
  span.setAttribute("class", "sr-only sr-only-focusable");
  donut_header.appendChild(span);
  var testo = document.createTextNode(percentageFormatEur(perc1));
  span.appendChild(testo);

  testo = document.createTextNode("% sul totale di:");
  donut_header.appendChild(testo);
  block_pie.appendChild(donut_header);

  var donut_container = document.createElement("DIV");
  donut_container.setAttribute("id", "donut_".concat(divId.replace(/\./g,"_")).concat(i));
  donut_container.setAttribute("aria-hidden", "true");
  block_pie.appendChild(donut_container);

  var dataset = [
    {item:"", qty:perc1},
    {item:"", qty:perc2}
  ];
  var parameters = { selector: "#donut_".concat(divId.replace(/\./g,"_")).concat(i), hole_text: percentageFormatEur(perc1), legend_width: 0 };
  donut(dataset, parameters);

  var donut_footer = document.createElement("DIV");
  donut_footer.setAttribute("class", "donut_text text-center");
  donut_footer.style.maxWidth = "100px";
  testo = document.createTextNode(document.getElementById("voce_".concat(idConto)).innerText);
  donut_footer.appendChild(testo);
  block_pie.appendChild(donut_footer);

  return idConto;
}

function percentageFormatEur (num) {
  return num
        .toFixed(2) // always two decimal digits
        .replace(".", ",") // replace decimal point character with ,
}

function chomp(str, separator) {
  end = str.lastIndexOf(separator);
  return str.slice(0, end);
}

function currencyFormatEur (num) {
  return num
        .toFixed(2) // always two decimal digits
        .replace(".", ",") // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " €" // use . as a separator
}


function tabulatedValues(boostrap_col, divId) {
  var tabella = document.createElement("TABLE");
  tabella.setAttribute("id", "table_"+divId);
  tabella.setAttribute("class", "sr-only sr-only-focusable");

  var i = document.getElementById("anno").selectedIndex;
  var anno = document.getElementById("anno").options[i].text;
  var anno_prec = parseInt(anno) - 1;

  var mesi = [ "Gennaio", "Febraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre" ];
  var imp_mesi = document.getElementById("data_"+divId);
  var imp_mesi_prec = document.getElementById("preced_"+divId);

  var caption = document.createElement("CAPTION");
  tabella.appendChild(caption);
  var testo = document.createTextNode("Confronto anno corrente con anno precedente, mese per mese.");
  caption.appendChild(testo);

  var thead = document.createElement("THEAD");
  tabella.appendChild(thead);

  var riga= document.createElement("TR");
  riga.setAttribute("id", "tr_".concat(i));
  thead.appendChild(riga);

  var cella = document.createElement("TH");
  testo = document.createTextNode("mese");
  cella.appendChild(testo);
  riga.appendChild(cella);

  cella = document.createElement("TH");
  testo = document.createTextNode(anno);
  cella.appendChild(testo);
  riga.appendChild(cella);

  cella = document.createElement("TH");
  testo = document.createTextNode(anno_prec);
  cella.appendChild(testo);
  riga.appendChild(cella);

  var tbody = document.createElement("TBODY");
  tabella.appendChild(tbody);

  for (i=0; i<12; i++) {
    var riga= document.createElement("TR");
    riga.setAttribute("id", "tr_".concat(i));
    tbody.appendChild(riga);

    var cella = document.createElement("TD");
    var testo = document.createTextNode(mesi[i]);
    cella.appendChild(testo);
    riga.appendChild(cella);

    cella = document.createElement("TD");
    testo = document.createTextNode(currencyFormatEur(parseFloat(imp_mesi.getElementsByTagName("li")[i].innerHTML)));
    cella.appendChild(testo);
    riga.appendChild(cella);

    cella = document.createElement("TD");
    testo = document.createTextNode(currencyFormatEur(parseFloat(imp_mesi_prec.getElementsByTagName("li")[i].innerHTML)));
    cella.appendChild(testo);
    riga.appendChild(cella);
  }
  boostrap_col.appendChild(tabella);
}

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var markdownpdf = require("markdown-pdf");
var path = require('path');
var fs = require('fs');
var util = require('util');
var split = require('split');
var through = require('through');
var duplexer = require('duplexer');

var BASE_TEMPLATE = path.resolve(__dirname, 'template.md');
var ROW_TEMPLATE = path.resolve(__dirname, 'row.md');
var CSS_FILE = path.resolve(__dirname, 'bootstrap.css');

/*
* List of template fields and expected inputs excluding item_list 
* as it's processed separately.
*/
var CURRENCY_FIELDS = [
  'subtotal',
  'tax',
  'shipping',
  'paid',
  'balance',
];

var STRING_FIELDS = [
  'invoice_number',
  'date_now',
  'date_due',
  'from_name',
  'from_street',
  'from_city',
  'from_county',
  'from_post_code',
  'from_country',
  'client_name',
  'client_street',
  'client_city',
  'client_county',
  'client_post_code',
  'client_country',
];

function Invoice(options) {
  options = options || {};

  options.baseTemplate = options.baseTemplate || BASE_TEMPLATE;
  options.rowTemplate = options.rowTemplate || ROW_TEMPLATE;
  options.cssPath = options.cssPath || CSS_FILE;
  options.preProcessMd = populate;

  this.options = options;
}

Invoice.prototype.baseTemplate = '';
Invoice.prototype.rowTemplate = '';
Invoice.prototype.cssPath = '';
Invoice.prototype.input = {};

Invoice.prototype.generatePDFStream = function generatePDFStream(input) {
  this.options.input = input;

  return fs.createReadStream(this.options.baseTemplate)
  .pipe(markdownpdf(this.options));
};

function populate () {
  var splitter = split();
  var input = this.input;
  var rowTemplate = this.rowTemplate;
  var value, re, i;
  var replacer = through(function (data) {

    for (i = 0; i < CURRENCY_FIELDS.length; i++) {
      value = input[CURRENCY_FIELDS[i]] || 0;
      re = new RegExp(CURRENCY_FIELDS[i].toUpperCase(), 'g');
      data = data.replace(re, util.format(input.currencyFormat, value));
    }
    for (i = 0; i < STRING_FIELDS.length; i++) {
      value = input[STRING_FIELDS[i]] || '';
      re = new RegExp(STRING_FIELDS[i].toUpperCase(), "g");
      data = data.replace(re, value);
    }
    data = data.replace(/ITEM_LIST/g, generateItemList(input.items, input.currencyFormat, rowTemplate));
    this.queue(data + "\n");
  });

  splitter.pipe(replacer);
  return duplexer(splitter, replacer);
}
function generateItemList(items, currencyFormat, template) {
  var out = '';
  var row = fs.readFileSync(template, { encoding: 'utf8' });

  if (items) {
    items.forEach(function(element) {
      out += row
      .replace(/DESCRIPTION/g, element.description)
      .replace(/QUANTITY/g, element.quantity)
      .replace(/RATE/g, util.format(currencyFormat, element.rate))
      .replace(/AMOUNT/g, util.format(currencyFormat, element.amount));
    });
  }

  return out;
}

module.exports = Invoice;

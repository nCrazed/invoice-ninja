var markdownpdf = require("markdown-pdf");
var path = require('path');
var sculpt = require('sculpt');
var fs = require('fs');
var util = require('util');

var BASE_TEMPLATE = path.resolve(__dirname, 'template.md');
var ROW_TEMPLATE = path.resolve(__dirname, 'row.md');
var CSS_FILE = path.resolve(__dirname, 'bootstrap.css');

var ITEM_ROW = fs.readFileSync(ROW_TEMPLATE).toString()

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

var input;

function generateItemList(items) {
  var out = '';
  if (items) {
    items.forEach(function(element, i, array) {
      out += ITEM_ROW
      .replace(/DESCRIPTION/g, element.description)
      .replace(/QUANTITY/g, element.quantity)
      .replace(/RATE/g, util.format(input.currencyFormat, element.rate))
      .replace(/AMOUNT/g, util.format(input.currencyFormat, element.amount));
    });
  }

  return out;
}

function populate(chunk) {
  for (var i = 0; i < STRING_FIELDS.length; i++) {
    var value = input[STRING_FIELDS[i]] || '';
    var re = new RegExp(STRING_FIELDS[i].toUpperCase(), "g");
    chunk = chunk.replace(re, value);
  }
  for (var i = 0; i < CURRENCY_FIELDS.length; i++) {
    var value = input[CURRENCY_FIELDS[i]] || 0;
    var re = new RegExp(CURRENCY_FIELDS[i].toUpperCase(), "g");
    chunk = chunk.replace(re, util.format(input.currencyFormat, value));
  }
  chunk = chunk.replace(/ITEM_LIST/g, generateItemList(input.items));
  return chunk;
}

module.exports = function generateInvoice(options) {
  input = options

  return fs.createReadStream(BASE_TEMPLATE)
  .pipe(sculpt.split('\n'))
  .pipe(sculpt.map(populate))
  .pipe(sculpt.append('\n'))
  .pipe(markdownpdf({ cssPath: CSS_FILE }))
};

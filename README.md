invoice-ninja
=============

Simple invoice generator

Getting Started
---------------
```bash
npm install invoice-ninja
```

Example Usage
-------------
```js
var fs = require('fs');
var ninja = require('invoice-ninja');

today = new Date();
due = new Date()
due.setDate(today.getDate() + 14);

options = {
  currencyFormat: "£ %d",
  invoice_number: 1421,
  date_now: today.toDateString(),
  date_due: due.toDateString(),
  from_name: 'nCrazed',
  client_name: 'Client Inc.',
  items: [
    {
      description: 'Freebie',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ]
};

ninja(options).pipe(fs.createWriteStream('invoice.pdf'));
```

The above code would create a pdf file that looks like this:
![Example result](example.png)

Options
-------

#### options.currencyFormat
Type: `String`

Format string for currency values.
It's passed to `util.format` as the first argument and should include 
the currency symbol and the `%d` placeholder.

#### options.invoice_number
Type: `String`

#### options.date_now
Type: `String`

#### options.date_due
Type: `String`

#### options.subtotal
Type: `Number`

#### options.tax
Type: `Number`

#### options.shipping
Type: `Number`

#### options.paid
Type: `Number`

#### options.balance
Type: `Number`

#### options.from_name
Type: `String`

#### options.from_street
Type: `String`

#### options.from_city
Type: `String`

#### options.from_county
Type: `String`

#### options.from_post_code
Type: `String`

#### options.from_country
Type: `String`

#### options.client_name
Type: `String`

#### options.client_street
Type: `String`

#### options.client_city
Type: `String`

#### options.client_county
Type: `String`

#### options.client_post_code
Type: `String`

#### options.client_country
Type: `String`

#### options.items
Type: `Array`

Each element of the array represent a single item.

#### options.items.description
Type: `String`

#### options.items.quantity
Type: `String`

#### options.items.rate
Type: `Number`

#### options.items.amount
Type: `Number`


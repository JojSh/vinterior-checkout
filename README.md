# vinterior-checkout

This is simulated furniture shop checkout, capable of scanning items, applying promotional rules and returning a total. 

## Approach

Undertaken as a technical challenge for Vinterior, it was built using TDD, favouring a blackbox testing ethos.

Written in Node using ES6 JavasScript with Mocha and Chai for testing.

## Installation

After cloning this repo to your local directory, change into it and make sure your version of Node version is V13x +

```
npm i
```

## Tests

To run the Mocha unit tests:

```
npm test
```

## Usage

In index.js you will find some basic commands to run this application. To run from the command line use:

```
node .
```

The Checkout currently accepts two types of promotional rule, Overall Percentage Discount and Multiple Item Discount
as shown below:

```
const co = new Checkout([
  {
    type: 'percentageDiscount',
    threshold: 60,
    percentageReduction: 10,
  }, {
    type: 'multipleItemDiscount',
    barcode: '001',
    newPrice: 8.50,
}]);

co.scan('001');
co.scan('002');
co.scan('001');
co.scan('003');

console.log(co.total());
```
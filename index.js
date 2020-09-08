import Checkout from './src/checkout.js';

let co = new Checkout();
co.scan('001');

console.log(co.total());

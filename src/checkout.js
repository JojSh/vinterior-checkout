import products from './products.js';

class Checkout {
  constructor(promotional_rules) {
    this.rules = promotional_rules || '';
    this.basket = [];
  }

  scan(barcode) {
    this.basket.push(products[barcode]);
  }

  total() {
    return this.basket.reduce((total, item) => total + item.price, 0);
  }
}

export default Checkout;
import products from './products.js';
import applyPromotions from './applyPromotions.js';

class Checkout {
  constructor(promotional_rules) {
    this.rules = promotional_rules || [];
    this.basket = [];
  }

  scan(barcode) {
    if (products[barcode]) {
      this.basket.push(products[barcode]);
    } else {
      throw new Error('Invalid product code');
    }    
  }

  showBasketContents() {
    return this.basket;
  }

  formatAsGBP(number) {
    return `£${number}`;
  }

  total() {
    const subTotal = this.basket.reduce((acc, item) => acc + item.price, 0);
    const total = this.rules.length ? applyPromotions(subTotal, this.rules, this.basket) : subTotal;
    return this.formatAsGBP(total);
  }
}

export default Checkout;
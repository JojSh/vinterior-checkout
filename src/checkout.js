import products from './products.js';

class Checkout {
  constructor(promotional_rules) {
    this.rules = promotional_rules || [];
    this.basket = [];
  }

  scan(barcode) {
    this.basket.push(products[barcode]);
  }

  applyOverallDiscount(subTotal) {
    const rule = this.rules[0];
    const reductionFactor = 1 - (rule.percentageReduction / 100);
    return subTotal > rule.threshold ? subTotal * reductionFactor : acc;
  }

  total() {
    const subTotal = this.basket.reduce((acc, item) => acc + item.price, 0);
    return (this.rules.length) ? this.applyOverallDiscount(subTotal) : subTotal;
  }
}

export default Checkout;
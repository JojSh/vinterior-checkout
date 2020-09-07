import products from './products.js';

class Checkout {
  constructor(promotional_rules) {
    this.rules = promotional_rules || [];
    this.basket = [];
  }

  scan(barcode) {
    this.basket.push(products[barcode]);
  }

  applyPromotions(subTotal) {
    return this.rules.reduce((acc, rule) => {
      if (rule.type === 'overallDiscount') return this.applyOverallDiscount(acc, rule);
      if (rule.type === 'multipleItemDiscount') return this.applyMultipleItemDiscount(acc, rule);
    }, subTotal);
  }

  applyOverallDiscount(subTotal, rule) {
    const reductionFactor = 1 - (rule.percentageReduction / 100);
    return subTotal > rule.threshold ? subTotal * reductionFactor : acc;
  }

  applyMultipleItemDiscount(subTotal, rule) {
    const itemToReduce = products[rule.barcode];
    const itemReduction = itemToReduce.price - rule.newPrice;
    const discountableItemCount = this.basket.filter(item => item.barcode === rule.barcode).length;
    return subTotal - (itemReduction * discountableItemCount);
  }

  total() {
    const subTotal = this.basket.reduce((acc, item) => acc + item.price, 0);
    return this.rules.length ? this.applyPromotions(subTotal) : subTotal;
  }
}

export default Checkout;
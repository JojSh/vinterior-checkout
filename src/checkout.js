import products from './products.js';

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

  total() {
    const subTotal = this.basket.reduce((acc, item) => acc + item.price, 0);
    const total = this.rules.length ? this.applyPromotions(subTotal) : subTotal;
    return this.limitTo2DP(total);
  }

  applyPromotions(subTotal) {
    const sortedRules = this.sortRules(this.rules);
    return sortedRules.reduce((acc, rule) => {
      if (rule.type === 'percentageDiscount') return this.applyPercentageDiscount(acc, rule);
      if (rule.type === 'multipleItemDiscount') return this.applyMultipleItemDiscount(acc, rule);
    }, subTotal);
  }

  applyPercentageDiscount(subTotal, rule) {
    const reductionFactor = 1 - (rule.percentageReduction / 100);
    return subTotal > rule.threshold ? subTotal * reductionFactor : acc;
  }

  applyMultipleItemDiscount(subTotal, rule) {
    const itemToReduce = products[rule.barcode];
    const itemReduction = itemToReduce.price - rule.newPrice;
    const discountableItemCount = this.basket.filter(item => item.barcode === rule.barcode).length;
    return subTotal - (itemReduction * discountableItemCount);
  }

  sortRules(promotions) {
    // overall percentage discount should always be calculated last
    const percentageDiscountIndex = promotions.findIndex(item => item.type === 'percentageDiscount');
    const splicedRule = promotions.splice(percentageDiscountIndex, 1)[0];
    promotions.push(splicedRule);
    return promotions;
  }

  limitTo2DP (number) {
    return !Number.isInteger(number) ? Number(number.toFixed(2)) : number;
  }
}

export default Checkout;
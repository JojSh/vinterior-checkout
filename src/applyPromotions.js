import products from './products.js';
import { MULTIPLE_ITEM_DISCOUNT, PERCENTAGE_DISCOUNT } from './promotionTypes.js'

const promo_functions = {
  [MULTIPLE_ITEM_DISCOUNT]: applyMultipleItemDiscount,
  [PERCENTAGE_DISCOUNT]: applyPercentageDiscount,
}

function applyPromotions(subTotal, promos, basket) {
  // overall percentage promos should be calculated after any other promos
  const regularPromosSum = getRegularPromos(promos).reduce((acc, rule) => {
    return promo_functions[rule.type](acc, rule, basket)
  }, subTotal);
  const percentagePromo = getHighestEligiblePercentagePromo(promos, regularPromosSum);
  if (percentagePromo) return limitTo2DP(applyPercentageDiscount(regularPromosSum, percentagePromo));
  return limitTo2DP(regularPromosSum);
}

function getRegularPromos(promotions) {
  return promotions.filter(promo => promo.type !== PERCENTAGE_DISCOUNT);
}

function getHighestEligiblePercentagePromo(promotions, subTotal) {
  // the highest eligible overall percentage promo should override any others
  const eligiblePromos = promotions
    .filter(promo => promo.type === PERCENTAGE_DISCOUNT && subTotal > promo.threshold);
  return eligiblePromos.sort((a, b) => (a.threshold < b.threshold) ? 1: -1)[0];
}

function applyPercentageDiscount(subTotal, rule) {
  const reductionFactor = 1 - (rule.percentageReduction / 100);
  return subTotal > rule.threshold ? subTotal * reductionFactor : subTotal;
}

function applyMultipleItemDiscount(subTotal, rule, basket) {
  const itemToReduce = products[rule.barcode];
  const itemReduction = itemToReduce.price - rule.newPrice;
  const discountableItemCount = basket.filter(item => item.barcode === rule.barcode).length;
  return subTotal - (itemReduction * discountableItemCount);
}

function limitTo2DP(number) {
  return !Number.isInteger(number) ? Number(number.toFixed(2)) : number;
}

export default applyPromotions;
import chai from 'chai';
import products from '../src/products.js';
import { applyPromotions } from '../src/promoCalculator.js';

const { expect } = chai;

describe('promoCalculator', () => {
  describe('#applyPromotions', () => {
    it('calculates an overall discount when provided that promotional rule type', () => {
      const subTotal = 74.2;
      const promos = [{
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }];
      const basket = [ products['001'], products['002'], products['003']]
      expect(applyPromotions(subTotal, promos, basket)).to.equal(66.78);
    });

    it('does not apply the promotion when threshold is not met', () => {
      const subTotal = 74.2;
      const promos = [{
        type: 'percentageDiscount',
        threshold: 80,
        percentageReduction: 10,
      }];
      const basket = [ products['001'], products['002'], products['003']]
      expect(applyPromotions(subTotal, promos, basket)).to.equal(74.2);
    });

    it('applies discount to multiple items of a given type when provided that promotional rule type', () => {
      const subTotal = 38.45;
      const promos = [{
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }];
      const basket = [ products['001'], products['002'], products['001']]
      expect(applyPromotions(subTotal, promos, basket)).to.equal(36.95);
    });

    it('calculates combined discounts', () => {
      const subTotal =  83.45;
      const promos = [{
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }, {
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }];
      const basket = [ products['001'], products['002'], products['001'], products['003']];
      expect(applyPromotions(subTotal, promos, basket)).to.equal(73.76);
    });  

    it('calculates combined discounts in any order', () => {
      const subTotal =  83.45;
      const promos = [{
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }, {
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }];
      const basket = [ products['001'], products['002'], products['001'], products['003']];
      expect(applyPromotions(subTotal, promos, basket)).to.equal(73.76);
    });  

    it('takes only one eligible percentage discount, favouring the greatest value saving', () => {
      const subTotal = 83.45
      const promos = [{
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }, {
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }, {
        type: 'percentageDiscount',
        threshold: 70,
        percentageReduction: 20,
      }];
      const basket = [ products['001'], products['002'], products['001'], products['003']];
      expect(applyPromotions(subTotal, promos, basket)).to.equal(65.56);
    });
  });
});
import chai from 'chai';
import Checkout from '../src/checkout.js';

const { expect } = chai;

describe('Checkout', () => {

  describe('#scan', () => {
    it('should correctly store a valid item when a valid barcode is scanned', () => {
      const co = new Checkout();
      co.scan('001');
      expect(co.showBasketContents()[0].barcode).to.equal('001');
    });
  });

  describe('#showBasketContents', () => {
    it('should correctly display a list of scanned items', () => {
      const co = new Checkout();
      co.scan('001');
      co.scan('002');
      expect(co.showBasketContents()).to.deep.equal([
        { barcode: '001', name: 'Very Cheap Chair', price: 9.25 },
        { barcode: '002', name: 'Little table', price: 45.00 }
      ]);
    });
  });

  describe('#total', () => {
    it('returns the total when a single item is scanned in', () => {
      const co = new Checkout();
      co.scan('001');
      expect(co.total()).to.equal(9.25);
    });

    it('returns the total when a multiple items are scanned in', () => {
      const co = new Checkout();
      co.scan('002');
      co.scan('003');
      expect(co.total()).to.equal(64.95);
    });

    it('applies an overall discount when provided that promotional rule type', () => {
      const co = new Checkout([{
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }]);
      co.scan('001');
      co.scan('002');
      co.scan('003');
      expect(co.total()).to.equal(66.78);
    });

    it('applies discount to multiple items of a given type when provided that promotional rule type', () => {
      const co = new Checkout([{
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }]);
      co.scan('001');
      co.scan('003');
      co.scan('001');
      expect(co.total()).to.equal(36.95);
    });

    it('applies combined discounts', () => {
      const co = new Checkout([{
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }, {
        type: 'percentageDiscount',
        threshold: 60,
        percentageReduction: 10,
      }]);
      co.scan('001');
      co.scan('002');
      co.scan('001');
      co.scan('003');
      expect(co.total()).to.equal(73.76);
    });  
  
    it('applies combined discounts in any order', () => {
      const co = new Checkout([{
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
      expect(co.total()).to.equal(73.76);
    });
  });
});
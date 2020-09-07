import chai from 'chai';
import Checkout from '../src/checkout.js';

const { expect } = chai;

describe('Checkout', () => {

  describe('#scan', () => {
    it('should correctly store a valid item when a valid barcode is scanned ', () => {
      const co = new Checkout();
      co.scan('001');
    
      expect(co.basket[0]).to.be.an('object');
      expect(co.basket[0]).to.deep.include({
        barcode: '001',
        name: 'Very Cheap Chair',
        price: 9.25,
      });
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
      co.scan('002')
      co.scan('003')
      expect(co.total()).to.equal(64.95);
    });

    it('applies an overall discount when provided that promotional rule type', () => {
      const co = new Checkout([{
        type: 'overallDiscount',
        threshold: 60,
        percentageReduction: 10,
      }]);
      co.scan('001');
      co.scan('002')
      co.scan('003')
      expect(co.total()).to.equal(66.78);
    });

    it('applies discount to multiple items of a given type when provided that promotional rule type', () => {
      const co = new Checkout([{
        type: 'multipleItemDiscount',
        barcode: '001',
        newPrice: 8.50,
      }]);
      co.scan('001');
      co.scan('003')
      co.scan('001');
      expect(co.total()).to.equal(36.95);
    });
  });
});
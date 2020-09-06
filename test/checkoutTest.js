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
        id: '001',
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
  });
});
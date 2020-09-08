import chai from 'chai';
import Checkout from '../src/checkout.js';

const { expect } = chai;

describe('Checkout', () => {

  describe('#scan', () => {
    it('should correctly store a valid item when a valid barcode is scanned', () => {
      const co = new Checkout();
      co.scan('001');
      expect(co.showBasketContents()[0].barcode).to.equal('001');
      expect(co.showBasketContents().length).to.equal(1);
    });

    it('should throw an error when a non-existant item is scanned', () => {
      const co = new Checkout();
      expect(() => co.scan('999')).to.throw(Error, 'Invalid product code');
      expect(co.showBasketContents().length).to.equal(0);
    });

    it('should throw an error when invalid barcodes are scanned', () => {
      const co = new Checkout();
      expect(() => co.scan(1)).to.throw(Error, 'Invalid product code');
      expect(() => co.scan('one')).to.throw(Error, 'Invalid product code');
      expect(co.showBasketContents().length).to.equal(0);
    });
  });

  describe('#showBasketContents', () => {
    it('should correctly return a list of scanned items', () => {
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
    it('returns a total of zero when no items are scanned', () => {
      const co = new Checkout();
      expect(co.total()).to.equal('£0');
    });

    it('returns the total when a single item is scanned in', () => {
      const co = new Checkout();
      co.scan('001');
      expect(co.total()).to.equal('£9.25');
    });

    it('returns the total when a multiple items are scanned in', () => {
      const co = new Checkout();
      co.scan('002');
      co.scan('003');
      expect(co.total()).to.equal('£64.95');
    });
  });
});
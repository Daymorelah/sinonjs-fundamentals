
/* eslint-disable no-undef */
import getPrices from './currency.js';

const expect = chai.expect;

describe('currency test', () => {
  let fakeXhr, requests;
  beforeEach(() => {
    fakeXhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    fakeXhr.onCreate = (xhr) => {
      requests.push(xhr);
    };
  });
  afterEach(() => {
    fakeXhr.restore && fakeXhr.restore();
  });
  it('should return the same price when converting to USD', (done) => {
    const cb = (price) => {
      try{
        expect(price).to.equal('10.00');
        done();
      } catch(error) {
        done(error);
      } 
    };
    getPrices(10, 'USD', cb);
    const request = requests[0];
    request.respond(200, {'content-type':'application/json'},
      '{"rates": {"USD": 1} }');
  });
});
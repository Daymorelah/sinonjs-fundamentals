const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const controller = require('./book.controller');
const bookModel = require('../models').book;
const Transaction = require('../models').transaction;
const sinon = require('sinon');

describe('Books controller', () => {
  describe('When getting a list of books', () => {
    it('Should return 4 books', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      sinon.stub(bookModel, 'all').resolves([{},{},{},{}]);
      return controller.list(req, res).then(() => {
        return expect(res._getData().length).to.eql(4);
      });
    });
  });

  describe('When creating a book', () => {
    it('Should add the book to the database', () => {
      const book = {
        title: 'Test Book',
        author: 'John Q Public',
        publicationDate: '2018-01-01',
        isbn: '1234567890'
      };
      const req = httpMocks.createRequest({
        body: book
      });

      const res = httpMocks.createResponse();

      const spyOnCreate = sinon.spy(bookModel, 'create');

      return controller.create(req, res).then(() => {
        return expect(spyOnCreate.args[0][0].title).to.equal('Test Book');
      });
    });
  });

  describe('When getting a specific book', () => {
    describe('and the book does not exist', () => {
      afterEach(() => {
        bookModel.findById.restore();
      });
      it('Should return a 404', () => {
        const req = httpMocks.createRequest({
          params: {
            id: 7
          }
        });

        const res = httpMocks.createResponse();
        const stubFindMethod = sinon.stub(bookModel, 'findById');
        stubFindMethod.withArgs(7).resolves(null);
        return controller.getById(req, res).then(() => {
          return expect(res.statusCode).to.eql(404);
        });
      });
    });

    describe('and th ebook does exist', () => {
      it('should return 200', () => {
        const req = httpMocks.createRequest({
          params: {
            id: 5
          }
        });

        const res = httpMocks.createResponse();
        const stubFindMethod = sinon.stub(bookModel, 'findById');
        stubFindMethod.withArgs(5).resolves([{id:3, book: 'The mat'}]);
        return controller.getById(req, res).then(() => {
          return expect(res.statusCode).to.eql(200);
        });
      });
    });
  });

  describe('When purchasing a book', () => {
    it('should add a new transaction', () => {
      const req = httpMocks.createRequest({
        body: {amount: 43.10, user_id: 22},
        params: {id: 1}
      });
      const res = httpMocks.createResponse();

      const mockTransaction = sinon.mock(Transaction);

      mockTransaction.expects('create').once().withArgs({id: 1, user_id:22, amount: 43.10}).resolves({});

      return controller.purchase(req, res).then(() => {
        mockTransaction.verify();
      });
    });
  });
});

const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const sinon = require('sinon');
const userController = require('./user.controller');
const userModel = require('../models').user;
const wishList = require('../models').wishlist;

describe('When creating a user', () =>{
  let timer = {};
  afterEach(() => {
    wishList.create.restore && wishList.create.restore();
    userModel.create.restore && userModel.create.restore();
    timer.restore && timer.restore(); 
  });
  it('should have a customerSense field', () => {
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Shola',
        lastName: 'Qudus',
        email: 'shalewa@wemail.com',
      }
    });
    const res = httpMocks.createResponse();
    
    const newList = sinon.stub(wishList, 'create');
    newList.resolves({dataValues: {id: 1}});
    
    const spyUSerCreate = sinon.spy(userModel, 'create');
    
    return userController.create(req, res).then(() => {
      expect(spyUSerCreate.calledWith(sinon.match({
        customerSince: sinon.match.date
      }))).to.eql(true);

    });
  });

  it('should set the customer sinceField to new date', () => {
    timer = sinon.useFakeTimers();
    const req = httpMocks.createRequest({
      body: {
        firstName: 'Shola',
        lastName: 'Qudus',
        email: 'shalewa@wemail.com',
      }
    });
    const res = httpMocks.createResponse();
    
    const newList = sinon.stub(wishList, 'create');
    newList.resolves({dataValues: {id: 1}});
    
    const spyUserCreate = sinon.spy(userModel, 'create');
    
    return userController.create(req, res).then(() => {
      expect(spyUserCreate.args[0][0].customerSince).to.deep.equal(new Date());

    });
  });
});
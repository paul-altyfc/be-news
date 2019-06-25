// Placeholder
process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest');
const chai = require('chai');
// const chaiSorted = require('chai-sorted');
const { expect } = chai;
const connection = require('../db/connection.js');

describe('/', () => {
  after(() => {
    connection.destroy();
  });
  describe('/api', () => {
    describe('/topics', () => {
      it('GET status: 200, responds with an array of topics having the right properties', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an('array');
            expect(body.topics[0]).to.contain.keys('slug', 'description');
          });
      });
    });
  });
});

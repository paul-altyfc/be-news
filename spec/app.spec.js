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

  beforeEach(() => connection.seed.run());
  it('/not-a-route', () => {
    return request(app)
      .get('/not-a-route')
      .expect(404)
      .then(res => {
        expect(res.body.msg).to.equal('Not Found');
      });
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
      it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
        return request(app)
          .get('/api/topics999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not Found');
          });
      });
    });
    describe('/users', () => {
      describe('/:username', () => {
        it('GET status: 200, responds with a single user object', () => {
          return request(app)
            .get('/api/users/icellusedkars')
            .expect(200)
            .then(({ body }) => {
              expect(body.user.username).to.equal('icellusedkars');
              expect(body.user).to.contain.keys(
                'username',
                'name',
                'avatar_url'
              );
            });
        });
      });
      it('GET status: 404, responds with a message when an invalid username is passed', () => {
        return request(app)
          .get('/api/users/notausername')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'User not found with username notausername'
            );
          });
      });
    });
  });
});

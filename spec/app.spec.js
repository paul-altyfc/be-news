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
    // Test topics endpoints
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
    // Users endpoint tests
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
    // Article endpoint tests
    describe('/articles', () => {
      // NEEDS COMPLETING
      it('GET status: 200, responds with an article object', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            // expect(body.articles).to.be.an('array');
            // expect(body.articles[0]).to.contain.keys(
            //   'article_id',
            //   'title',
            //   'body',
            //   'topic',
            //   'created_at',
            //   'votes',
            //   'author',
            //   'comment_count'
            // );
          });
      });
      describe('/:article_id', () => {
        it('GET status: 200, responds with a single article based on its article_id', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0].article_id).to.equal(1);
              expect(body.articles[0]).to.contain.keys(
                'article_id',
                'title',
                'body',
                'topic',
                'created_at',
                'votes',
                'author',
                'comment_count'
              );
            });
        });
        it('GET status: 404, responds with a message when an invalid article_id is passed', () => {
          return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'Article not found with article_id 999'
              );
            });
        });
        it('GET status: 400, responds with a message a non integer article_id is passed', () => {
          return request(app)
            .get('/api/articles/notanid')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
      });
    });
  });
});

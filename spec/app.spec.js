// Placeholder
process.env.NODE_ENV = 'test';
const app = require('../app.js');
const request = require('supertest');
const chai = require('chai');
const chaiSorted = require('chai-sorted');
const { expect } = chai;
const connection = require('../db/connection.js');

chai.use(chaiSorted);

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
    it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
      return request(app)
        .get('/not-a-route')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not Found');
        });
    });
    it('INVALID METHOD status: 405, in /api', () => {
      const invalidMethods = ['patch', 'put', 'post', 'delete'];
      const methodsPromise = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed');
          });
      });
      return Promise.all(methodsPromise);
    });

    describe('/topics - endpoint tests', () => {
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
      it('INVALID METHOD status: 405, in /api/topics', () => {
        const invalidMethods = ['patch', 'put', 'post', 'delete'];
        const methodsPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodsPromise);
      });
    });
    // Users endpoint tests
    describe('/users - endpoint tests', () => {
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
        it('GET status: 404, responds with a message when an valid username is passed but no data is returned', () => {
          return request(app)
            .get('/api/users/999999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('User not found with username 999999');
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
        it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
          return request(app)
            .get('/api/users-not-a-route/1')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Not Found');
            });
        });
        it('INVALID METHOD status: 405, in /api/users/:username', () => {
          const invalidMethods = ['patch', 'put', 'post', 'delete'];
          const methodsPromise = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/icellusedkars')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal('Method not allowed');
              });
          });
          return Promise.all(methodsPromise);
        });
      });
    });
    // Article endpoint tests
    describe('/articles - endpoint tests', () => {
      // Sort_by and Order tests
      it('GET status: 200, responds with an array of articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
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
      it('GET status: 200, responds with an array of articles sorted by "created_at" in descending date order', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy('created_at');
          });
      });
      it('GET status 200: returns an array of articles sorted by "created_at" in the specified sort order', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy('created_at');
          });
      });
      it('GET status 200: returns an array of articles sorted by the specified column in the default descending sort order', () => {
        return request(app)
          .get('/api/articles?sort_by=title')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy('title');
          });
      });
      it('GET status 200: returns an array of comments - sorted in the specified sort order for the specified column', () => {
        return request(app)
          .get('/api/articles?sort_by=title&&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy('title');
          });
      });
      // Author filter
      it('GET status 200: returns an array of articles filtered by the author', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].author).to.be.equal('butter_bridge');
            const areAuthorsSame = body.articles.every(
              article => article.author === 'butter_bridge'
            );
            expect(areAuthorsSame).to.be.true;
          });
      });
      // Topic filter
      it('GET status 200: returns an array of articles filtered by the topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.be.equal('mitch');
            const areAuthorsSame = body.articles.every(
              article => article.topic === 'mitch'
            );
            expect(areAuthorsSame).to.be.true;
          });
      });
      // ERROR HANDLING TESTS
      it('GET status: 404, responds with a message when an invalid route is passed', () => {
        return request(app)
          .get('/api/articles-not-a-route')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not Found');
          });
      });
      it('GET status: 400, responds when an invalid sort_by column is passed', () => {
        return request(app)
          .get('/api/articles?sort_by=not-a-column')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid Column specified');
          });
      });
      it('GET status: 400, responds when an invalid order value is passed', () => {
        return request(app)
          .get('/api/articles?order=not-an-order-value')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'order needs to be either asc or desc the value not-an-order-value is not valid'
            );
          });
      });

      /*

       NEED TO CONTINUE FROM HERE 

      */

      // Invalid Methods test
      it('INVALID METHOD status: 405, in /api/articles', () => {
        const invalidMethods = ['patch', 'put', 'post', 'delete'];
        const methodsPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodsPromise);
      });
    });
    describe('/articles/:article_id', () => {
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
            expect(body.msg).to.equal('Article not found with article_id 999');
          });
      });
      it('GET status: 400, responds with a message a non integer article_id is passed', () => {
        return request(app)
          .get('/api/articles/notanid')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid value entered in URL');
          });
      });
      it('PATCH status: 200, does not change the vote property on a single article when passed an object with 0', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 0 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(100);
          });
      });
      it('PATCH status: 200, updates the votes property on a single article when passed an object with positive value', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(110);
          });
      });
      it('PATCH status: 200, reduces the vote property on a single article when passed an object with negative value', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0].votes).to.equal(90);
          });
      });
      it('PATCH status: 400, returns an error message when passed an object with a non numeric value', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'aa' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Unable to update votes with a value of aa'
            );
          });
      });
      it('INVALID METHOD status: 405, in /api/articles/:article_id', () => {
        const invalidMethods = ['put', 'post', 'delete'];
        const methodsPromise = invalidMethods.map(method => {
          return request(app);
          [method]('/api/articles/1')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodsPromise);
      });
    });
    describe('/articles/:article_id/comments', () => {
      it('POST status 201: adds a new comment to a single comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'butter_bridge', body: 'pauls test comment' })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.author).to.equal('butter_bridge');
            expect(body.comment.body).to.equal('pauls test comment');
          });
      });
      it('POST status 400: returned when invalid user is entered', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'not-a-user', body: 'pauls test comment 2' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Attempted to insert or update a field that is not present on the linked primary table'
            );
          });
      });
      it('GET status 200: returns an array of comments for specified article_id', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain.keys(
              'comment_id',
              'votes',
              'body',
              'created_at',
              'author'
            );
          });
      });
      it('GET status 200: returns an array of comments sorted by in default descending order by the default "created_at" column for specified article_id', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.descendingBy('created_at');
            expect(body.comments[0]).to.contain.keys(
              'comment_id',
              'votes',
              'body',
              'created_at',
              'author'
            );
          });
      });
      it('GET status 200: returns an array of comments sorted by the specified sort order by the specified column for specified article_id', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=author&&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('author');
            expect(body.comments[0]).to.contain.keys(
              'comment_id',
              'votes',
              'body',
              'created_at',
              'author'
            );
          });
      });
      it('INVALID METHOD status: 405, in /api/articles/:article_id/comments', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const methodsPromise = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles/1/comments')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed');
            });
        });
        return Promise.all(methodsPromise);
      });
    });
    // Comments endpoint tests
    describe('/comments - endpoint tests', () => {
      describe('/:comment_id', () => {
        it('DELETE status: 204, removes the comment from the database', () => {
          return request(app)
            .delete('/api/comments/2')
            .expect(204);
        });
        it('DELETE status: 404, attempting to delete a valid comment_id that does not exist on the database', () => {
          return request(app)
            .delete('/api/comments/999999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Comment with id 999999 not found');
            });
        });
        it('DELETE status: 404, attempting to delete comment with an invalid id', () => {
          return request(app)
            .delete('/api/comments/not-an-id')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Invalid value entered in URL');
            });
        });
        it('PATCH status: 200, does not change the vote property on a single comment when passed an object with 0', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 0 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(16);
            });
        });
        it('PATCH status: 200, updates the votes property on a single comment when passed an object with positive value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(26);
            });
        });
        it('PATCH status: 200, reduces the vote property on a single comment when passed an object with negative value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0].votes).to.equal(6);
            });
        });
        it('PATCH status: 400, returns an error message when passed an object with a non numeric value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'not-an-int' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'Unable to update comment votes with a value of not-an-int'
              );
            });
        });
        it('INVALID METHOD status: 405, in /api/comments/:comment_id', () => {
          const invalidMethods = ['get', 'put', 'post'];
          const methodsPromise = invalidMethods.map(method => {
            return request(app)
              [method]('/api/comments/1')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal('Method not allowed');
              });
          });
          return Promise.all(methodsPromise);
        });
      });
    });
  });
});

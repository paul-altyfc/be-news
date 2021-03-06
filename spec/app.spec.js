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
    // Test api endpoints
    it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
      return request(app)
        .get('/not-a-route')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Not Found');
        });
    });
    it('GET status: 200, displays the endpoint.json file', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
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

    // Topics enpoint tests
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
      it('POST status 201: adds a new topic', () => {
        return request(app)
          .post('/api/topics')
          .send({ slug: 'anna', description: 'loves her cats suki and lucy' })
          .expect(201)
          .then(({ body }) => {
            expect(body.topic.slug).to.equal('anna');
            expect(body.topic.description).to.equal(
              'loves her cats suki and lucy'
            );
          });
      });
      // Error Handling
      it('POST status 422: attempt to add a new topic with the same primary key as an existing user', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'mitch',
            description: 'http://www.altyfans.co.uk'
          })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal('Key (slug)=(mitch) already exists.');
          });
      });
      it('POST status 400: returned with additional fields in the values to be inserted', () => {
        return request(app)
          .post('/api/topics')
          .send({
            slug: 'paul',
            description: 'pauls test topic description',
            invalidfield: 'Not valid'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only slug and description are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with not enough fields in the values to be inserted', () => {
        return request(app)
          .post('/api/topics')
          .send({
            description: 'pauls topics test description'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only slug and description are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with no values to be inserted', () => {
        return request(app)
          .post('/api/topics')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only slug and description are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with the correct number of fields but wrong keys', () => {
        return request(app)
          .post('/api/topics')
          .send({
            user: 'butter_bridge',
            body: 'pauls test comment 2'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'The values provided need to be named slug and description'
            );
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
        const invalidMethods = ['patch', 'put', 'delete'];
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
      it('GET status 200, returns an array of the users', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body }) => {
            expect(body.users).to.be.an('array');
            expect(body.users[0]).to.contain.keys(
              'username',
              'avatar_url',
              'name'
            );
          });
      });
      it('POST status 201: adds a new user', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'sammyd',
            avatar_url: 'http://www.altyfans.co.uk',
            name: 'sam_d'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.user.username).to.equal('sammyd');
            expect(body.user.avatar_url).to.equal('http://www.altyfans.co.uk');
            expect(body.user.name).to.equal('sam_d');
          });
      });
      // Error Handling
      it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
        return request(app)
          .get('/api/users999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Not Found');
          });
      });

      it('POST status 422: attempt to add a new user with the same primary key as an existing user', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'butter_bridge',
            avatar_url: 'http://www.altyfans.co.uk',
            name: 'sam_d'
          })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (username)=(butter_bridge) already exists.'
            );
            //expect(body.user.avatar_url).to.equal('http://www.altyfans.co.uk');
            //expect(body.user.name).to.equal('sam_d');
          });
      });
      it('POST status 400: returned with additional fields in the values to be inserted', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'sammyd',
            avatar_url: 'http://www.altyfans.co.uk',
            name: 'sam_d',
            invalidfield: 'not allowed'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for username, avatar_url and name'
            );
          });
      });
      it('POST status 400: returned with not enough fields in the values to be inserted', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'sammyd',
            avatar_url: 'http://www.altyfans.co.uk'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for username, avatar_url and name'
            );
          });
      });
      it('POST status 400: returned with no values to be inserted', () => {
        return request(app)
          .post('/api/users')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for username, avatar_url and name'
            );
          });
      });
      it('POST status 400: returned with the correct number of fields but wrong keys', () => {
        return request(app)
          .post('/api/users')
          .send({
            usern: 'sammyd',
            avatar: 'http://www.altyfans.co.uk',
            nam: 'sam_d'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'The values provided need to be named username, avatar_url and name'
            );
          });
      });
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
        it('GET status: 404, responds with Not Found when passed a route that does not exist ', () => {
          return request(app)
            .get('/api/users-not-a-route/1')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Not Found');
            });
        });

        it('INVALID METHOD status: 405, in /api/users/:username', () => {
          const invalidMethods = ['patch', 'put', 'delete'];
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
            expect(body.total_count).to.equal(12);
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
      it('GET status: 200, adds a total_count key/value pair to the articles object', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            // console.log(body.articles);
            expect(body.total_count).to.equal(12);
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
      // Article Limit and offset filters
      it('GET status 200: responds with the first 10 articles when passed no limit query', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the articles when passed null as the limit in the query', () => {
        return request(app)
          .get('/api/articles?limit=null')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the articles when passed no value as the limit in the query', () => {
        return request(app)
          .get('/api/articles?limit=')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the articles when passed undefined as the limit in the query', () => {
        return request(app)
          .get('/api/articles?limit=undefined')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 2 articles when passed 2 as the limit in the query', () => {
        return request(app)
          .get('/api/articles?limit=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(2);
          });
      });
      it('GET status 200: responds with all the articles when non-numeric value passed as the limit in the query', () => {
        return request(app)
          .get('/api/articles?limit="a"')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 10 articles when passed no offset query', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
            expect(body.articles[0].article_id).to.equal(1);
          });
      });
      it('GET status 200: responds with the articles when passed no offset query', () => {
        return request(app)
          .get('/api/articles?p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles[0].article_id).to.equal(11);
          });
      });
      it('GET status 200: responds with the articles when passed a non numeric offset in the query', () => {
        return request(app)
          .get('/api/articles?p="a"')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles[0].article_id).to.equal(1);
          });
      });
      it('GET status 200: responds with the articles when passed a limit and offset in the query', () => {
        return request(app)
          .get('/api/articles?limit=2&&p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles[0].article_id).to.equal(3);
          });
      });
      it('GET status 200: responds with the first 10 articles when passed null as the offset in the query', () => {
        return request(app)
          .get('/api/articles?p=null')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 10 articles when passed no value as the offset in the query', () => {
        return request(app)
          .get('/api/articles?p=')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 10 articles when passed undefined as the offset in the query', () => {
        return request(app)
          .get('/api/articles?offset=undefined')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles.length).to.equal(10);
          });
      });
      it('POST status 201: adds a new topic', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'How to look after cats',
            body:
              'this is the first book in a series about how to look after your pet cats',
            topic: 'cats',
            author: 'rogersop'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.article_id).to.equal(13);
            expect(body.article.title).to.equal('How to look after cats');
            expect(body.article.body).to.equal(
              'this is the first book in a series about how to look after your pet cats'
            );
            expect(body.article.topic).to.equal('cats');
            expect(body.article.author).to.equal('rogersop');
          });
      });

      it('DELETE status: 204, removes the article from the database', () => {
        return request(app)
          .delete('/api/articles/5')
          .expect(204);
      });
      // ERROR HANDLING TESTS
      it('DELETE status: 404, attempting to delete a valid article_id that does not exist on the database', () => {
        return request(app)
          .delete('/api/articles/999999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Article with id 999999 not found');
          });
      });
      it('DELETE status: 404, attempting to delete article with an invalid id', () => {
        return request(app)
          .delete('/api/articles/not-an-id')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid value entered in URL');
          });
      });

      it('POST status 400: returned with additional fields in the values to be inserted', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'How to look after cats',
            body:
              'this is the first book in a series about how to look after your pet cats',
            topic: 'cats',
            author: 'rogersop',
            invalidfield: 'Not valid'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for title, body, topic and author'
            );
          });
      });
      it('POST status 400: returned with not enough fields in the values to be inserted', () => {
        return request(app)
          .post('/api/articles')
          .send({
            body:
              'this is the first book in a series about how to look after your pet cats',
            topic: 'cats',
            author: 'rogersop'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for title, body, topic and author'
            );
          });
      });
      it('POST status 400: returned with no values to be inserted', () => {
        return request(app)
          .post('/api/articles')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'You need to provide values for title, body, topic and author'
            );
          });
      });
      it('POST status 400: returned with the correct number of fields but wrong keys', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'How to look after cats',
            bodytext:
              'this is the first book in a series about how to look after your pet cats',
            topic: 'cats',
            author: 'rogersop'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'The values provided need to be named title, body, topic and author'
            );
          });
      });
      it('POST status 400: returned with a non acceptable value in a foreign key field in the values to be inserted', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'How to look after cats',
            body:
              'this is the first book in a series about how to look after your pet cats',
            topic: 'cat',
            author: 'rogersop'
          })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (topic)=(cat) is not present in table "topics".'
            );
          });
      });

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
      it('GET status: 404, responds when an author that is not in the database is passed', () => {
        return request(app)
          .get('/api/articles?author=not-in-db')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Author not found');
          });
      });
      it('GET status: 404, responds when no author is entered but the query parameter is present', () => {
        return request(app)
          .get('/api/articles?author=')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Author not found');
          });
      });
      it('GET status: 404, responds when a topic that is not in the database is passed', () => {
        return request(app)
          .get('/api/articles?topic=not-in-db')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Topic not found');
          });
      });
      it('GET status: 404, responds when no topic is entered but the query parameter is present', () => {
        return request(app)
          .get('/api/articles?topic=')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Topic not found');
          });
      });
      // Consider adding a test for both Author and Topic being sent

      // Invalid Methods test
      it('INVALID METHOD status: 405, in /api/articles', () => {
        const invalidMethods = ['patch', 'put'];
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
            expect(body.article.article_id).to.equal(1);
            expect(body.article).to.contain.keys(
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
            expect(body.msg).to.equal('No articles with id 999 were found');
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
            expect(body.article.votes).to.equal(100);
          });
      });
      it('PATCH status: 200, updates the votes property on a single article when passed an object with positive value', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(110);
          });
      });
      it('PATCH status: 200, reduces the vote property on a single article when passed an object with negative value', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(90);
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
      it('PATCH status: 400, returns an error message when passed an empty object', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('No value passed to update votes');
          });
      });
      it('PATCH status: 400, passed an object with multiple values', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 5, name: 'Paul' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'The inc_votes value should be a single item. Multiple items were passed'
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
              'author',
              'article_id'
            );
          });
      });
      it('GET status 200: returns an array of empty comments for specified article_id', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.eql([]);
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
              'author',
              'article_id'
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
              'author',
              'article_id'
            );
          });
      });
      // Article Comments Limit and offset filters
      it('GET status 200: responds with all the comments when passed no limit query', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(2);
          });
      });
      it('GET status 200: responds with with all the comments when passed null as the limit in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=null')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the comments when passed no value as the limit in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the comments when passed undefined as the limit in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=undefined')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 2 comments when passed 2 as the limit in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(2);
          });
      });
      it('GET status 200: responds with all the comments when non-numeric value passed as the limit in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit="a"')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with all the comments when passed no offset query', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
            expect(body.comments[0].article_id).to.equal(1);
          });
      });
      it('GET status 200: responds with the comments when passed a numeric offset query', () => {
        return request(app)
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0].comment_id).to.equal(12);
          });
      });
      it('GET status 200: responds with the comments when passed a non numeric offset in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?p="a"')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0].comment_id).to.equal(2);
          });
      });
      it('GET status 200: responds with the comments when passed a limit and offset in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=2&&p=2')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0].comment_id).to.equal(4);
          });
      });
      it('GET status 200: responds with the first 10 comments when passed null as the offset in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?p=null')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 10 comments when passed no value as the offset in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?p=')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      it('GET status 200: responds with the first 10 comments when passed undefined as the offset in the query', () => {
        return request(app)
          .get('/api/articles/1/comments?offset=undefined')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments.length).to.equal(10);
          });
      });
      // End of Limit and Offset tests
      // Error Handling
      it('GET status 400: returned when invalid article_id is entered', () => {
        return request(app)
          .post('/api/articles/not-an-int/comments')
          .send({ username: 'mitch', body: 'pauls test comment 2' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid value entered in URL');
          });
      });
      it('GET status 404: returned when valid article_id not in the database is entered', () => {
        return request(app)
          .get('/api/articles/999999/comments')
          .send({ username: 'mitch', body: 'pauls test comment 2' })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('No article with the id of 999999 found');
          });
      });
      it('POST status 400: returned when invalid username is entered', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'not-a-user', body: 'pauls test comment 2' })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (author)=(not-a-user) is not present in table "users".'
            );
          });
      });
      it('POST status 422: returned when a valid article_id that is not on the database is entered', () => {
        return request(app)
          .post('/api/articles/999999/comments')
          .send({ username: 'mitch', body: 'pauls test comment 2' })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (author)=(mitch) is not present in table "users".'
            );
          });
      });
      it('POST status 400: returned with additional fields in the values to be inserted', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'butter_bridge',
            body: 'pauls test comment 2',
            invalidfield: 'Not valid'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only username and body are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with not enough fields in the values to be inserted', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            body: 'pauls test comment 2'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only username and body are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with no values to be inserted', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Only username and body are acceptable input values'
            );
          });
      });
      it('POST status 400: returned with the correct number of fields but wrong keys', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            user: 'butter_bridge',
            body: 'pauls test comment 2'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'The values provided need to be named username and body'
            );
          });
      });
      // Method Error Handling
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
              expect(body.comment.votes).to.equal(16);
            });
        });
        it('PATCH status: 200, updates the votes property on a single comment when passed an object with positive value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(26);
            });
        });
        it('PATCH status: 200, reduces the vote property on a single comment when passed an object with negative value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: -10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(6);
            });
        });
        it('PATCH status: 400, returns an error message when passed an object with a non numeric value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'not-an-int' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'Unable to update votes with a value of not-an-int'
              );
            });
        });
        it('PATCH status: 400, returns an error message when passed an empty object', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('No value passed to update votes');
            });
        });
        it('PATCH status: 400, passed an object with multiple values', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 5, name: 'Paul' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                'The inc_votes value should be a single item. Multiple items were passed'
              );
            });
        });
        it('PATCH status: 404, responds with a message when an invalid comment_id is passed', () => {
          return request(app)
            .patch('/api/comments/999')
            .send({ inc_votes: 50 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('No comments with id 999 were found');
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

# News API

This application provides a series of endpoints that are utilised by the deployed Front End and allows users to create, update, amend and delete news articles. 

The main aspects of the solution are:

- users - registered users can create articles and comments
- topics - a number of topic areas that have articles in the database
- articles - are associated with topics that exist in the application
- comments - can be written about articles

Users can add votes to articles and comments

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

The application uses a PostGres (PSQL) database and uses Knex to interact with it

The source code is stored in a Github Repository. Please refer to the Github documentation is you need any help in setting up a new repository


[Github documentation](https://help.github.com/en#dotcom)
[News API Project Github](https://github.com/paul-altyfc/be-news)


**Please clone this repository but DO NOT fork it**

### Installing and Running in local development environment

## 1. Set up the Backend Repository

Create a parent directory on your local machine that will hold the application. In a terminal window cd <new directory>

In the new directory run 

```console
git clone https://github.com/paul-altyfc/be-news.git
cd be-news
```

Create your own **public** repository on Github. **Make sure NOT to initialise it with a README or .gitignore.**

Now hook up your cloned version to the newly created repo using the following terminal commands.

```console
git remote -v

// This will display a urls to the original repo 
origin	https://github.com/paul-altyfc/be-news.git (fetch)
origin	https://github.com/paul-altyfc/be-news.git (push)
```

```console
git remote remove origin

// This will prevent your cloned version from pushing to the original repository
```

```console
git remote -v

// This should now show nothing
```

```console
git remote add origin <YOUR-GITHUB-URL>

// This will add your github location to your local git repository
```

```console
git remote -v
```

### Prerequisites

This section provides details of the javascript components that need to be installed and how they can be installed.

Installing Dependencies

Once you have cloned the repo navigate to the root of the project and run the following command to install the dependencies listed in the package.json:

```bash
npm install
```
This installs the following dependencies with the currently deployed versions:

```package.json
   "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "knex": "^0.17.6",
    "pg": "^7.11.0"
  },
  "devDependencies": {
    "chai": "^4.2.0",
    "chai-sorted": "^0.2.0",
    "mocha": "^6.2.0",
    "supertest": "^4.0.2"
  }
```
## 2. Setting up your project

You will need to create a **knexfile.js** that hold database connection information in the root folder

```js
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      user: <your postgres user>,
      password: <your postgres password>
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      user: <your postgres user>,
      password: <your postgres password>
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };
```

**If you are on linux insert your postgres username and password into the knexfile.**

The `db` folder and it's sub folders holds the files used to create the database and populate it with some test data.  The files in the seeds, migration and utils directory are used to create development and test databases that are used by the application

## 3. Creating the database

PostgreSQL needs to be installed and configured before the database can be created and populated by running 

```console
npm run setup-dbs
npm run seed
```
## 4. RESTful API Endpoint routes exposed by teh application

## The application provides the following endpoints

```http
GET /api

GET /api/topics
POST /api/topics

POST /api/users
GET /api/users

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id
DELETE /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id
```

### Route Requirements

_**All of your endpoints send the below responses in an object, with a key name of what it is that is being sent. E.g.**_

```
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```
It is possible to see all the users in the system by accessing this url https://article-reviews.herokuapp.com/api/users

## Testing the system

The application was created following a Test Driven Development (TDD) methodology. The test files are held in the spec folder and are split into separate files for the main application (app.spec.js) and utilities (utils.spec.js).

The automated application tests can be ran with the following commands 
```console
npm test
```
To test the utility functions execute
```console
npm run test-utils
```
### Testing Approach

The tests are broken down by endpoints to allow automated unit, integration and system testing to be performed on the application.

```
An example is the testing of articles which is broken down into separate tests for

/articles
/articles/:article_id
/articles/:article_id/comments
```
## Deployment

The application was deployed using [Heroku](https://www.heroku.com/) 

## Built With

- [Express.js](https://expressjs.com/) - The web framework used
- [Knex.js](http://knexjs.org/) - SQL Query Buildeer 
- [Mocha](https://mochajs.org/) - Testing framework
- [Chai](https://www.chaijs.com/) - TDD assertion library



## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Paul Dewey** - _Initial work_ - [PaulDewey](https://github.com/paul-altyfc)

## Acknowledgments

- **Northcoders** [Northcoders](https://northcoders.com/) tutors for providing assistance and validating the application

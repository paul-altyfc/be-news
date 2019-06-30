# News API

The application allows you to create, update, amend and delete news articles. The main aspects of the solution are:

- users - only registered users can create articles and comments
- topics
- articles - are associated with topics that exist in the application
- comments - can be written about articles

Users can add votes to articles and comments

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This section provides details of the javascript components that need to be installed and how they can be installed.

**Please clone this repository but do not fork it**

The application uses a PostGres (PSQL) database and uses Knex to interact with it

```
[Knex](https://knexjs.org)
```

The source code is stored in a Github Repository. Please refer to the Github documentation is you need any help in setting up a new repository

```
[Github documentation](https://help.github.com/en#dotcom)
[News API Project Github](https://github.com/paul-altyfc/be-news)
```

**Please clone this repository but do not fork it**

### Installing

Step by step instructions to get a development env running

## Step 1 - Setting up the Repository

Your first task is set up your own portfolio repository. Once you have cloned this repo, on github create your own **public** repo for your review. **Make sure NOT to initialise it with a README or .gitignore.**

Next, you should hook your cloned version to the newly created repo using the following terminal commands.

```console
cd be-news)
```

```js
git remote -v

// This should display a url to the News API repo
```

```js
git remote remove origin

// This will remove your cloned version from pushing to the original repository
```

```js
git remote -v

// This should now show nothing
```

```js
git remote add origin <YOUR-GITHUB-URL>

// This will add your github location to your local git repository
```

```js
git remote -v

// This should now show your repo url and you are good to go...
```

## Step 2 - Setting up your project

The repo provided you with the knexfile. Make sure to add it to the `.gitignore` once you start pushing to your own repository. If you are on linux insert your postgres username and password into the knexfile.

You have also been provided with a `db` folder with some data, a [setup.sql](./db/setup.sql) file, a `seeds` folder and a `utils` folder. You should take a minute to familiarise yourself with the npm scripts you have been provided.

The files in the seeds, migration and utils directory are used to create development and test databases that are used by the application

## Step 3 - Database Tables

The application has separate tables for `topics`, `articles`, `users` and `comments`.

Each topic has:

- `slug` field which is a unique string that acts as the table's primary key
- `description` field which is a string giving a brief description of a given topic

Each user has:

- `username` which is the primary key & unique
- `avatar_url`
- `name`

Each article has:

- `article_id` which is the primary key
- `title`
- `body`
- `votes` defaults to 0
- `topic` field which references the slug in the topics table
- `author` field that references a user's primary key (username)
- `created_at` defaults to the current timestamp

Each comment has:

- `comment_id` which is the primary key
- `author` field that references a user's primary key (username)
- `article_id` field that references an article's primary key
- `votes` defaults to 0
- `created_at` defaults to the current timestamp
- `body`

## Step 4 - Endpoint routes

## The application has the following endpoints

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

---

### Route Requirements

_**All of your endpoints send the below responses in an object, with a key name of what it is that is being sent. E.g.**_

```json
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

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

- [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
- [Maven](https://maven.apache.org/) - Dependency Management
- [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Paul Dewey** - _Initial work_ - [PaulDewey](https://github.com/paul-altyfc)

## Acknowledgments

- **Northcoders** [Northcoders](https://northcoders.com/) tutors for providing assistance and validating the application

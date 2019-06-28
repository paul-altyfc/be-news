const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../index.js');

const { formatDate, formatComments, makeRefObj } = require('../utils/utils.js');

exports.seed = function(knex, Promise) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics')
        .insert(topicData)
        .returning('*');
      const usersInsertions = knex('users')
        .insert(userData)
        .returning('*');
      return Promise.all([topicsInsertions, usersInsertions])
        .then(([topicsInsertions, usersInsertions]) => {
          const formattedArticles = formatDate(articleData);
          return knex('articles')
            .insert(formattedArticles)
            .returning('*');
        })

        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);

          // Format the date field within the comments data
          const commentDataWithDate = formatDate(commentData);

          const formattedComments = formatComments(
            commentDataWithDate,
            articleRef
          );
          return knex('comments')
            .insert(formattedComments)
            .returning('*');
        });
    });
};

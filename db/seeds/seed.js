const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../index.js');

// console.log({ userData });

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
          //console.log(topicsInsertions, 'article');
          //console.log(usersInsertions, 'users')
          // console.log(articleData);
          const formattedArticles = formatDate(articleData);
          return knex('articles')
            .insert(formattedArticles)
            .returning('*');
        })

        .then(articleRows => {
          // console.log(articleRows);
          /* 
      
            Your comment data is currently in the incorrect format and will violate your SQL schema. 
      
            Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id. 
            
            You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
            */

          const articleRef = makeRefObj(articleRows);
          // console.log(articleRef);

          // Format the date field within the comments data
          const commentDataWithDate = formatDate(commentData);

          const formattedComments = formatComments(
            commentDataWithDate,
            articleRef
          );
          console.log(formattedComments);
          return knex('comments')
            .insert(formattedComments)
            .returning('*');
        });
    });
};

const connection = require('../db/connection.js');

const selectArticles = () => {
  console.log('In Articles Model');
  // NEED TO DEBUG FROM HERE
  return connection
    .select(
      'articles.article_id',
      'articles.title',
      'articles.body',
      'articles.topic',
      'articles.created_at',
      'articles.votes',
      'articles.author'
    )
    .count('comments.comment_id as comment_count')
    .from('articles')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id');
  //.then(articles => {
  console.log({ articles });
  // });
};

module.exports = { selectArticles };

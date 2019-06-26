const connection = require('../db/connection.js');

const selectArticles = ({ article_id }) => {
  // console.log('In Articles Model');

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
    .modify(queryBuilder => {
      if (article_id) {
        queryBuilder.where({ 'articles.article_id': article_id });
      }
    })
    .groupBy('articles.article_id')
    .then(articles => {
      if (!articles.length) {
        return Promise.reject({
          status: 404,
          msg: `Article not found with article_id ${article_id}`
        });
      } else return articles;
    });
};

const updateArticle = ({ inc_votes }, { article_id }) => {
  return connection('articles')
    .increment('votes', inc_votes)
    .where({ 'articles.article_id': article_id })
    .returning('*');
};

module.exports = { selectArticles, updateArticle };

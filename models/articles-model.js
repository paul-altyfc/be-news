const connection = require('../db/connection.js');

const insertArticle = articleToAdd => {
  return connection
    .insert(articleToAdd)
    .into('articles')
    .returning('*')
    .then(([article]) => article);
};

const selectArticles = (
  { article_id },
  { sort_by = 'created_at', order = 'desc', author, topic, limit = 10, p }
) => {
  if (isNaN(limit) || limit === null || limit === '') limit = 10;
  if (isNaN(p) || p === null || p === '') p = 1;
  const offset = (p - 1) * limit;
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({
      status: 400,
      msg: `order needs to be either asc or desc the value ${order} is not valid`
    });
  } else {
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
          queryBuilder.where('articles.article_id', article_id);
        }
        if (author) {
          queryBuilder.where({ 'articles.author': author });
        }
        if (topic) {
          queryBuilder.where({ 'articles.topic': topic });
        }
      })
      .orderBy(sort_by, order)
      .groupBy('articles.article_id')
      .limit(limit)
      .offset(offset);
  }
};

const updateArticle = (votesToAdd, { article_id }) => {
  const { inc_votes } = votesToAdd;

  return connection('articles')
    .increment('votes', inc_votes)
    .where({ 'articles.article_id': article_id })
    .returning('*');
};

const deleteArticleById = ({ article_id }) => {
  return connection
    .delete()
    .from('articles')
    .where({ article_id })
    .then(delete_count => {
      if (!delete_count) {
        return Promise.reject({
          status: 404,
          msg: `Article with id ${article_id} not found`
        });
      }
      return true;
    });
};

module.exports = {
  selectArticles,
  updateArticle,
  deleteArticleById,
  insertArticle
};

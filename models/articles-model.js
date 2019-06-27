const connection = require('../db/connection.js');

const selectArticles = ({ article_id }, { sort_by, order, author, topic }) => {
  // console.log('In Articles Model');

  console.log({ article_id }, { sort_by }, { order }, { author }, { topic });

  if (order !== 'asc' && order !== 'desc' && order !== undefined) {
    console.log('here');
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
          queryBuilder.where({ 'articles.article_id': article_id });
        }
        if (author) {
          queryBuilder.where({ 'articles.author': author });
        }
        if (topic) {
          queryBuilder.where({ 'articles.topic': topic });
        }
      })
      .orderBy(sort_by || 'created_at', order || 'desc')
      .groupBy('articles.article_id')
      .then(articles => {
        console.log(articles);
        if (!articles.length) {
          return Promise.reject({
            status: 404,
            msg: `Article not found with article_id ${article_id}`
          });
        } else return articles;
      });
  }
};

const updateArticle = ({ inc_votes }, { article_id }) => {
  if (typeof inc_votes === 'string') {
    return Promise.reject({
      status: 400,
      msg: `Unable to update votes with a value of ${inc_votes}`
    });
  }
  return connection('articles')
    .increment('votes', inc_votes)
    .where({ 'articles.article_id': article_id })
    .returning('*');
};

module.exports = { selectArticles, updateArticle };

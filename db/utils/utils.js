exports.formatDate = list => {
  return list.map(item => {
    const { created_at } = item;
    item.created_at = new Date(created_at);
    return item;
  });
};

exports.makeRefObj = articlesInfo => {
  if (!articlesInfo.length) return {};
  const articlesRefObj = {};
  articlesInfo.forEach(article => {
    articlesRefObj[article.title] = article.article_id;
  });
  return articlesRefObj;
};

exports.formatComments = (comments, articleRef) => {
  if (!comments.length) return [];

  const transformedArr = comments.map(comment => {
    const { created_by, belongs_to, ...restOfComment } = comment;
    return {
      author: created_by,
      article_id: articleRef[belongs_to],
      ...restOfComment
    };
  });
  return transformedArr;
};

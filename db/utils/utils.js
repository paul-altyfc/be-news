exports.formatDate = articleData => {
  // console.log(articleData);
  // console.log(articleData[0].created_at);
  return articleData.map(article => {
    const { created_at } = article;
    // console.log(created_at);
    article.created_at = new Date(created_at);
    // console.log(article);
    return article;
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

exports.formatComments = (comments, articleRef) => {};

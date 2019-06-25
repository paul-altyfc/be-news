exports.formatDate = list => {
  // console.log(list, 'format date');
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
  // console.log(articleRef);
  const cloneComments = [...comments];

  // console.log(cloneComments, 'clone');

  cloneComments.forEach(clonedComment => {
    // rename the cretaed_by field to author
    // console.log(clonedComment.created_by, 'created by');
    clonedComment.author = clonedComment.created_by;
    delete clonedComment.created_by;
    if (articleRef)
      clonedComment.article_id = articleRef[clonedComment.belongs_to];
    delete clonedComment.belongs_to;
  });
  // console.log(cloneComments);
  return cloneComments;
};

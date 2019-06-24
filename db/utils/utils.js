exports.formatDate = articleData => {
  console.log(articleData);
  console.log(articleData[0].created_at);

  const myDate = new Date(articleData[0].created_at);
  console.log(myDate);
  return myDate;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

// const formatOwnerIdInShop = (shopsData, ownerRef) => {
//   return shopsData.map(shop => {
//     const { owner, ...restOfOwners } = shop;
//     const owner_id = ownerRef[owner];
//     return { owner_id, ...restOfOwners };
//   });
// };

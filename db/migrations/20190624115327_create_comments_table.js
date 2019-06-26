exports.up = function(knex, Promise) {
  console.log('creating comments table...');
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable
      .increments('comment_id')
      .primary()
      .notNullable();
    commentsTable.string('author').references('users.username');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now(6));
    commentsTable.text('body');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
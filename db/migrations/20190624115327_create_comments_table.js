exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable
      .increments('comment_id')
      .primary()
      .notNullable();
    commentsTable
      .string('author')
      .references('users.username')
      .onDelete('CASCADE');
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE');
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

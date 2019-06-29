exports.up = function(knex, Promise) {
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable
      .increments('article_id')
      .primary()
      .notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .onDelete('CASCADE');
    articlesTable
      .string('author')
      .references('users.username')
      .onDelete('CASCADE');
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};

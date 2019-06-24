exports.up = function(knex, Promise) {
  console.log('creating articles table...');
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable
      .increments('article_id')
      .primary()
      .notNullable();
    articlesTable.string('title').notNullable();
    articlesTable.string('body').notNullable();
    articlesTable
      .integer('votes')
      .notNullable()
      .defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('articles');
};

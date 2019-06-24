exports.up = function(knex, Promise) {
  console.log('creating topic table...');
  return knex.schema.createTable('topics', topicsTable => {
    topicsTable
      .string('slug')
      .primary()
      .notNullable();
    topicsTable.string('description').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('topics');
};

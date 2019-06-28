exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', usersTable => {
    usersTable
      .string('username')
      .primary()
      .notNullable();
    usersTable.string('name', 50).notNullable();
    usersTable.string('avatar_url');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

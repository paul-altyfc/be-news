const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

// console.log(ENV, 'environment');

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      user: 'paul',
      password: 'altyfc'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test',
      user: 'paul',
      password: 'altyfc'
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

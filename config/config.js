module.exports = {
  development: {
    server: {
      host: '0.0.0.0',
      port: process.env.PORT
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'exchange',
      username: '',
      password: ''
    }
  },
  test: {
    server: {
      host: '0.0.0.0',
      port: process.env.PORT
    },
    database: {
      host: '127.0.0.1',
      port: 27017,
      db: 'exchange-test',
      username: '',
      password: ''
    }
  }
};

module.exports = {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://spaced_repetition@localhost/spaced_repetition',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'postgresql://spaced_repetition@localhost/spaced_repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
};

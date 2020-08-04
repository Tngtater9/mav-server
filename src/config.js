module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://mav:uginMonster@localhost/mav_data',
  JWT_SECRET: process.env.JWT_SECRET || 'mav-super-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '86400s'
}

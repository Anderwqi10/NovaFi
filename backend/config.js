require('dotenv').config({ path: require('path').join(__dirname, '.env') });

module.exports = {
  // MySQL (legado)
  mysqlHost: process.env.MYSQL_HOST || "13.233.12.75",
  user: process.env.MYSQL_USER || "",
  password: process.env.MYSQL_PASS || '',
  database: process.env.MYSQL_DB || "",
  mysqlPort: process.env.MYSQL_PORT || 3306,
  // JWT
  JWT_SECRET_KEY: process.env.JWT_SECRET || 'change-me-in-production',
  SESSION_EXPIRES_IN: process.env.SESSION_EXPIRES_IN || '24h',
  // Misc
  imageUrl: process.env.IMAGE_URL || '',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  clientDepositAddress: process.env.CLIENT_DEPOSIT_ADDRESS || '',
};

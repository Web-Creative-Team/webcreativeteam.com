require('dotenv').config(); // Load .env variables into process.env

// Use environment variables from .env or fallback to defaults
exports.SECRET = process.env.SECRET || 'default-secret';
exports.SESSION_SECRET = process.env.SESSION_SECRET || 'default-session-secret'; // Add this line
exports.TOKEN_KEY = process.env.TOKEN_KEY || 'token';
exports.PORT = process.env.PORT || 3000;

// Use production DB or fall back to a local DB for development
exports.DBLINK = process.env.DBLINK || 'mongodb://127.0.0.1:27017/webcreativeteam';

exports.EMAIL = process.env.EMAIL || 'defaultemail@example.com';
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'defaultpassword';
exports.EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'Gmail';

exports.CAPTCHA_SITE_KEY = process.env.CAPTCHA_SITE_KEY || 'default-captcha-site-key';
exports.CAPTCHA_SECRET_SITE_KEY = process.env.CAPTCHA_SECRET_SITE_KEY || 'default-captcha-secret-site-key';

exports.PCLOUD_ACCESS_TOKEN = process.env.PCLOUD_ACCESS_TOKEN || 'default-pacloud-access-token'
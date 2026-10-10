process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.GMAIL_USER = 'studio@mulab.test';
process.env.GMAIL_APP_PASSWORD = 'app-password-for-tests';
process.env.OWNER_EMAIL = 'owner@mulab.test';
process.env.SEND_CLIENT_CONFIRMATION = 'true';
process.env.MAIL_FROM_NAME = 'MU.LAB';

// Keep tests hermetic: force the in-memory store even when a real .env with
// Turso credentials exists locally (dotenv never overrides pre-set keys).
process.env.TURSO_DATABASE_URL = '';
process.env.DATABASE_URL = '';
process.env.TURSO_AUTH_TOKEN = '';

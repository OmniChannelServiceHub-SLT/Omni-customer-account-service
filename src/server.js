require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./common/config/db');

const PORT = process.env.PORT || 3002;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[customer-account-service] listening on :${PORT}`);
  });
}

start().catch((err) => {
  console.error('[customer-account-service] failed to start:', err);
  process.exit(1);
});
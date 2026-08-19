const express = require('express');
const { requestLogger } = require('./common/middleware/requestLogger');
const { errorHandler } = require('./common/middleware/errorHandler');

const getUserInfoRoute = require('./apis/GetUserInfo/getUserInfo.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // legacy client sends form-urlencoded bodies
app.use(requestLogger);

// One mount per implemented API - matches API_TRACKER.md 1:1. Add one
// line here per API as each one's branch merges in.
app.use('/tmf-api/partyManagement/v4/individual/userinfo', getUserInfoRoute); // GetUserInfo

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'customer-account-service' }));

app.use((req, res) => res.status(404).json({ code: 'NOT_FOUND', reason: 'No route matches this path' }));
app.use(errorHandler);

module.exports = app;
const express = require('express');
const getUserInfoRoutes = require('./APIs/GetUserInfo/routes/getUserInfo.route');
const updateUserInfoRoutes = require('./APIs/UpdateUserInfo/routes/updateUserInfo.route')
const addAccountRequestRoutes = require('./APIs/AddAccountRequest/routes/addAccountRequest.route')
const getAccountDetailRequest = require('./APIs/GetAccountDetailRequest/routes/getAccountDetailRequest.route')

const app = express();

// Middleware (JSON, logger, etc.)
app.use(express.json());

app.use('/', getUserInfoRoutes);
app.use('/', updateUserInfoRoutes);
app.use('/', addAccountRequestRoutes);
app.use('/',getAccountDetailRequest);
// Global error handler (must handle TMF error format for CTK)
//app.use(require('./common/middleware/errorHandler'));

module.exports = app;
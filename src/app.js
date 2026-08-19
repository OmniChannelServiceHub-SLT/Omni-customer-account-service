const express = require('express');
const getUserInfoRoutes = require('./APIs/GetUserInfo/routes/getUserInfo.route');
const updateUserInfoRoutes = require('./APIs/UpdateUserInfo/routes/updateUserInfo.route')
const addAccountRequestRoutes = require('./APIs/AddAccountRequest/routes/addAccountRequest.route')
const getAccountDetailRequest = require('./APIs/GetAccountDetailRequest/routes/getAccountDetailRequest.route')
const removeAccountRequest = require('./APIs/RemoveAccountRequest/routes/route')
const VASAccountRequestRoutes = require('./APIs/VASAccountRequest/routes/route')
const getProfile = require('./APIs/GetProfile/routes/route')
const updateContact = require('./APIs/UpdateContact/routes/route')
const updateISPContact = require('./APIs/UpdateISPContact/routes/route')

const app = express();

// Middleware (JSON, logger, etc.)
app.use(express.json());

app.use('/', getUserInfoRoutes);
app.use('/', updateUserInfoRoutes);
app.use('/', addAccountRequestRoutes);
app.use('/',getAccountDetailRequest);
app.use('/',removeAccountRequest);
app.use('/', VASAccountRequestRoutes)
app.use('/',getProfile)
app.use('/',updateContact)
app.use('/',updateISPContact)
// Global error handler (must handle TMF error format for CTK)
//app.use(require('./common/middleware/errorHandler'));

module.exports = app;
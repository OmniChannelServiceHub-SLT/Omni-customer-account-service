const express = require('express');

const getUserInfoRoutes = require(
  './APIs/GetUserInfo/routes/getUserInfo.route'
);

const updateUserInfoRoutes = require(
  './APIs/UpdateUserInfo/routes/updateUserInfo.route'
);

const addAccountRequestRoutes = require(
  './APIs/AddAccountRequest/routes/addAccountRequest.route'
);

const getAccountDetailRequest = require(
  './APIs/GetAccountDetailRequest/routes/getAccountDetailRequest.route'
);

const removeAccountRequest = require(
  './APIs/RemoveAccountRequest/routes/route'
);

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-customer-account-service',
    port: Number(process.env.PORT || 3002),
  });
});

app.use('/', getUserInfoRoutes);
app.use('/', updateUserInfoRoutes);
app.use('/', addAccountRequestRoutes);
app.use('/', getAccountDetailRequest);
app.use('/', removeAccountRequest);

module.exports = app;
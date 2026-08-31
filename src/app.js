const express = require('express');

const VASgetProfile = require('./APIS/VAS_ListProfile/routes/route')
const ISP_DIRECTgetProfile = require('./APIs/ISP_Direct_ListProfile/routes/route')

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
const VASAccountRequestRoutes = require('./APIs/VASAccountRequest/routes/route')
const getProfile = require('./APIs/GetProfile/routes/route')
const updateContact = require('./APIs/UpdateContact/routes/route')
const updateISPContact = require('./APIs/UpdateISPContact/routes/route')
const listExistCustomer = require('./APIs/ListExistCustomer/routes/route')
const customerValidation = require('./APIs/GETCustomerValidation/routes/route')
const createIndividualRoutes = require('./APIs/GetUserInfo/routes/getUserInfo.route');// for ctk632
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'omnichannel-customer-account-service',
    port: Number(process.env.PORT || 3002),
  });
});
app.use('/',ISP_DIRECTgetProfile);
app.use('/',VASgetProfile);
app.use('/', getUserInfoRoutes);
app.use('/', updateUserInfoRoutes);
app.use('/', addAccountRequestRoutes);
app.use('/', getAccountDetailRequest);
app.use('/', removeAccountRequest);
app.use('/', VASAccountRequestRoutes);
app.use('/',getProfile);
app.use('/',updateContact);
app.use('/',updateISPContact);
app.use('/', listExistCustomer);
app.use('/',customerValidation);
app.use('/', createIndividualRoutes);//for ctk632

module.exports = app;
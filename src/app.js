const express = require('express');

const VASgetProfile = require('./APIS/VAS_ListProfile/routes/route')
const ISP_DIRECTgetProfile = require('./APIs/ISP_Direct_ListProfile/routes/route')
const ISP_SOAgetProfile = require('./APIs/ISP_SOA_ListProfile/routes/route')
const ISP_DIRECTpatchContact = require('./APIs/ISP_Direct_PatchContact/routes/route')
const ISP_SOApatchContact = require('./APIs/ISP_SOA_PatchContact/routes/route')
const PEO_PEOProfile = require('./APIs/PEO_Get_PEOProfile/routes/route')
const Dashboard_listProfileDistributionDashboard = require('./APIs/Dashboard_listProfileDistributionDashboard/routes/route')
const AccountOmni_GetAccountDetailRequestChatBot = require('./APIs/AccountOmni_GetAccountDetailRequestChatBot/routes/route')

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
app.use('/',AccountOmni_GetAccountDetailRequestChatBot)
app.use('/',Dashboard_listProfileDistributionDashboard);
app.use('/',PEO_PEOProfile)
app.use('/',ISP_SOApatchContact);
app.use('/',ISP_DIRECTpatchContact);
app.use('/',ISP_SOAgetProfile);
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
const Account = require('../../../models/TMF666_account');

exports.getAccountById = async (id) => {
  return await Account.findOne({ id, '@type': 'BillingAccount' });
};

exports.listAccounts = async (filter = {}) => {
  return await Account.find(filter);
};
/*const Account = require('../../../models/TMF666_account');

exports.getAccountById = async (id) => {
  return await Account.findOne({ id });
};*/
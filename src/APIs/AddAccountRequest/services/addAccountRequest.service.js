const BillingAccount = require('../../../models/TMF666_account');
 
exports.createAccount = async (accountData) => {
  const account = new BillingAccount(accountData);
  return await account.save();
};
 
exports.findAccountByAccountNo = async (id) => {
  return await BillingAccount.findOne({ id });
};
 

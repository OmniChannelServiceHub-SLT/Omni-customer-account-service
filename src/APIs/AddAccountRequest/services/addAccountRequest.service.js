const BillingAccount = require('../../../models/TMF666_account');
 
exports.createAccount = async (accountData) => {
  const account = new BillingAccount(accountData);
  return await account.save();
};
 
exports.findAccountByAccountNo = async (id) => {
  return await BillingAccount.findOne({ id });
};
 

/*const Account = require('../../../models/TMF666_account');
const Individual = require('../../../models/TMF632_individual');

exports.createAccount = async (accountData) => {
  const account = new Account(accountData);
  return await account.save();
};

exports.findIndividualByNIC = async (nic) => {
  return await Individual.findOne({ id: nic });
};

exports.findAccountByAccountNo = async (accountNo) => {
  return await Account.findOne({ id: accountNo });
};*/
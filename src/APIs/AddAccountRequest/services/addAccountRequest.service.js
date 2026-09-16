const BillingAccount = require('../../../models/TMF666_account');
const Individual = require('../../../models/TMF632_individual');

exports.createAccount = async (accountData) => {
  const account = new BillingAccount(accountData);
  return await account.save();
};

exports.findAccountByAccountNo = async (id) => {
  return await BillingAccount.findOne({ id });
};

exports.findIndividualByNIC = async (nic) => {
  return await Individual.findOne({ id: nic });
};
const Account = require('../../../models/TMF666_account');
const Individual = require('../../../models/TMF632_individual');

exports.findAccountById = async (id) => {
  return await Account.findOne({ id });
};

exports.findIndividualByNIC = async (nic) => {
  return await Individual.findOne({ id: nic });
};

exports.createAccount = async (accountData) => {
  const account = new Account(accountData);
  return await account.save();
};
const Account = require('../../../models/TMF666_account');

exports.findAccountById = async (id) => {
  return await Account.findOne({ id });
};

exports.createAccount = async (accountData) => {
  const account = new Account(accountData);
  return await account.save();
};
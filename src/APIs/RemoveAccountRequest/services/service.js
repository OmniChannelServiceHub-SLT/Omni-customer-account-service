const Account = require('../../../models/TMF666_account');

exports.getAccountById = async (id) => {
  return await Account.findOne({ id });
};

exports.removeAccountById = async (id) => {
  return await Account.findOneAndDelete({ id });
};
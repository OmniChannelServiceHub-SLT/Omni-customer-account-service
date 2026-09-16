const Account = require('../../../models/TMF666_account');

exports.getAccountByAccountNo = async (accountNo) => {
  return await Account.findOne({ id: accountNo });
};
exports.getAccountByAccountNo = async (id) => {
  return await Account.findOne({ id });
};
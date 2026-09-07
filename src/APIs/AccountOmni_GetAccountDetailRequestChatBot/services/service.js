const Account = require('../../../models/TMF666_account');

exports.getAccountByAccountNo = async (accountNo) => {
  return await Account.findOne({ id: accountNo });
};
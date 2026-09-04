const Account = require('../../../models/TMF666_account');

exports.getAccountById = async (id) => {
  return await Account.findOne({ id, '@type': 'BillingAccount' });
};

exports.updateAccount = async (id, patchBody) => {
  return await Account.findOneAndUpdate(
    { id, '@type': 'BillingAccount' },
    { $set: patchBody },
    { new: true }
  );
};
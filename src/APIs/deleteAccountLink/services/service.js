const Account = require('../../../models/TMF666_account');

exports.findAccountById = async (id) => {
  return await Account.findOne({ id });
};

// Soft terminate — record stays, state flips to 'terminated'.
// Swap for findOneAndDelete if hard delete is wanted.
exports.removeAccountById = async (id) => {
  return await Account.findOneAndUpdate(
    { id },
    { $set: { state: 'terminated' } },
    { new: true }
  );
};

// exports.removeAccountById = async (id) => {
//   return await Account.findOneAndDelete({ id });
// };
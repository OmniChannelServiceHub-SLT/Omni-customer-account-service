const Account = require('../../../models/TMF666_account');

/**
 * Check whether a telephone number exists as a TMF666 Account.
 * Matches on Account.contact[].characteristic.phoneNumber.
 */
exports.checkOmniTP = async (telephoneNo) => {
  return await Account.findOne({
    'contact.characteristic.phoneNumber': telephoneNo
  });
};
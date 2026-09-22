const Individual = require('../../../models/TMF632_individual');
const Account = require('../../../models/TMF666_account');

// telephoneNo = the Individual's contact phone (contactMedium block)
exports.findCustomerByTelephone = async (telephoneNo) => {
  return await Individual.findOne({
    'contactMedium.characteristic.phoneNumber': telephoneNo
  });
};

// For the TMF Customer projection's account[] — same as CheckExistCustomer
exports.findAccountsByCustomer = async (nic) => {
  return await Account.find({ 'relatedParty.id': nic });
};
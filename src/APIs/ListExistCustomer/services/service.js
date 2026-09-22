const Individual = require('../../../models/TMF632_individual');
const Account = require('../../../models/TMF666_account');

// NIC is stored in the 'id' field of Individual
exports.findCustomerByNIC = async (nic) => {
  return await Individual.findOne({ id: nic });
};

// Accounts whose relatedParty references this NIC
exports.findAccountsByCustomer = async (nic) => {
  return await Account.find({ 'relatedParty.id': nic });
};
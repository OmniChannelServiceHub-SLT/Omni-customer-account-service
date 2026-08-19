const Individual = require('../../../models/TMF632_individual');

// NIC is stored in the 'id' field
exports.findCustomerByNIC = async (nic) => {
  return await Individual.findOne({ id: nic });
};
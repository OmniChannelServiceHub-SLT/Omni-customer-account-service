const Individual = require('../../../models/TMF632_individual');

exports.findCustomerByTelephone = async (telephoneNo) => {
  return await Individual.findOne({
    'contactMedium.characteristic.phoneNumber': telephoneNo
  });
};
const Individual = require('../../../models/TMF632_individual');

exports.findByTelephoneNo = async (tpNo) => {
  return await Individual.findOne({
    'contactMedium.characteristic.phoneNumber': tpNo
  });
};
const Individual = require('../../../models/TMF632_individual');

/**
 * Find Individual by telephone number in contactMedium
 */
exports.findIndividualByTelephone = async (tpNo) => {
  return await Individual.findOne({
    'contactMedium.characteristic.phoneNumber': tpNo
  });
};

/**
 * Partial update (PATCH) Individual by ID
 */
exports.updateIndividual = async (id, updateData) => {
  return await Individual.findOneAndUpdate(
    { id },
    updateData,
    { new: true, runValidators: true }
  );
};
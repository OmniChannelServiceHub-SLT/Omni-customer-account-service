const Individual = require('../../../models/TMF632_individual');

exports.updateIndividualById = async (id, updateData) => {
  return await Individual.findOneAndUpdate(
    { id },
    updateData,
    { new: true, runValidators: true }
  );
};
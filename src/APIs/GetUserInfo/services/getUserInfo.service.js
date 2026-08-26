const Individual = require('../../../models/TMF632_individual');

/**
 * Fetch an Individual by its TMF ID (which maps to legacy userName).
 * Throws 404 if not found.
 */
exports.getIndividualById = async (id) => {
  const individual = await Individual.findOne({ id });
  if (!individual) {
    const error = new Error(`Individual with id ${id} not found`);
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    error.reason = 'Individual not found';
    throw error;
  }
  return individual;
};
exports.createIndividual = async (individualData) => {
  const individual = new Individual(individualData);
  return await individual.save();
};
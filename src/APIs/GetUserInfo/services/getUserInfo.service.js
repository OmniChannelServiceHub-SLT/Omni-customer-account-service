const Individual = require('../../../models/TMF632_individual');

/**
 * Fetch an Individual by its TMF ID
 * Throws 404 if not found
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

/**
 * Find an Individual by ID (returns null if not found)
 * Used for existence checks in createIndividual
 */
exports.findIndividualById = async (id) => {
  return await Individual.findOne({ id });
};

/**
 * Create a new Individual
 */
exports.createIndividual = async (individualData) => {
  const individual = new Individual(individualData);
  return await individual.save();
};

/**
 * Find multiple Individuals with filters
 */
exports.findIndividuals = async (filter) => {
  return await Individual.find(filter);
};
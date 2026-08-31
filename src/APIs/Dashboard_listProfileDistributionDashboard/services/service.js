const Individual = require('../../../models/TMF632_individual');

/**
 * Get all Individuals with optional filters
 */
exports.getAllIndividuals = async (filter = {}) => {
  return await Individual.find(filter);
};
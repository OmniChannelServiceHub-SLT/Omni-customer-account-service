const Individual = require('../../../models/TMF632_individual');

exports.findIndividualBySubscriberId = async (subscriberID) => {
  return await Individual.findOne({ id: subscriberID });
};
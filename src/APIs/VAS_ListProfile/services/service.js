const Individual = require('../../../models/TMF632_individual');

exports.findBySubscriberID = async (subscriberID) => {
  return await Individual.findOne({ id: subscriberID });
};
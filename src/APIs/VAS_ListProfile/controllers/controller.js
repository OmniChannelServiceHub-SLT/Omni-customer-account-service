const service = require('../services/service');

exports.getVASProfile = async (req, res) => {
  const { subscriberID } = req.query;

  if (!subscriberID) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'subscriberID query parameter is required'
    });
  }

  const individual = await service.findBySubscriberID(subscriberID);

  if (!individual) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `VAS profile with subscriberID ${subscriberID} not found`
    });
  }

  // Return pure TMF632 Individual resource
  res.json({
    id: individual.id,
    href: individual.href || `/tmf-api/partyManagement/v4/individual/${individual.id}`,
    '@type': individual['@type'] || 'Individual',
    name: individual.name,
    givenName: individual.givenName,
    familyName: individual.familyName,
    contactMedium: individual.contactMedium || [],
    status: individual.status || 'active',
    '@baseType': individual['@baseType'] || 'Individual',
    '@schemaLocation': individual['@schemaLocation']
  });
};
const service = require('../services/service');

exports.getISPDirectProfile = async (req, res) => {
  const { tpNo } = req.query;

  if (!tpNo) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'tpNo query parameter is required'
    });
  }

  const individual = await service.findByTelephoneNo(tpNo);

  if (!individual) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `ISP Direct profile with tpNo ${tpNo} not found`
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
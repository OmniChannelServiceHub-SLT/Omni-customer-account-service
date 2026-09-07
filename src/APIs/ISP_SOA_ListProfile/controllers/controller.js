const service = require('../services/service');

/**
 * TMF632-compliant GET /individual/isp-soa?accountNo=XXX
 * Returns pure TMF632 Individual resource – NO legacy envelope.
 */
exports.getISPSOAProfile = async (req, res) => {
  const { accountNo } = req.query;

  if (!accountNo) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'accountNo query parameter is required'
    });
  }

  const individual = await service.getIndividualByAccountNo(accountNo);

  if (!individual) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Individual linked to account ${accountNo} not found`
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
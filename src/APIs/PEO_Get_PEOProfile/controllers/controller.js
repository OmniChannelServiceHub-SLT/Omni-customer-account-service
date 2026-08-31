const service = require('../services/service');

/**
 * TMF632-compliant GET /individual/peo-profile
 * Returns pure TMF632 Individual resource with PEO-specific fields
 */
exports.getPEOProfile = async (req, res) => {
  const { subscriberID, accountNo } = req.query;

  if (!subscriberID && !accountNo) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'Either subscriberID or accountNo query parameter is required'
    });
  }

  let individual = null;

  // Try to find by subscriberID first
  if (subscriberID) {
    individual = await service.findBySubscriberID(subscriberID);
  }

  // If not found and accountNo is provided, try by accountNo
  if (!individual && accountNo) {
    individual = await service.findByAccountNo(accountNo);
  }

  if (!individual) {
    const identifier = subscriberID || accountNo;
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `PEO profile for ${identifier} not found`
    });
  }

  // Return pure TMF632 Individual resource (with PEO-specific fields)
  res.json({
    id: individual.id,
    href: individual.href || `/tmf-api/partyManagement/v4/individual/${individual.id}`,
    '@type': individual['@type'] || 'Individual',
    name: individual.name,
    givenName: individual.givenName,
    familyName: individual.familyName,
    contactMedium: individual.contactMedium || [],
    status: individual.status || 'active',
    // PEO-specific extended fields
    subscriber_package: individual.subscriber_package,
    subscriber_package_display: individual.subscriber_package_display,
    subscriber_package_type: individual.subscriber_package_type,
    first_bill_date: individual.first_bill_date,
    billing_date: individual.billing_date,
    blocked: individual.blocked,
    registered: individual.registered,
    privileges: individual.privileges || {},
    happy_day: individual.happy_day,
    '@baseType': individual['@baseType'] || 'Individual',
    '@schemaLocation': individual['@schemaLocation']
  });
};
const service = require('../services/service');

exports.getProfile = async (req, res) => {
  const { subscriberID } = req.query;

  if (!subscriberID) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'subscriberID query parameter is required',
    });
  }

  const individual = await service.findIndividualBySubscriberId(subscriberID);

  if (!individual) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Profile with subscriberID ${subscriberID} not found`,
    });
  }

  // Get phone and email from contactMedium
  const phone = individual.contactMedium?.find(c => c.mediumType === 'Phone');
  const email = individual.contactMedium?.find(c => c.mediumType === 'Email');

  // Return pure TMF Individual resource
  res.json({
    id: individual.id,
    href: individual.href,
    '@type': individual['@type'] || 'Individual',
    name: individual.name,
    givenName: individual.givenName,
    familyName: individual.familyName,
    contactMedium: individual.contactMedium || [],
    status: individual.status,
    
    // Legacy extended fields (flat)
    subscriber_package: individual.subscriber_package,
    subscriber_package_display: individual.subscriber_package_display,
    subscriber_package_type: individual.subscriber_package_type,
    email: email?.characteristic?.email || null,
    phone: phone?.characteristic?.phoneNumber || null,
    first_bill_date: individual.first_bill_date,
    billing_date: individual.billing_date,
    blocked: individual.blocked,
    registered: individual.registered,
    privileges: individual.privileges || {},
    happy_day: individual.happy_day,
    
    '@baseType': individual['@baseType'],
    '@schemaLocation': individual['@schemaLocation'],
  });
};
/**
 * GetProfileDistributionDashboard Mapper – TMF Dialect (GET collection)
 *
 * Returns a bare array of TMF632 Individual-shaped resources — TMF list
 * operations do not wrap the array.
 *
 * ⚠️ Same output-shape inconsistency as PEOProfile: this returns
 *    '@type: 'Individual'' while CheckExistCustomer / CustomerValidation
 *    return '@type: 'Customer''. Same storage, two resource types.
 */

const mapIndividual = (ind) => ({
  id: ind.id,
  href:
    ind.href ||
    `/tmf-api/partyManagement/v4/individual/${ind.id}`,
  '@type': ind['@type'] || 'Individual',
  '@baseType': ind['@baseType'] || 'Individual',
  '@schemaLocation': ind['@schemaLocation'] || null,
  name: ind.name,
  givenName: ind.givenName,
  familyName: ind.familyName,
  contactMedium: ind.contactMedium || [],
  status: ind.status || 'active',

  // Extended fields preserved for dashboard rendering
  subscriber_package: ind.subscriber_package,
  subscriber_package_display: ind.subscriber_package_display,
  subscriber_package_type: ind.subscriber_package_type,
  first_bill_date: ind.first_bill_date,
  billing_date: ind.billing_date,
  blocked: ind.blocked,
  registered: ind.registered,
  privileges: ind.privileges || {},
  happy_day: ind.happy_day
});

exports.toTmfResponse = (individuals) => {
  return individuals.map(mapIndividual);
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
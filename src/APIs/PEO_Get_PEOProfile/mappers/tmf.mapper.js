/**
 * PEOProfile Mapper – TMF Dialect (GET)
 *
 * Returns a TMF632 Individual-shaped resource with PEO-specific extended
 * fields. Preserved from the existing controller output.
 *
 * ⚠️ Output type is 'Individual', while CheckExistCustomer and
 *    CustomerValidation return '@type: 'Customer''. Same storage, two
 *    different resource types across three endpoints. Confirm intent.
 */

exports.toTmfResponse = (individual) => {
  return {
    id: individual.id,
    href:
      individual.href ||
      `/tmf-api/partyManagement/v4/individual/${individual.id}`,
    '@type': individual['@type'] || 'Individual',
    '@baseType': individual['@baseType'] || 'Individual',
    '@schemaLocation': individual['@schemaLocation'] || null,
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
    happy_day: individual.happy_day
  };
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
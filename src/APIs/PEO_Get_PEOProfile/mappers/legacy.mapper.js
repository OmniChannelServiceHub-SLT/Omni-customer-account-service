/**
 * PEOProfile Mapper – Legacy Dialect (GET)
 * ⚠️ No CSV row exists for PEOProfile. Envelope per A12 convention;
 *    dataBundle shape mirrors the TMF projection minus @-fields.
 */

exports.toLegacyResponse = (individual) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: {
    id: individual.id,
    name: individual.name,
    givenName: individual.givenName,
    familyName: individual.familyName,
    contactMedium: individual.contactMedium || [],
    status: individual.status || 'active',
    subscriber_package: individual.subscriber_package,
    subscriber_package_display: individual.subscriber_package_display,
    subscriber_package_type: individual.subscriber_package_type,
    first_bill_date: individual.first_bill_date,
    billing_date: individual.billing_date,
    blocked: individual.blocked,
    registered: individual.registered,
    privileges: individual.privileges || {},
    happy_day: individual.happy_day
  },
  errorShow: null,
  errorCode: null
});

exports.toLegacyError = (err) => ({
  isSuccess: false,
  errorMessege: err.message,
  exceptionDetail: null,
  dataBundle: null,
  errorShow: err.message,
  errorCode: err.code || 'ERROR'
});
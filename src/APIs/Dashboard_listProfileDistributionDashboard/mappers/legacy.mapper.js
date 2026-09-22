/**
 * GetProfileDistributionDashboard Mapper – Legacy Dialect (GET collection)
 *
 * ⚠️ No CSV row and no sample response. Envelope per A12 convention;
 *    dataBundle carries an array (first array payload in this service —
 *    shape unverified).
 */

exports.toLegacyResponse = (individuals) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: individuals.map((ind) => ({
    id: ind.id,
    name: ind.name,
    givenName: ind.givenName,
    familyName: ind.familyName,
    contactMedium: ind.contactMedium || [],
    status: ind.status || 'active',
    subscriber_package: ind.subscriber_package,
    subscriber_package_display: ind.subscriber_package_display,
    subscriber_package_type: ind.subscriber_package_type,
    first_bill_date: ind.first_bill_date,
    billing_date: ind.billing_date,
    blocked: ind.blocked,
    registered: ind.registered,
    privileges: ind.privileges || {},
    happy_day: ind.happy_day
  })),
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
/**
 * CheckExistCustomer Mapper – Legacy Dialect (GET)
 *
 * ⚠️ CSV A113 has no sample response. Shape preserves the flat extended
 *    fields the previous controller emitted. Adjust when a real legacy
 *    capture is available.
 */

exports.toLegacyResponse = (customer) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: {
    id: customer.id,
    name: customer.name,
    givenName: customer.givenName,
    familyName: customer.familyName,
    contactMedium: customer.contactMedium || [],
    status: customer.status || 'active',
    subscriber_package: customer.subscriber_package,
    subscriber_package_display: customer.subscriber_package_display,
    subscriber_package_type: customer.subscriber_package_type,
    first_bill_date: customer.first_bill_date,
    billing_date: customer.billing_date,
    blocked: customer.blocked,
    registered: customer.registered,
    privileges: customer.privileges,
    happy_day: customer.happy_day
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
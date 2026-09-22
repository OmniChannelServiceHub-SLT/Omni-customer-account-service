/**
 * CustomerValidation Mapper – TMF Dialect (GET)
 *
 * Projects a TMF632 Individual (looked up by telephone) into the same
 * TMF629-shaped Customer projection used by CheckExistCustomer.
 *
 * ⚠️ Duplicates CheckExistCustomer/mappers/tmf.mapper.js — same output
 *    shape, different lookup key. Consider extracting to a shared
 *    customer.projection.js when a third endpoint needs it.
 */

exports.toTmfResponse = (customer, accounts = []) => {
  const href =
    customer.href ||
    `/tmf-api/customerManagement/v4/customer/${customer.id}`;

  const engagedParty = {
    id: customer.id,
    href:
      customer.href ||
      `/tmf-api/party/v4/individual/${customer.id}`,
    '@referredType': 'Individual'
  };

  const accountRefs = accounts.map((a) => ({
    id: a.id,
    href: a.href,
    '@referredType': a['@type'] || 'Account'
  }));

  const characteristic = [
    customer.subscriber_package && {
      name: 'subscriber_package',
      value: customer.subscriber_package
    },
    customer.subscriber_package_display && {
      name: 'subscriber_package_display',
      value: customer.subscriber_package_display
    },
    customer.subscriber_package_type !== undefined && {
      name: 'subscriber_package_type',
      value: customer.subscriber_package_type
    },
    customer.first_bill_date && {
      name: 'first_bill_date',
      value: customer.first_bill_date
    },
    customer.billing_date && {
      name: 'billing_date',
      value: customer.billing_date
    },
    customer.happy_day && {
      name: 'happy_day',
      value: customer.happy_day
    }
  ].filter(Boolean);

  return {
    id: customer.id,
    href,
    '@type': 'Customer',
    '@baseType': 'Customer',
    '@schemaLocation': customer['@schemaLocation'] || null,
    name: customer.name,
    status: customer.status || 'active',

    engagedParty,
    account: accountRefs,
    contactMedium: customer.contactMedium || [],
    characteristic,

    blocked: customer.blocked,
    registered: customer.registered,
    privileges: customer.privileges
  };
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
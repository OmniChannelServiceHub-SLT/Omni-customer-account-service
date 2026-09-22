/**
 * CheckExistCustomer Mapper – TMF Dialect (GET)
 *
 * Projects a TMF632 Individual into a TMF629-shaped Customer:
 *   - engagedParty  → the Individual (PartyRef)
 *   - account[]     → Accounts referencing that Individual
 *   - characteristic[] → extended subscriber fields
 *
 * No TMF629_Customer collection exists. This is a read-time projection.
 * Revisit if an Organization customer type or customer-specific storage
 * (credit rating, KYC, contract terms) is needed.
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

    // Boolean flags kept top-level (not natural fit for characteristic[])
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
/**
 * GetServiceDetailRequest Mapper – TMF Dialect (GET)
 *
 * ⚠️ No CSV sample response. Returns a bare array of Account-shaped
 *    resources — the endpoint queries multiple products/services for a
 *    phone number, so it's a collection, not a single resource.
 *
 * ⚠️ Output type is 'Account'. If the intent is a TMF637 Product, this
 *    whole mapper needs the TMF637 shape instead. Confirm domain.
 */

const mapAccount = (account) => {
  const path =
    account['@type'] === 'BillingAccount' ? 'billingAccount' : 'account';
  const href =
    account.href ||
    `/tmf-api/accountManagement/v4/${path}/${account.id}`;

  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'Account',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'] || null,
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    userKey: account.userKey || null,
    characteristic: account.characteristic || []
  };
};

exports.toTmfResponse = (accounts) => {
  return accounts.map(mapAccount);
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
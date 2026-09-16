/**
 * TMF666 Account Mapper – TMF Dialect (GET single)
 * Returns a bare Account resource, no envelope.
 *
 * Note: `@type` is preserved from the document — could be 'Account' or
 * 'BillingAccount' depending on what was created.
 */

exports.toTmfResponse = (account) => {
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
    userKey: account.userKey || null
  };
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
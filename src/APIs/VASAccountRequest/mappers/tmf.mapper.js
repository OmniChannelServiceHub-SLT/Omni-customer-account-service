/**
 * VAS Account Mapper – TMF Dialect (create)
 * Returns a bare Account resource. VAS is modeled as an Account subtype
 * with `accountType: 'VAS'` — not a TMF666 resource in its own right.
 */

exports.fromTmfRequest = (req) => {
  const body = req.body || {};

  const accountData = {
    id: body.id || body.vasusername,
    name: body.name || `VAS Account ${body.id || body.vasusername}`,
    description: body.description || 'VAS (Value Added Service) account',
    accountType: 'VAS',
    state: body.state || 'active',
    userKey: body.userKey || null,
    contact: body.contact || [],
    relatedParty: body.relatedParty || [],
    '@type': 'Account',
    '@baseType': body['@baseType'] || 'Account',
    '@schemaLocation': body['@schemaLocation'] || null
  };

  return accountData;
};

exports.toTmfResponse = (account) => {
  const href =
    account.href ||
    `/tmf-api/accountManagement/v4/account/${account.id}`;

  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'Account',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'] || null,
    name: account.name,
    description: account.description,
    accountType: account.accountType || 'VAS',
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
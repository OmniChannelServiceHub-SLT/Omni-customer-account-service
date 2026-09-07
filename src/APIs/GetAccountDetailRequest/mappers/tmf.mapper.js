/**
 * TMF666 Account Mapper – TMF Dialect
 * Returns pure TMF resources (no envelope)
 */

/**
 * Convert Account document → TMF Account resource
 */
exports.toTmfResponse = (account) => {
  return {
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation']
  };
};

/**
 * TMF error shape
 */
exports.toTmfError = (err) => {
  return {
    code: err.code || 'INTERNAL_ERROR',
    reason: err.reason || err.message,
    message: err.message,
    status: err.statusCode || 500
  };
};
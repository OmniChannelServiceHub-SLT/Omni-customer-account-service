/**
 * TMF666 BillingAccount Mapper – TMF Dialect
 * Handles JSON body for POST (create)
 * Returns pure TMF BillingAccount resource (no envelope)
 */

/**
 * Convert TMF request body → database fields
 * Expected body:
 * {
 *   "id": "0037994858",
 *   "name": "Account 0037994858",
 *   "description": "...",
 *   "state": "active",
 *   "relatedParty": [...],
 *   "contact": [...]
 * }
 */
exports.fromTmfRequest = (body) => {
  return {
    id: body.id,
    name: body.name,
    description: body.description,
    state: body.state || 'active',
    relatedParty: body.relatedParty || [],
    contact: body.contact || [],
    '@type': body['@type'] || 'BillingAccount',
    '@baseType': body['@baseType'] || 'Account',
    '@schemaLocation': body['@schemaLocation'] || null,
    // BillingAccount-only fields (pass through if provided)
    accountBalance: body.accountBalance || [],
    accountRelationship: body.accountRelationship || [],
    billStructure: body.billStructure || null,
    creditLimit: body.creditLimit || null,
    defaultPaymentMethod: body.defaultPaymentMethod || null,
    financialAccount: body.financialAccount || null,
    paymentPlan: body.paymentPlan || [],
    taxExemption: body.taxExemption || [],
    userKey: body.userKey || null
  };
};

/**
 * Convert Account document → TMF BillingAccount resource
 */
exports.toTmfResponse = (account) => {
  const href =
    account.href ||
    `/tmf-api/accountManagement/v4/billingAccount/${account.id}`;

  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'BillingAccount',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'] || null,
    name: account.name,
    description: account.description,
    state: account.state || 'active',

    // BillingAccount-specific fields (return what's stored)
    accountBalance: account.accountBalance || [],
    accountRelationship: account.accountRelationship || [],
    billStructure: account.billStructure || null,
    contact: account.contact || [],
    creditLimit: account.creditLimit || null,
    defaultPaymentMethod: account.defaultPaymentMethod || null,
    financialAccount: account.financialAccount || null,
    paymentPlan: account.paymentPlan || [],
    relatedParty: account.relatedParty || [],
    taxExemption: account.taxExemption || []
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
/**
 * TMF666 BillingAccount Mapper – TMF Dialect (PATCH)
 * TMF PATCH semantics = JSON Merge Patch: fields ABSENT from the body
 * are untouched; fields PRESENT are written (including explicit null).
 *
 * `@type` is NOT patchable — resource kind is fixed at creation.
 * See service.js filter { id, '@type': 'BillingAccount' } for the reason.
 */

const PATCHABLE_SCALARS = ['name', 'description', 'state', 'userKey'];

const PATCHABLE_OBJECTS = [
  'relatedParty',
  'contact',
  'accountBalance',
  'accountRelationship',
  'billStructure',
  'creditLimit',
  'defaultPaymentMethod',
  'financialAccount',
  'paymentPlan',
  'taxExemption',
  '@baseType',
  '@schemaLocation'
];

exports.fromTmfRequest = (req) => {
  const body = req.body || {};
  const patch = {};

  for (const key of [...PATCHABLE_SCALARS, ...PATCHABLE_OBJECTS]) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      patch[key] = body[key];
    }
  }

  // id, href, and @type are server-owned; silently ignored if present.
  return patch;
};

exports.toTmfResponse = (account) => {
  const path =
    account['@type'] === 'BillingAccount' ? 'billingAccount' : 'account';
  const href =
    account.href ||
    `/tmf-api/accountManagement/v4/${path}/${account.id}`;

  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'BillingAccount',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'] || null,
    name: account.name,
    description: account.description,
    state: account.state || 'active',

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

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
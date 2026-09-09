/**
 * TMF666 Account Mapper – Legacy Dialect
 * Returns envelope with isSuccess/dataBundle
 * Based on API_Params_SLTOMNI_V2.xlsx sample responses
 */

/**
 * Build full resource (your existing shapeFullResource logic)
 * This can be reused for the dataBundle
 */
function buildFullResource(account) {
  const href = account.href || `${process.env.BASE_URL}/tmf-api/accountManagement/v4/billingAccount/${account.id}`;
  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'BillingAccount',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
    name: account.name,
    description: account.description,
    accountBalance: account.accountBalance || [
      {
        '@type': 'AccountBalance',
        id: `${account.id}-balance-1`,
        balanceType: 'current',
        amount: { unit: 'USD', value: 0 },
        validFor: { startDateTime: new Date().toISOString() },
      },
    ],
    // ... all your other hardcoded nested objects ...
    // (copy your existing shapeFullResource logic here)
    // We'll keep it as-is.
  };
}

/**
 * Convert Account document → Legacy dataBundle
 * We use buildFullResource but then extract only the fields the legacy client expects.
 * Alternatively, you can keep the full resource inside dataBundle if that's what the legacy app expects.
 * Based on the CSV sample, dataBundle should contain: accountNo, telephoneNo, nic, name, state.
 */
exports.toLegacyResponse = (account) => {
  const phone = account.contact?.find(c => c.mediumType === 'Phone');
  const party = account.relatedParty?.[0];

  return {
    isSuccess: true,
    errorMessege: null,
    exceptionDetail: null,
    dataBundle: {
      accountNo: account.id,
      telephoneNo: phone?.characteristic?.phoneNumber || null,
      nic: party?.id || null,
      name: party?.name || account.name,
      state: account.state || 'active'
      // If you want the full resource with nested objects, you can include:
      // fullResource: buildFullResource(account)
    },
    errorShow: null,
    errorCode: null
  };
};

/**
 * Legacy error envelope
 */
exports.toLegacyError = (err) => {
  return {
    isSuccess: false,
    errorMessege: err.message,
    exceptionDetail: null,
    dataBundle: null,
    errorShow: err.message,
    errorCode: err.code || 'ERROR'
  };
};

/**
 * Legacy collection response (list)
 */
exports.toLegacyCollection = (accounts) => {
  return accounts.map(account => this.toLegacyResponse(account));
};
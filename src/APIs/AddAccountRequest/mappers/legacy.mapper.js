/**
 * TMF666 BillingAccount Mapper – Legacy Dialect
 * Handles query-string params for POST (create)
 * Returns envelope with isSuccess/dataBundle
 * Based on API_Params_SLTOMNI_V2.xlsx sample response for A12 (AddAccountRequest)
 */

/**
 * Convert legacy query params → database fields
 * Legacy sends: ?accountNo=0037994858&TelephoneNo=0112053609&nic=741340216V
 */
exports.fromLegacyRequest = (query) => {
  const { accountNo, TelephoneNo, nic, userKey } = query;

  const accountData = {
    id: accountNo,
    name: `Account ${accountNo}`,
    description: `Account for telephone ${TelephoneNo}`,
    state: 'active',
    contact: TelephoneNo
      ? [
          {
            mediumType: 'Phone',
            characteristic: { phoneNumber: TelephoneNo },
            preferred: true
          }
        ]
      : [],
    '@type': 'BillingAccount',
    '@baseType': 'Account',
    '@schemaLocation': null
  };

  if (userKey) {
    accountData.userKey = userKey;
  }

  // NIC is a handoff to the controller — it will look up the Individual
  // and build relatedParty before saving. This temporary field is deleted
  // by the controller before persistence.
  if (nic) {
    accountData._nicForLinking = nic;
  }

  return accountData;
};

/**
 * Convert Account document → Legacy envelope
 * Legacy A12 sample response:
 * {
 *   "isSuccess": true,
 *   "errorMessege": "",
 *   "exceptionDetail": null,
 *   "dataBundle": null,
 *   "errorShow": "",
 *   "errorCode": ""
 * }
 */
exports.toLegacyResponse = (account) => {
  return {
    isSuccess: true,
    errorMessege: null,
    exceptionDetail: null,
    dataBundle: null, // matches legacy A12 sample (no payload returned)
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
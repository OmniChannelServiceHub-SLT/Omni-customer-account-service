/**
 * VAS Account Mapper – Legacy Dialect (create)
 * Params may arrive in query (per CSV A15) OR form-urlencoded body — merge both.
 *
 * ⚠️ No authoritative legacy response sample exists for VASAccountRequest.
 */

exports.fromLegacyRequest = (req) => {
  const params = { ...(req.query || {}), ...(req.body || {}) };
  const vasusername = params.vasusername;
  const userkey = params.userkey;

  const accountData = {
    id: vasusername,
    name: `VAS Account ${vasusername}`,
    description: 'VAS (Value Added Service) account',
    accountType: 'VAS',
    state: 'active',
    userKey: userkey || null,
    contact: vasusername
      ? [
          {
            mediumType: 'Phone',
            characteristic: { phoneNumber: vasusername },
            preferred: true
          }
        ]
      : [],
    '@type': 'Account',
    '@baseType': 'Account',
    '@schemaLocation': null
  };

  return accountData;
};

exports.toLegacyResponse = (account) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: null, // ⚠️ provisional — no sample exists
  errorShow: null,
  errorCode: null
});

exports.toLegacyError = (err) => ({
  isSuccess: false,
  errorMessege: err.message,
  exceptionDetail: null,
  dataBundle: null,
  errorShow: err.message,
  errorCode: err.code || 'ERROR'
});
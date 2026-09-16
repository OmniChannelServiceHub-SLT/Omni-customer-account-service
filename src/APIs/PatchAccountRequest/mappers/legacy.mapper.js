/**
 * TMF666 BillingAccount Mapper – Legacy Dialect (PATCH)
 * Legacy params may arrive in query OR form-urlencoded body — merge both.
 *
 * ⚠️ No authoritative legacy response sample exists for account-update.
 *    Envelope shape mirrors A12 (AddAccountRequest); dataBundle: null.
 */

exports.fromLegacyRequest = (req) => {
  const params = { ...(req.query || {}), ...(req.body || {}) };
  const patch = {};

  if (params.name !== undefined) patch.name = params.name;
  if (params.userKey !== undefined) patch.userKey = params.userKey;
  if (params.state !== undefined) patch.state = params.state;

  // Legacy alternate-contact → TMF contact entry
  if (params.altrContact !== undefined) {
    patch.contact = [
      {
        mediumType: 'Phone',
        characteristic: { phoneNumber: params.altrContact },
        preferred: true
      }
    ];
  }

  // NIC handoff — controller resolves Individual and rewrites relatedParty,
  // then deletes _nicForLinking before persistence.
  if (params.nic !== undefined) {
    patch._nicForLinking = params.nic;
  }

  return patch;
};

exports.toLegacyResponse = (account) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: null, // ⚠️ provisional — no sample exists for update
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
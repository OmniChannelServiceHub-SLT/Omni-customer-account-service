/**
 * TMF666 Account Mapper – Legacy Dialect (remove)
 * Envelope shape follows A12 (AddAccountRequest): dataBundle: null on success.
 *
 * ⚠️ No authoritative legacy response sample exists for RemoveAccountRequest.
 */

exports.toLegacyResponse = (account) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: null,
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
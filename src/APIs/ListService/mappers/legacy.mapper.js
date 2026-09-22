/**
 * GetServiceDetailRequest Mapper – Legacy Dialect (GET)
 * ⚠️ No sample response. Envelope per A12 convention.
 */

const mapAccount = (account) => ({
  id: account.id,
  name: account.name,
  description: account.description,
  state: account.state || 'active',
  relatedParty: account.relatedParty || [],
  contact: account.contact || [],
  userKey: account.userKey || null,
  characteristic: account.characteristic || []
});

exports.toLegacyResponse = (accounts) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: accounts.map(mapAccount),
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
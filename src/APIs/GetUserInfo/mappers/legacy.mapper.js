/**
 * GetUserInfo Mapper – Legacy Dialect
 * Envelope per A92 (ViewUserInfo). dataBundle carries name + altrContact.
 */

exports.toLegacyResponse = (individual) => ({
  isSuccess: true,
  errorMessege: null,
  exceptionDetail: null,
  dataBundle: {
    name: individual.name,
    altrContact:
      individual.contactMedium?.find((c) => c.mediumType === 'Phone')
        ?.characteristic?.phoneNumber || null
  },
  errorShow: null,
  errorCode: null
});

exports.toLegacyError = (err) => ({
  isSuccess: false,
  errorMessege: err.message,
  exceptionDetail: null,
  dataBundle: null,
  errorShow: null,
  errorCode: err.code || 'ERROR'
});
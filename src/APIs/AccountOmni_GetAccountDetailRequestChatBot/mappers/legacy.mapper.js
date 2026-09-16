/**
 * TMF666 Account Mapper – Legacy Dialect (GET single, ChatBot variant)
 * Envelope shape mirrors A12/A13 conventions. dataBundle carries a flat
 * account view for the ChatBot client.
 */

exports.toLegacyResponse = (account) => {
  const phone = Array.isArray(account.contact)
    ? account.contact.find((c) => c && c.mediumType === 'Phone')
    : null;

  const party = Array.isArray(account.relatedParty)
    ? account.relatedParty[0]
    : null;

  return {
    isSuccess: true,
    errorMessege: null,
    exceptionDetail: null,
    dataBundle: {
      accountNo: account.id,
      telephoneNo: phone?.characteristic?.phoneNumber || null,
      nic: party?.id || null,
      name: party?.name || account.name || null,
      state: account.state || 'active',
      userKey: account.userKey || null
    },
    errorShow: null,
    errorCode: null
  };
};

exports.toLegacyError = (err) => ({
  isSuccess: false,
  errorMessege: err.message,
  exceptionDetail: null,
  dataBundle: null,
  errorShow: err.message,
  errorCode: err.code || 'ERROR'
});
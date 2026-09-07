const service = require('../services/service');

/**
 * TMF666-compliant GET /account/chatbot?accountNo=XXX
 * Returns pure TMF666 Account resource – NO legacy envelope.
 */
exports.getAccountDetailChatBot = async (req, res) => {
  const { accountNo } = req.query;

  if (!accountNo) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'accountNo query parameter is required'
    });
  }

  const account = await service.getAccountByAccountNo(accountNo);

  if (!account) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with accountNo ${accountNo} not found`
    });
  }

  // Build TMF666 Account resource
  const resource = {
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    userKey: account.userKey,
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation']
  };

  res.status(200).json(resource);
};

/**
 * Legacy wrapper for ChatBot client:
 * GET /api/AccountOMNI/GetAccountDetailRequestChatBot?accountNo=XXX
 * Returns the legacy { isSuccess, dataBundle } envelope.
 */
exports.getAccountDetailChatBotLegacy = async (req, res) => {
  const { accountNo } = req.query;

  if (!accountNo) {
    return res.status(400).json({
      isSuccess: false,
      errorMessege: 'Missing accountNo query parameter',
      exceptionDetail: null,
      dataBundle: null,
      errorShow: null,
      errorCode: 'MISSING_ACCOUNTNO'
    });
  }

  const account = await service.getAccountByAccountNo(accountNo);

  if (!account) {
    return res.status(404).json({
      isSuccess: false,
      errorMessege: `Account with accountNo ${accountNo} not found`,
      exceptionDetail: null,
      dataBundle: null,
      errorShow: null,
      errorCode: 'NOT_FOUND'
    });
  }

  // Map to legacy flat shape
  const phone = account.contact?.find(c => c.mediumType === 'Phone');
  const party = account.relatedParty?.[0];

  const dataBundle = {
    accountNo: account.id,
    telephoneNo: phone?.characteristic?.phoneNumber || null,
    nic: party?.id || null,
    name: party?.name || account.name,
    state: account.state || 'active',
    userKey: account.userKey || null
  };

  res.json({
    isSuccess: true,
    errorMessege: null,
    exceptionDetail: null,
    dataBundle,
    errorShow: null,
    errorCode: null
  });
};
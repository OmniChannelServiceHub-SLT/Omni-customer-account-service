const service = require('../services/addAccountRequest.service');

exports.createAccount = async (req, res) => {
  const accountData = req.body;  // ← Use request body, not query

  // Check for required fields (TMF standard)
  if (!accountData.id) {
    return res.status(400).json({
      code: 'MISSING_ID',
      message: 'Account id is required'
    });
  }

  // Check if account already exists
  const existingAccount = await service.findAccountByAccountNo(accountData.id);
  if (existingAccount) {
    return res.status(409).json({
      code: 'DUPLICATE_ACCOUNT',
      message: `Account with id ${accountData.id} already exists`,
    });
  }

  // Create the account (accountData is already TMF-shaped)
  const account = await service.createAccount(accountData);

  // Return pure TMF Account resource (no envelope)
  res.status(201).json({
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
  });
};
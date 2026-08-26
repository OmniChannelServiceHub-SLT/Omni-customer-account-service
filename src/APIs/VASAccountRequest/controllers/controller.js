const service = require('../services/service');

exports.createVasAccount = async (req, res) => {
  const { vasusername, userkey } = req.query;

  // Validate required fields
  if (!vasusername || !userkey) {
    return res.status(400).json({
      code: 'MISSING_PARAMETERS',
      message: 'vasusername and userkey are required query parameters',
    });
  }

  // Check if account already exists
  const existing = await service.findAccountById(vasusername);
  if (existing) {
    return res.status(409).json({
      code: 'DUPLICATE_ACCOUNT',
      message: `VAS Account with id ${vasusername} already exists`,
    });
  }

  // Build TMF Account resource for VAS
  const accountData = {
    id: vasusername,
    name: `VAS Account ${vasusername}`,
    description: 'VAS (Value Added Service) account',
    accountType: 'VAS',
    state: 'active',
    userKey: userkey, // store for legacy compatibility
    contact: [
      {
        mediumType: 'Phone',
        characteristic: { phoneNumber: vasusername }, // often username is phone
        preferred: true,
      },
    ],
  };

  const account = await service.createAccount(accountData);

  // Return pure TMF Account resource
  res.status(201).json({
    id: account.id,
    href: account.href,
    '@type': account['@type'],
    name: account.name,
    description: account.description,
    accountType: account.accountType,
    state: account.state,
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'],
    '@schemaLocation': account['@schemaLocation'],
  });
};
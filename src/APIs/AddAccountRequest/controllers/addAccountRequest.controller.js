const service = require('../services/addAccountRequest.service');

exports.createAccount = async (req, res) => {
  const { accountNo, TelephoneNo, nic } = req.query;

  // Check if account already exists (duplicate prevention)
  const existingAccount = await service.findAccountByAccountNo(accountNo);
  if (existingAccount) {
    return res.status(409).json({
      code: 'DUPLICATE_ACCOUNT',
      message: `Account with id ${accountNo} already exists`,
    });
  }

  // Build TMF Account resource
  const accountData = {
    id: accountNo,
    name: `Account ${accountNo}`,
    description: `Account for telephone ${TelephoneNo}`,
    state: 'active',
    contact: [
      {
        mediumType: 'Phone',
        characteristic: { phoneNumber: TelephoneNo },
        preferred: true,
      },
    ],
  };

  // If NIC is provided, link to existing Individual (Party)
  if (nic) {
    const individual = await service.findIndividualByNIC(nic);
    if (individual) {
      accountData.relatedParty = [
        {
          id: individual.id,
          href: individual.href || `/tmf-api/partyManagement/v4/individual/${individual.id}`,
          name: individual.name,
          role: 'Owner',
          '@referredType': 'Individual',
        },
      ];
    }
    // If no individual found, we still create the account without relatedParty
    // (matches legacy behavior - doesn't fail if NIC not found)
  }

  // Create the account
  const account = await service.createAccount(accountData);

  // Return pure TMF Account resource (no envelope)
  res.status(201).json({
    id: account.id,
    href: account.href,
    '@type': account['@type'],
    name: account.name,
    description: account.description,
    state: account.state,
    relatedParty: account.relatedParty,
    contact: account.contact,
    '@baseType': account['@baseType'],
    '@schemaLocation': account['@schemaLocation'],
  });
};
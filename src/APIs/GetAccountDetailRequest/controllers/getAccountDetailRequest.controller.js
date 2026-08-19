const service = require('../services/getAccountDetailRequest.service');

exports.getAccount = async (req, res) => {
  const { id } = req.params;  // accountNo from the URL

  const account = await service.getAccountById(id);

  if (!account) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with id ${id} not found`,
    });
  }

  // Return pure TMF Account resource (no envelope)
  res.json({
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state,
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
  });
};
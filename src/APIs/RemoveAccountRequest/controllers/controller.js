const service = require('../services/service');

exports.deleteAccount = async (req, res) => {
  const { id } = req.params; // accountNo from URL

  // Check if account exists
  const account = await service.getAccountById(id);
  if (!account) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with id ${id} not found`,
    });
  }

  // Delete the account
  await service.removeAccountById(id);

  // Return success with the deleted account resource
  res.json({
    id: account.id,
    href: account.href,
    '@type': account['@type'],
    name: account.name,
    description: account.description,
    state: 'terminated', // or 'deleted'
    relatedParty: account.relatedParty,
    contact: account.contact,
    '@baseType': account['@baseType'],
    '@schemaLocation': account['@schemaLocation'],
  });
};
const service = require('../services/service');

exports.deleteAccount = async (req, res) => {
  const { id } = req.params; // accountNo

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

  // TMF standard: 204 No Content on successful delete
  res.status(204).send();
};
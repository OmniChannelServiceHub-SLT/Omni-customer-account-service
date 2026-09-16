const service = require('../services/service');
const mappers = require('../mappers');

exports.createVasAccount = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    const accountData =
      req.clientType === 'tmf'
        ? mapper.fromTmfRequest(req)
        : mapper.fromLegacyRequest(req);

    if (!accountData.id || !accountData.userKey) {
      const err = new Error('vasusername and userkey are required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETERS';
      return next(err);
    }

    const existing = await service.findAccountById(accountData.id);
    if (existing) {
      const err = new Error(
        `VAS Account with id ${accountData.id} already exists`
      );
      err.statusCode = 409;
      err.code = 'DUPLICATE_ACCOUNT';
      return next(err);
    }

    const account = await service.createAccount(accountData);

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(account)
        : mapper.toLegacyResponse(account);

    res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
};
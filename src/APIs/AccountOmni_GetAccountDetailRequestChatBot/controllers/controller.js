const service = require('../services/service');
const mappers = require('../mappers');

exports.getAccountDetailChatBot = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;
    const accountNo = req.query.accountNo || req.params.id;

    if (!accountNo) {
      const err = new Error('accountNo is required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    const account = await service.getAccountByAccountNo(accountNo);

    if (!account) {
      const err = new Error(`Account with accountNo ${accountNo} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(account)
        : mapper.toLegacyResponse(account);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
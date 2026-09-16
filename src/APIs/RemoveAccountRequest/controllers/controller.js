const service = require('../services/service');

const mappers = require('../mappers');

exports.removeAccount = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;
    const id = req.params.id || req.query.accountNo || req.body?.accountNo;

    if (!id) {
      const err = new Error('accountNo is required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    const account = await service.getAccountById(id);
    if (!account) {
      const err = new Error(`Account with id ${id} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    await service.removeAccountById(id);

    // TMF666 DELETE → 204 no body
    if (req.clientType === 'tmf') {
      return res.status(204).send();
    }

    // Legacy → 200 with envelope
    res.status(200).json(mapper.toLegacyResponse(account));
  } catch (err) {
    next(err);
  }
};
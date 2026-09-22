const service = require('../services/service');
const mappers = require('../mappers');

exports.getServiceDetail = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    // CSV A73 uses telephoneNo; accept case variants.
    const telephoneNo =
      req.query.telephoneNo || req.query.telephoneno || req.query.tpNo;

    if (!telephoneNo) {
      const err = new Error('telephoneNo query parameter is required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    const accounts = await service.findProductsByTelephone(telephoneNo);

    // Empty result is a valid answer, not a 404 — see dashboard endpoint.
    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(accounts)
        : mapper.toLegacyResponse(accounts);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
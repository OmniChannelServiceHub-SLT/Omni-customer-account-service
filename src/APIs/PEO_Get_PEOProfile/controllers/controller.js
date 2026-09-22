const service = require('../services/service');

const mappers = require('../mappers');

exports.getPEOProfile = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    const subscriberID =
      req.query.subscriberID ||
      req.query.subscriberid ||
      req.query.subscriberId;
    const accountNo = req.query.accountNo || req.query.accountno;

    if (!subscriberID && !accountNo) {
      const err = new Error(
        'Either subscriberID or accountNo query parameter is required'
      );
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    // Try subscriberID first, fall back to accountNo (preserved behaviour)
    let individual = null;
    if (subscriberID) {
      individual = await service.findBySubscriberID(subscriberID);
    }
    if (!individual && accountNo) {
      individual = await service.findByAccountNo(accountNo);
    }

    if (!individual) {
      const identifier = subscriberID || accountNo;
      const err = new Error(`PEO profile for ${identifier} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(individual)
        : mapper.toLegacyResponse(individual);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
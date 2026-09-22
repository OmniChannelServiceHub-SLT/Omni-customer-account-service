const service = require('../services/service');

const mappers = require('../mappers');

exports.getDashboard = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    const filter = {};
    const status = req.query.status;
    if (status) filter.status = status;

    const individuals = await service.getAllIndividuals(filter);

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(individuals)
        : mapper.toLegacyResponse(individuals);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
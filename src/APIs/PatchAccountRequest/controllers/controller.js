const service = require('../services/service');
const mappers = require('../mappers');
const individualService = require('../../AddAccountRequest/services/addAccountRequest.service');

exports.patchAccount = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;
    const { id } = req.params;

    const existing = await service.getAccountById(id);
    if (!existing) {
      const err = new Error(`Account with id ${id} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    const patch =
      req.clientType === 'tmf'
        ? mapper.fromTmfRequest(req)
        : mapper.fromLegacyRequest(req);

    if (patch._nicForLinking) {
      const individual = await individualService.findIndividualByNIC(
        patch._nicForLinking
      );
      if (individual) {
        patch.relatedParty = [
          {
            id: individual.id,
            href:
              individual.href ||
              `/tmf-api/party/v4/individual/${individual.id}`,
            name: individual.name,
            role: 'Owner',
            '@referredType': 'Individual'
          }
        ];
      }
      delete patch._nicForLinking;
    }

    const updated = await service.updateAccount(id, patch);

    if (!updated) {
      const err = new Error(`Account with id ${id} disappeared mid-update`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    const payload =
      req.clientType === 'tmf'
        ? mapper.toTmfResponse(updated)
        : mapper.toLegacyResponse(updated);

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};

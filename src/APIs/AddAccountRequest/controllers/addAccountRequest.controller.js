const service = require('../services/addAccountRequest.service');
const mappers = require('../mappers');
const crypto = require('crypto');

exports.createAccount = async (req, res, next) => {
  try {
    // 1. Pick mapper based on client type
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    // 2. Extract request data based on client type
    let accountData;
    if (req.clientType === 'tmf') {
      accountData = mapper.fromTmfRequest(req.body);

      if (!accountData.id) {
        // If no id provided, generate one (matches your original behaviour)
        accountData.id = crypto.randomUUID();
      }
    } else {
      accountData = mapper.fromLegacyRequest(req.query);

      if (!accountData.id) {
        const err = new Error('accountNo query parameter is required');
        err.statusCode = 400;
        err.code = 'MISSING_ACCOUNTNO';
        return next(err);
      }
    }

    // 3. Duplicate check
    const existing = await service.findAccountByAccountNo(accountData.id);
    if (existing) {
      const err = new Error(`Account with id ${accountData.id} already exists`);
      err.statusCode = 409;
      err.code = 'DUPLICATE_ACCOUNT';
      return next(err);
    }

    // 4. Legacy NIC linking (only set by legacy mapper)
    if (accountData._nicForLinking) {
      const individual = await service.findIndividualByNIC(accountData._nicForLinking);
      if (individual) {
        accountData.relatedParty = [
          {
            id: individual.id,
            href: individual.href || `/tmf-api/partyManagement/v4/individual/${individual.id}`,
            name: individual.name,
            role: 'Owner',
            '@referredType': 'Individual'
          }
        ];
      }
      delete accountData._nicForLinking;
    }

    // 5. Create account
    const account = await service.createAccount(accountData);

    // 6. ✅ Branch response by client type
    if (req.clientType === 'tmf') {
      res.status(201).json(mapper.toTmfResponse(account));
    } else {
      res.status(201).json(mapper.toLegacyResponse(account));
    }

  } catch (err) {
    next(err);
  }
};
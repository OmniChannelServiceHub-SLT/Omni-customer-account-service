const service = require('../services/service');
const crypto = require('crypto');

exports.addAccountRequestLTE = async (req, res, next) => {
  try {
    // CSV A160: params arrive as query string
    const nic = req.query.nic || req.body?.nic;
    const telephoneNo =
      req.query.TelephoneNo ||
      req.query.telephoneNo ||
      req.body?.TelephoneNo ||
      req.body?.telephoneNo;

    if (!telephoneNo) {
      return res.status(400).json({
        code: 'MISSING_PARAMETER',
        reason: 'TelephoneNo is required',
        message: 'TelephoneNo query parameter is required',
        status: 400
      });
    }

    // id derives from the telephoneNo (no accountNo in this operation)
    const accountId = telephoneNo;

    const existing = await service.findAccountById(accountId);
    if (existing) {
      return res.status(409).json({
        code: 'DUPLICATE_ACCOUNT',
        reason: 'Account already exists',
        message: `Account with id ${accountId} already exists`,
        status: 409
      });
    }

    const accountData = {
      id: accountId,
      name: `LTE Prepaid Account ${telephoneNo}`,
      description: `LTE Prepaid account for telephone ${telephoneNo}`,
      state: 'active',
      contact: [
        {
          mediumType: 'Phone',
          characteristic: { phoneNumber: telephoneNo },
          preferred: true
        }
      ],
      '@type': 'Account',
      '@baseType': 'Account',
      '@schemaLocation': null
    };

    // NIC linking — if the Individual exists, wire relatedParty
    if (nic) {
      const individual = await service.findIndividualByNIC(nic);
      if (individual) {
        accountData.relatedParty = [
          {
            id: individual.id,
            href: individual.href,
            name: individual.name,
            role: 'Owner',
            '@referredType': 'Individual'
          }
        ];
      }
    }

    const account = await service.createAccount(accountData);

    // TMF666 Account resource
    res.status(201).json({
      id: account.id,
      href:
        account.href ||
        `/tmf-api/accountManagement/v4/account/${account.id}`,
      '@type': account['@type'] || 'Account',
      '@baseType': account['@baseType'] || 'Account',
      '@schemaLocation': account['@schemaLocation'] || null,
      name: account.name,
      description: account.description,
      state: account.state || 'active',
      relatedParty: account.relatedParty || [],
      contact: account.contact || [],
      userKey: account.userKey || null
    });
  } catch (err) {
    next(err);
  }
};
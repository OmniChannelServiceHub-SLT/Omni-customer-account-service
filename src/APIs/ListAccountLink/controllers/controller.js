const service = require('../services/service');

exports.checkOmniTP = async (req, res, next) => {
  try {
    const telephoneNo =
      req.query.telephoneNo || req.query.telephoneno || req.query.tpNo;

    if (!telephoneNo) {
      return res.status(400).json({
        code: 'MISSING_PARAMETER',
        reason: 'telephoneNo is required',
        message: 'telephoneNo query parameter is required',
        status: 400
      });
    }

    const account = await service.checkOmniTP(telephoneNo);

    if (!account) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'No Account found for telephone number',
        message: `No Account found for telephoneNo ${telephoneNo}`,
        status: 404
      });
    }

    // TMF666 Account resource
    res.status(200).json({
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
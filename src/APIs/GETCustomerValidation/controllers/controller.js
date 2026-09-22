const service = require('../services/service');
const mappers = require('../mappers');

exports.validateCustomer = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    // CSV A131 uses telephoneNo; accept case variants.
    const telephoneNo =
      req.query.telephoneNo || req.query.telephoneno || req.query.tpNo;

    if (!telephoneNo) {
      const err = new Error('telephoneNo query parameter is required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    const customer = await service.findCustomerByTelephone(telephoneNo);

    if (!customer) {
      const err = new Error(`Customer with telephone ${telephoneNo} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    let payload;
    if (req.clientType === 'tmf') {
      const accounts = await service.findAccountsByCustomer(customer.id);
      payload = mapper.toTmfResponse(customer, accounts);
    } else {
      payload = mapper.toLegacyResponse(customer);
    }

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
const service = require('../services/service');
const mappers = require('../mappers');

exports.checkExistCustomer = async (req, res, next) => {
  try {
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    // CSV A113 uses uppercase NIC; accept case variants.
    const nic = req.query.NIC || req.query.nic || req.query.Nic;

    if (!nic) {
      const err = new Error('NIC query parameter is required');
      err.statusCode = 400;
      err.code = 'MISSING_PARAMETER';
      return next(err);
    }

    const customer = await service.findCustomerByNIC(nic);

    if (!customer) {
      const err = new Error(`Customer with NIC ${nic} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    let payload;
    if (req.clientType === 'tmf') {
      // Accounts only needed for the TMF projection (account[] refs)
      const accounts = await service.findAccountsByCustomer(nic);
      payload = mapper.toTmfResponse(customer, accounts);
    } else {
      payload = mapper.toLegacyResponse(customer);
    }

    res.status(200).json(payload);
  } catch (err) {
    next(err);
  }
};
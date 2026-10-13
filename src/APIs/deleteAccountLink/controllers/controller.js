const service = require('../services/service');

exports.removeAccountRequestLTE = async (req, res, next) => {
  try {
    // CSV A161: params arrive as query string
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

    // Account id derives from telephoneNo — matches AddAccountRequestLTE.
    const accountId = telephoneNo;

    const account = await service.findAccountById(accountId);
    if (!account) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        reason: 'Account not found',
        message: `Account with id ${accountId} not found`,
        status: 404
      });
    }

    await service.removeAccountById(accountId);

    // TMF666 DELETE semantics → 204 no body.
    // POST here (CSV A161 uses POST), so we still return 204 to match
    // DELETE behaviour across the service. Confirm with the legacy
    // client if it expects a body — if so, return the terminated
    // Account resource instead.
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
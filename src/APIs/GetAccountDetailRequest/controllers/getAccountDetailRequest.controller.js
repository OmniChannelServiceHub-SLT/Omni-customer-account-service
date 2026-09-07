const service = require('../services/getAccountDetailRequest.service');
const mappers = require('../mappers');

/**
 * Field selection helper (for TMF)
 */
function applyFieldSelection(resource, fieldsParam) {
  if (!fieldsParam) return resource;
  const requested = fieldsParam.split(',').map(f => f.trim());
  const always = ['@type', 'id', 'href'];
  const keep = new Set([...always, ...requested]);
  const result = {};
  for (const key of Object.keys(resource)) {
    if (keep.has(key)) result[key] = resource[key];
  }
  return result;
}

/**
 * GET /account/{id}
 * Serves BOTH TMF and legacy dialects based on req.clientType
 */
exports.getAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await service.getAccountById(id);

    if (!account) {
      const err = new Error(`Account with id ${id} not found`);
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      return next(err);
    }

    // Pick mapper based on client type
    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    let response;
    if (req.clientType === 'tmf') {
      // TMF: pure resource
      response = mapper.toTmfResponse(account);
      // Apply field selection if requested
      if (req.query.fields) {
        response = applyFieldSelection(response, req.query.fields);
      }
    } else {
      // Legacy: envelope with dataBundle
      response = mapper.toLegacyResponse(account);
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /account (collection)
 * Serves BOTH TMF and legacy dialects based on req.clientType
 */
exports.listAccounts = async (req, res, next) => {
  try {
    const { name, fields } = req.query;

    const filter = {};
    if (name) filter.name = name;

    const accounts = await service.listAccounts(filter);

    const mapper = req.clientType === 'tmf' ? mappers.tmf : mappers.legacy;

    let result;
    if (req.clientType === 'tmf') {
      // TMF: array of pure resources
      result = accounts.map(account => mapper.toTmfResponse(account));

      // Field selection for TMF
      if (fields) {
        const requested = fields.split(',').map(f => f.trim());
        const always = ['@type', 'id', 'href'];
        const keep = new Set([...always, ...requested]);
        result = result.map(item => {
          const filtered = {};
          for (const key of Object.keys(item)) {
            if (keep.has(key)) filtered[key] = item[key];
          }
          return filtered;
        });
      }
    } else {
      // Legacy: array of envelopes
      result = accounts.map(account => mapper.toLegacyResponse(account));
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
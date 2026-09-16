/**
 * TMF666 Account Mapper – TMF Dialect (DELETE)
 * No request body to map. No success body to map either — TMF666 DELETE
 * responds 204 with an empty body. This file exists for interface parity
 * with the other API folders and to hold the TMF error shape.
 */

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
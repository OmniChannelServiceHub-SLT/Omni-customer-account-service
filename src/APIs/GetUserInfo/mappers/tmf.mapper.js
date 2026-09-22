/**
 * GetUserInfo Mapper – TMF Dialect
 *
 * ⚠️ CTK-VERIFIED OUTPUT. Do not change field order, field names, or
 *    defaults without re-running CTK. Single and list shapes differ
 *    deliberately — preserved from the pre-mapper controller.
 */

exports.toTmfResponse = (individual) => ({
  id: individual.id,
  href:
    individual.href ||
    `/tmf-api/partyManagement/v4/individual/${individual.id}`,
  '@type': individual['@type'] || 'Individual',
  name: individual.name,
  givenName: individual.givenName,
  familyName: individual.familyName,
  contactMedium: individual.contactMedium,
  status: individual.status,
  '@baseType': individual['@baseType'] || 'Individual',
  '@schemaLocation': individual['@schemaLocation']
});

exports.toTmfListResponse = (individuals, fields) => {
  const selectedFields = fields ? fields.split(',') : null;

  return individuals.map((ind) => {
    const resource = {
      id: ind.id,
      href:
        ind.href ||
        `/tmf-api/partyManagement/v4/individual/${ind.id}`,
      '@type': ind['@type'] || 'Individual',
      name: ind.name,
      givenName: ind.givenName,
      familyName: ind.familyName,
      contactMedium: ind.contactMedium || [],
      status: ind.status || 'active',
      '@baseType': ind['@baseType'] || 'Individual',
      '@schemaLocation': ind['@schemaLocation']
    };

    if (selectedFields) {
      const filtered = {};
      selectedFields.forEach((field) => {
        if (field in resource) filtered[field] = resource[field];
      });
      return filtered;
    }

    return resource;
  });
};

exports.toTmfError = (err) => ({
  code: err.code || 'INTERNAL_ERROR',
  reason: err.reason || err.message,
  message: err.message,
  status: err.statusCode || 500
});
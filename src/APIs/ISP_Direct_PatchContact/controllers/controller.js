const service = require('../services/service');

/**
 * TMF632-compliant PATCH to update Individual by telephone number (tpNo)
 * Body expects TMF Individual fields (name, contactMedium, etc.)
 */
exports.updateISPContact = async (req, res) => {
  const { tpNo } = req.query;

  if (!tpNo) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'tpNo query parameter is required'
    });
  }

  const updateData = req.body;

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({
      code: 'MISSING_DATA',
      message: 'Request body must contain TMF Individual fields to update'
    });
  }

  // Find Individual by telephone number
  const individual = await service.findIndividualByTelephone(tpNo);

  if (!individual) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Individual with telephone ${tpNo} not found`
    });
  }

  // Update the Individual (partial update)
  const updated = await service.updateIndividual(individual.id, updateData);

  // Return pure TMF632 Individual resource
  res.json({
    id: updated.id,
    href: updated.href || `/tmf-api/partyManagement/v4/individual/${updated.id}`,
    '@type': updated['@type'] || 'Individual',
    name: updated.name,
    givenName: updated.givenName,
    familyName: updated.familyName,
    contactMedium: updated.contactMedium || [],
    status: updated.status || 'active',
    '@baseType': updated['@baseType'] || 'Individual',
    '@schemaLocation': updated['@schemaLocation']
  });
};
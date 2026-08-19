const service = require('../services/updateUserInfo.service');

// TMF632‑compliant PATCH (for CTK)
/*
exports.updateIndividual = async (req, res) => {
  const { id } = req.params;
  const updated = await service.updateIndividualById(id, req.body);

  if (!updated) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Individual with id ${id} not found`,
    });
  }

  res.json({
    id: updated.id,
    href: updated.href || `/tmf-api/partyManagement/v4/individual/${updated.id}`,
    '@type': updated['@type'],
    name: updated.name,
    givenName: updated.givenName,
    familyName: updated.familyName,
    contactMedium: updated.contactMedium,
    status: updated.status,
  });
};
*/


exports.updateIndividual = async (req, res) => {
  const { id } = req.params;              // userName goes in the path
  const updateData = req.body;            // pure TMF fields (name, contactMedium, etc.)

  const updated = await service.updateIndividualById(id, updateData);

  if (!updated) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Individual with id ${id} not found`,
    });
  }

  // Return pure TMF resource – no envelope
  res.json({
    id: updated.id,
    href: updated.href || `/tmf-api/partyManagement/v4/individual/${updated.id}`,
    '@type': updated['@type'],
    name: updated.name,
    givenName: updated.givenName,
    familyName: updated.familyName,
    contactMedium: updated.contactMedium,
    status: updated.status,
  });
};
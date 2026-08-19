const service = require('../services/service');

exports.updateContact = async (req, res) => {
  const { id } = req.params;          // subscriberID in path
  const updateData = req.body;        // TMF Individual fields

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({
      code: 'MISSING_DATA',
      message: 'Request body must contain TMF Individual fields to update',
    });
  }

  const updated = await service.updateIndividualById(id, updateData);

  if (!updated) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Individual with id ${id} not found`,
    });
  }

  // Build full TMF Individual response (including extended fields)
  const response = {
    id: updated.id,
    href: updated.href,
    '@type': updated['@type'],
    name: updated.name,
    givenName: updated.givenName,
    familyName: updated.familyName,
    contactMedium: updated.contactMedium,
    status: updated.status,
    // Extended legacy fields (from GetProfile)
    subscriber_package: updated.subscriber_package,
    subscriber_package_display: updated.subscriber_package_display,
    subscriber_package_type: updated.subscriber_package_type,
    first_bill_date: updated.first_bill_date,
    billing_date: updated.billing_date,
    blocked: updated.blocked,
    registered: updated.registered,
    privileges: updated.privileges,
    happy_day: updated.happy_day,
    '@baseType': updated['@baseType'],
    '@schemaLocation': updated['@schemaLocation'],
  };

  res.json(response);
};
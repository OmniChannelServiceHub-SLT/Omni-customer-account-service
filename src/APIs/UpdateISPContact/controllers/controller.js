const service = require('../services/service');

exports.updateISPContact = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

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

  // Return full TMF Individual resource (including extended fields)
  res.json({
    id: updated.id,
    href: updated.href,
    '@type': updated['@type'],
    name: updated.name,
    givenName: updated.givenName,
    familyName: updated.familyName,
    contactMedium: updated.contactMedium,
    status: updated.status,
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
  });
};